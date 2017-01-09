//main canvas
var CANVAS;
// GL context
var GL;

//all game objects
var GameObjs={};
GameObjs.TANKs=[];
GameObjs.Player=null;
GameObjs.SHOTs= []
GameObjs.fixes=[];
GameObjs.houses=[];
GameObjs.shotBuffer;
GameObjs.Teams=[];
GameObjs.Explotions=[];
GameObjs.ExplotionsBig=[];
GameObjs.Walls=[];
GameObjs.Msgs=[];
GameObjs.DoomDayFs=[];

//main matrix
mvMatrix=Matrix.I(4);


//game time 
var StartedIn =(new Date).getTime()/1000;


//load meshes and buffers vars
var MESHES_LOADEDr=false;
var MESHES_LOADEDg=false;
var MESHES_LOADEDb=false;
var MESHES_LOADEDf=false;
var MESHES_LOADEDspeedShot=false;
var MESHES_LOADEDStrongShot=false;
var MESHES_LOADEDBigBoom=false;
var MESHES_LOADEDTeamHouseBlue=false;
var MESHES_LOADEDTeamHouseRed=false;
var MESHES_LOADEDTeamHouseGreen=false;
var MESHES_LOADEDDoomDay=false;
var dtankMesh;
var RedtankMesh;
var GreentankMesh;
var BluetankMesh;
var YellowBoxMesh=null;
var GreenBoxMesh=null;
var RedBoxMesh=null;
var BlueBoxMesh=null;
var shotBufferRed=null;
var shotBufferBlue=null;
var shotBufferGreen=null;
var shotBufferYellow=null;



//2d map and text
var ctx;
var ctxMap;
var textCanvas;
var MapCanvas;
var once=false;


//cam vars
var randX=0;var randZ=0;var randXm=-10;var randZm=-10;
var doRec=true;var fullRot=0;var randRm=0;var fullX=0;var fullXm=0;var fullZ=0;var fullZm=0;


//delete object from array
function deleteObject(array,index){
  delete(array[index]);
  array.splice(index, 1);
}

//team class
function Team(){
  this.x=0;
  this.z=0;
  this.TankMesh;
  this.TeamHouseMesh;
  this.ID;
  this.color;
}


//rebuild tanks array
function rebuild(){
  var tary=[];
  for(var itank =0 ; itank < GameObjs.TANKs.length; itank ++){
    if(GameObjs.TANKs[itank].dead==false || GameObjs.TANKs[itank].x<800){
      tary.push(GameObjs.TANKs[itank]);
    }
  }
  if(GameObjs.Player!=null){
    if(GameObjs.Player.dead==true || GameObjs.Player.x>800){
      GameObjs.Player=null;
    }
  }

  GameObjs.TANKs=tary;
}
setInterval(function(){
  rebuildS();

},1000);
setInterval(function(){
  rebuild();

},1000);


//rebuild shots array
function rebuildS(){
  var tary=[];
  for(var igs =0 ; igs < GameObjs.SHOTs.length; igs ++){
    if(!GameObjs.SHOTs[igs].IsOutRang  || GameObjs.SHOTs[igs].x < 800 ){
      tary.push(GameObjs.SHOTs[igs]);
    }
  }
  GameObjs.SHOTs=tary;

}


//get time in secs or ms
function getSecs(ms){
  if(ms)
    return (new Date().getTime() );
  else
    return (new Date().getTime() / 1000);
}

//to limit shoting 
var shots_time=getSecs(true);
var shots_times=getSecs(true);


//set random camera
function randomCam(){
    randX=randNumber(7,-6);
    randZ=randNumber(7,-6);
}

//get random number
function randNumber(max,min){
  return Math.floor((Math.random()*max))+min;
}

//get random number float
function randNumberF(max,min){
  return (Math.random()*max)+min;
}


//start the game
function start(){

  // Getting Canvas Dom
  CANVAS = document.getElementById("game");
  CANVAS.width=window.innerWidth;
  CANVAS.height=window.innerHeight;

  // init webgl cavas 
  initWebGL(CANVAS);  

  if (GL) {
      GL.clearColor(0.02, 0.02, 0.02, 1.0);  // Clear to black, fully opaque
      GL.clearDepth(3.0);                 // Clear everything
      GL.enable(GL.DEPTH_TEST);           // Enable depth testing
      GL.depthFunc(GL.LEQUAL);            // Near things obscure far things

      initBuffers(GL);


        (function() {
          var lastTime = 0;
          var vendors = ['ms', 'moz', 'webkit', 'o'];
          for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                           || window[vendors[x]+'CancelRequestAnimationFrame'];
          }

          if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function(callback, element) {
              var currTime = new Date().getTime();
              var timeToCall = Math.max(0, 16 - (currTime - lastTime));
              var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
              lastTime = currTime + timeToCall;
              return id;
            };

          if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function(id) {
              clearTimeout(id);
            };
        }());
        window.requestAnimationFrame(drawScene);
      
    }
}


//initialize webgl
function initWebGL(canvas){

  GL = null;

  try {
    GL = CANVAS.getContext("experimental-webgl");
  }
  catch(e) {
  }

  
  if (!GL) {
    alert("متصفحك لايدعم WebGL! :( ");
    alert("Unable to initialize WebGL. Your browser may not support it.");
  }
  MapCanvas = document.getElementById("map");
  textCanvas = document.getElementById("text");

  ctxMap=  MapCanvas.getContext("2d");
  mainMapY=ctxMap.canvas.width/2;
  mainMapX=ctxMap.canvas.height/2;
  ctx = textCanvas.getContext("2d");


}

//disable tank speed
function disableSpeed(tank){
  if(tank.shotSpeed!=tank.DefshotSpeed){
    setTimeout(function(){
      tank.shotSpeed=tank.DefshotSpeed;
    },9000);
  }

}

//disable tank shot strong
function disableStrong(tank){

  if(tank.shotStrong!=tank.DefshotStrong){
    setTimeout(function(){
      tank.shotStrong=tank.DefshotStrong;
      tank.shotColor=tank.DefshotColor;
    },9000);
  }
}

//create random helpers
function createRandomHelpers(){
  
    setNewFix(randNumber(150,-10),randNumber(150,-10));
    setTimeout(function(){
      setNewSpeedShot(randNumber(150,-10),randNumber(150,-10));
    },randNumber(1500,150));
    setTimeout(function(){
      setNewStrongShot(randNumber(150,-10),randNumber(150,-10));
    },randNumber(1500,150));

    //setNewBi(randNumber(50,-50),randNumber(50,-50));


}

//play animation
function playAni(tankXZ){

  
  var x =0.09;
  var id=tankXZ.setDraw(function(_this){
    if(x>0){
      _this.x+=x;
      _this.z-=x;
      x-=0.001;
    }


  });


}


//deleting msg from screen 
function deleteMsg(id){
  var el =document.getElementById(id);
  el.style.opacity=0;
  el.style.marginTop=12;
  setTimeout(function(){
    el.remove();
  },1000);
  
}

//add msg to screen 
function addMsg(shot,msg){
  var time = (new Date().getTime());
  var name = shot.Name;
  var ID = shot.ID;
  var rid=(new Date().getTime())+"id";
  document.getElementById("msgs").innerHTML+=
  '<div id="'+rid+'" class="msg">'+
    (msg+" "+name+" Team:"+ID)+
  '</div>';
  setTimeout(function(){
    deleteMsg(rid);
  },5000);
  setTimeout(function(){
    var el=document.getElementsByClassName("msg");
    for(var i=0;i<el.length;i++){
      el[i].style.opacity=1;
      el[i].style.marginTop=0;
    }
    
  },300);
}

//set tank level
function setLevel(tank,level){

    switch(level){
      case "لاعب جديد":
        tank.level="لاعب جديد";
        tank.dobleTankMesh=0;
      break;
      case "جندي":
        tank.level="جندي";

        objs("جندي","red",function(tankObj){
          tankObj.textNames[0]=tank.Team.color.toLowerCase();
          tank.setNewTank(tankObj);
          //tank.MoveingSpeed=0.27;
          tank.sizeX=1;
          tank.sizeZ=1;
          tank.DefshotStrong=58;
          tank.shotStrong=58;
          tank.setHealth(tank.health+100);
        },1);
      break;
      case "OFFCIER":
        tank.level="OFFCIER";
        objs("OFFCIER","red",function(tankObj){
          tankObj.textNames[0]=tank.Team.color.toLowerCase();
          tank.setNewTank(tankObj);

          tank.sizeX=1.3;
          tank.sizeZ=1.3;
          tank.DefshotStrong=62;
          tank.shotStrong=62;
          tank.setHealth(tank.health+150);
        },1.3);
      break;
      case "CORNOL":
        tank.level="CORNOL";
        objs("CORNOL","red",function(tankObj){
          tankObj.textNames[0]=tank.Team.color.toLowerCase();
          tank.setNewTank(tankObj);

          tank.sizeX=1.6;
          tank.sizeZ=1.6;
          tank.DefshotStrong=66;
          tank.shotStrong=66;
          tank.setHealth(tank.health+180);
        },1.6);
      break;
      case "Worrior":
        tank.level="Worrior";
        objs("Worrior","red",function(tankObj){
          tankObj.textNames[0]=tank.Team.color.toLowerCase();
          tank.setNewTank(tankObj);

          tank.sizeX=1.8;
          tank.sizeZ=1.8;
          tank.DefshotStrong=69;
          tank.shotStrong=69;
          tank.setHealth(tank.health+200);
        },1.8);
      break;
      case "GOVNER":
        tank.level="GOVNER";
        objs("GOVNER","red",function(tankObj){
          tankObj.textNames[0]=tank.Team.color.toLowerCase();
          tank.setNewTank(tankObj);
          //tank.MoveingSpeed=0.3;
          tank.sizeX=2;
          tank.sizeZ=2;
          tank.DefshotStrong=75;
          tank.shotStrong=75;
          tank.setHealth(tank.health+300);
        },2);
      break;
      case "CAPTEN":
        tank.level="CAPTEN";
        objs("CAPTEN","red",function(tankObj){
          tankObj.textNames[0]=tank.Team.color.toLowerCase();
          tank.setNewTank(tankObj);
          //tank.MoveingSpeed=0.33;
          tank.sizeX=2.3;
          tank.sizeZ=2.3;
          tank.DefshotStrong=80;
          tank.shotStrong=80;
          tank.setHealth(tank.health+400);
        },2.3);
      break;
      case "Presdnet":
        tank.level="Presdnet";
        objs("Presdnet","red",function(tankObj){
          tankObj.textNames[0]=tank.Team.color.toLowerCase();
          tank.setNewTank(tankObj);
          //tank.MoveingSpeed=0.35;
          tank.sizeX=2.6;
          tank.sizeZ=2.6;
          tank.DefshotStrong=85;
          tank.shotStrong=85;
          tank.setHealth(tank.health+500);
        },2.6);
      break;
      case "MASTER":
        tank.level="MASTER";
        objs("MASTER","red",function(tankObj){
          
          tankObj.textNames[0]=tank.Team.color.toLowerCase();
          tank.setNewTank(tankObj);
          //tank.MoveingSpeed=0.36;
          tank.sizeX=3;
          tank.sizeZ=3;
          tank.DefshotStrong=105;
          tank.shotStrong=105;
          tank.setHealth(tank.health+600);
        },3);
      break;
      case "NINJA":
        tank.level="NINJA";
        objs("NINJA","red",function(tankObj){
          
          tankObj.textNames[0]=tank.Team.color.toLowerCase();
          tank.setNewTank(tankObj);
          //tank.MoveingSpeed=0.4;
          tank.sizeX=4;
          tank.sizeZ=4;
          tank.DefshotStrong=160;
          tank.shotStrong=160;
          tank.setHealth(tank.health+1000);
        },4);
      break;
      case "RandomAttack":
        tank.level="RandomAttack";

        objs("RandomAttack","red",function(tankObj){

          tankObj.textNames[0]=tank.Team.color.toLowerCase();
          tank.setNewTank(tankObj);
          //tank.MoveingSpeed=0.45;
          tank.sizeX=6;
          tank.sizeZ=6;
          tank.DefshotStrong=255;
          tank.shotStrong=255;
          tank.setHealth(tank.health+1300);
        },6);
      break;
      
      default:
        tank.level="New Player";
    }

    
}



//add kill count
function addKillCount(shot,level,preCount){
  setTimeout(function(){
    if(shot.tankUDI==GameObjs.Player.UID){
        var countLevel=0;
        if(level=="New Player")
          countLevel=0;
        if(level=="جندي")
          countLevel=5;
        if(level=="OFFCIER")
          countLevel=10;
        if(level=="CORNOL")
          countLevel=25;
        if(level=="Worrior")
          countLevel=50;
        if(level=="GOVNER")
          countLevel=100;
        if(level=="CAPTEN")
          countLevel=250;
        if(level=="Presdnet")
          countLevel=500;
        if(level=="MASTER")
          countLevel=2500;
        if(level=="NINJA")
          countLevel=10000;
        if(level=="RandomAttack")
          countLevel=25000;
        GameObjs.Player.KillCount+=1+countLevel+preCount;
        if(GameObjs.Player.KillCount<2){
          setLevel(GameObjs.Player,"New Player");
        }else if(GameObjs.Player.KillCount<20){
          setLevel(GameObjs.Player,"جندي");
        }else if(GameObjs.Player.KillCount<50){
          setLevel(GameObjs.Player,"OFFCIER");
        }else if(GameObjs.Player.KillCount<100){
          setLevel(GameObjs.Player,"CORNOL");
        }else if(GameObjs.Player.KillCount<200){
          setLevel(GameObjs.Player,"Worrior");
        }else if(GameObjs.Player.KillCount<500){
          setLevel(GameObjs.Player,"GOVNER");
        }else if(GameObjs.Player.KillCount<1000){
          setLevel(GameObjs.Player,"CAPTEN");
        }else if(GameObjs.Player.KillCount<5000){
          setLevel(GameObjs.Player,"Presdnet");
        }else if(GameObjs.Player.KillCount<10000){
          setLevel(GameObjs.Player,"MASTER");
        }else if(GameObjs.Player.KillCount<20000){
          setLevel(GameObjs.Player,"NINJA");
        }else if(GameObjs.Player.KillCount<50000){
          setLevel(GameObjs.Player,"RandomAttack");
        }
        return ;
    }
    for(var itt=0;itt<GameObjs.TANKs.length;itt++){
      if(GameObjs.TANKs[itt].UID==shot.tankUDI){
        var countLevel=0;
        if(level=="New Player")
          countLevel=0;
        if(level=="جندي")
          countLevel=5;
        if(level=="OFFCIER")
          countLevel=10;
        if(level=="CORNOL")
          countLevel=25;
        if(level=="Worrior")
          countLevel=50;
        if(level=="GOVNER")
          countLevel=100;
        if(level=="CAPTEN")
          countLevel=250;
        if(level=="Presdnet")
          countLevel=500;
        if(level=="MASTER")
          countLevel=2500;
        if(level=="NINJA")
          countLevel=10000;
        if(level=="RandomAttack")
          countLevel=25000;

        GameObjs.TANKs[itt].KillCount+=1+countLevel+preCount;
        
        if(GameObjs.TANKs[itt].KillCount<2){
          setLevel(GameObjs.TANKs[itt],"New Player");
        }else if(GameObjs.TANKs[itt].KillCount<20){
          setLevel(GameObjs.TANKs[itt],"جندي");
        }else if(GameObjs.TANKs[itt].KillCount<50){
          setLevel(GameObjs.TANKs[itt],"OFFCIER");
        }else if(GameObjs.TANKs[itt].KillCount<100){
          setLevel(GameObjs.TANKs[itt],"CORNOL");
        }else if(GameObjs.TANKs[itt].KillCount<200){
          setLevel(GameObjs.TANKs[itt],"Worrior");
        }else if(GameObjs.TANKs[itt].KillCount<500){
          setLevel(GameObjs.TANKs[itt],"GOVNER");
        }else if(GameObjs.TANKs[itt].KillCount<1000){
          setLevel(GameObjs.TANKs[itt],"CAPTEN");
        }else if(GameObjs.TANKs[itt].KillCount<5000){
          setLevel(GameObjs.TANKs[itt],"Presdnet");
        }else if(GameObjs.TANKs[itt].KillCount<10000){
          setLevel(GameObjs.TANKs[itt],"MASTER");
        }else if(GameObjs.TANKs[itt].KillCount<20000){
          setLevel(GameObjs.TANKs[itt],"NINJA");
        }else if(GameObjs.TANKs[itt].KillCount<50000){
          setLevel(GameObjs.TANKs[itt],"RandomAttack");
        }
        return ;
      }
    }
  },200);
  
}

//set tank health
function setTankHealth(shot,helathP){
  
  setTimeout(function(){
    if(shot.tankUDI==GameObjs.Player.UID){
        GameObjs.Player.health+=helathP;
        GameObjs.Player.setHealth(GameObjs.Player.health);
        return ;
    }
    for(var i=0;i<GameObjs.TANKs.length;i++){
      if(GameObjs.TANKs[i].UID==shot.tankUDI){
        GameObjs.TANKs[i].health+=helathP;
        GameObjs.TANKs[i].setHealth(GameObjs.TANKs[i].health);
        return ;
      }
    }
  },200);
  
}

//calc fps and delta time 
var fps = 30;
var now;
var then = Date.now();
var interval = 1000/fps;
var delta;
var delta_websockets = 0.00;


//start rendring and drawing objs
function drawScene(gl) {
    gl = GL;
    requestAnimationFrame(drawScene);
     
    now = Date.now();
    delta = now - then;
     
    if (delta > interval) {
      then = now - (delta % interval);

      Calcs(gl);
    }
}


//calc coll and tank hits
function Calcs(gl){
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctxMap.clearRect(0, 0, ctxMap.canvas.width, ctxMap.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    perspectiveMatrix = makePerspective(65, CANVAS.width/CANVAS.height, 0.1, 200.0);
   
    if(
        

        !MESHES_LOADEDDoomDay||
        !MESHES_LOADEDb ||
        !MESHES_LOADEDg ||
        !MESHES_LOADEDr ||
        !MESHES_LOADEDf ||
        !MESHES_LOADEDspeedShot ||
        !MESHES_LOADEDStrongShot ||
        !MESHES_LOADEDBigBoom 
        ){
      return ;
    }
    if(once==false){
      setIntervals();
      once=true;
      document.getElementById("Loading").remove();
    }


    if(GameObjs.Player != null){
      doCam(GameObjs.Player);
      highVal=0;

      mvMatrix=Translate([10,1,-10],mvMatrix);
      GameObjs.Player.setMatrix(mvMatrix);
      GameObjs.Player.draw();
      draw_cir(
      GameObjs.Player.z+mainMapX+camMapX,
      GameObjs.Player.x+mainMapY+camMapY,
      "#fff",5);

        //never ever put an i in here !! 
        
          for(gs=0;gs<GameObjs.TANKs.length;gs++){
            GameObjs.TANKs[gs].setMatrix(mvMatrix);
            GameObjs.TANKs[gs].draw();
            draw_cir(
              GameObjs.TANKs[gs].z+mainMapX+camMapX,
              GameObjs.TANKs[gs].x+mainMapY+camMapY,
              GameObjs.TANKs[gs].Team.color,5);
          
          }
          
          for(var gs=0;gs<GameObjs.SHOTs.length;gs++){
            if(GameObjs.SHOTs[gs].IsOutRang || GameObjs.SHOTs[gs].x>=800  ){
              deleteObject(GameObjs.SHOTs,gs);
              
            }else{
             GameObjs.SHOTs[gs].setMatrix(mvMatrix);
              GameObjs.SHOTs[gs].draw();
              draw_cir(
              GameObjs.SHOTs[gs].z+mainMapX+camMapX,
              GameObjs.SHOTs[gs].x+mainMapY+camMapY,
              GameObjs.SHOTs[gs].color,2);
            }


          }
          
        for(var fI=0;fI<GameObjs.houses.length;fI++){
              GameObjs.houses[fI].rt+=1.8;
              GameObjs.houses[fI].setMatrix(mvMatrix);
              GameObjs.houses[fI].draw();

          } 

         for(var fI=0;fI<GameObjs.DoomDayFs.length;fI++){
            
            GameObjs.DoomDayFs[fI].setMatrix(mvMatrix);
            GameObjs.DoomDayFs[fI].draw();

        }       
        for(var fI=0;fI<GameObjs.fixes.length;fI++){
            GameObjs.fixes[fI].rt+=1.8;
            GameObjs.fixes[fI].setMatrix(mvMatrix);
            GameObjs.fixes[fI].draw();
        }
        for(var fI=0;fI<GameObjs.Walls.length;fI++){
            GameObjs.Walls[fI].setMatrix(mvMatrix);
            GameObjs.Walls[fI].draw();
        }

        for(var fI=0;fI<GameObjs.Explotions.length;fI++){
            GameObjs.Explotions[fI].setMatrix(mvMatrix);
            GameObjs.Explotions[fI].draw(mvMatrix);
            if(GameObjs.Explotions[fI].rang>20){
              deleteObject(GameObjs.Explotions,fI);
              
            }
        }
        for(var fI=0;fI<GameObjs.ExplotionsBig.length;fI++){
            GameObjs.ExplotionsBig[fI].setMatrix(mvMatrix);
            GameObjs.ExplotionsBig[fI].draw(mvMatrix);
            if(GameObjs.ExplotionsBig[fI].rang>20){
              deleteObject(GameObjs.ExplotionsBig,fI);
              
            }
        }
      

      // to calc collitions better calc it in fildes every one with 20 - 20 size 
        
        for(tankI=0;tankI<GameObjs.TANKs.length;tankI++){
          //GameObjs.SHOTs.loop();
          //MAP
          var shot=null;
            for(y=0;y<GameObjs.SHOTs.length;y++){

            shot=GameObjs.SHOTs[y];
            tank=GameObjs.TANKs[tankI];
            if(
              Math.abs(shot.x-tank.x)>5 &&
              Math.abs(shot.z-tank.z)>5 
              ){
              
              
            }else if(is_coll(GameObjs.TANKs[tankI],shot)){
              if(GameObjs.TANKs[tankI].Team.ID!=shot.ID){
                  
                  setTankHealth(GameObjs.SHOTs[y],5);

                  createExplotions(shot.x,shot.z,shot);
                  var sx=shot.x;
                  var sz=shot.z;

                  shot.IsOutRang=true;
                  shot.x=1000;
                  playSound("explode3",0.4);

                  
                  //updateHealth(GameObjs.SHOTs[y],GameObjs.TANKs[tankI]);
                  GameObjs.TANKs[tankI].health-=shot.shotStrong;
                  GameObjs.TANKs[tankI].setHealth(GameObjs.TANKs[tankI].health);
                  if(GameObjs.TANKs[tankI].health<=0){
                    GameObjs.TANKs[tankI].dead=true;
                    GameObjs.TANKs[tankI].x=-99999;
                    addKillCount(GameObjs.SHOTs[y],GameObjs.TANKs[tankI].level,GameObjs.TANKs[tankI].KillCount);
                    
                    setTankHealth(GameObjs.SHOTs[y],25);

                    createExplotionsBig(sx,sz);
                    deleteObject(GameObjs.TANKs,tankI);
                    
                  }
                  playAni(GameObjs.TANKs[tankI]);
                  
                  deleteObject(GameObjs.SHOTs,y);
                  
              }


            }
            for(var fI=0;fI<GameObjs.houses.length;fI++){
              if(is_coll(GameObjs.houses[fI],shot)){
                if(GameObjs.houses[fI].Team.ID!=shot.ID){
                  createExplotions(shot.x,shot.z,shot);
                  shot.IsOutRang=true;
                  shot.x=1000;
                  playSound("explode3",0.4);
                  deleteObject(GameObjs.SHOTs,y);
                  
                  if(GameObjs.houses[fI].health<=0){
                    GameObjs.houses[fI].dead=true;
                    deleteObject(GameObjs.houses,fI);
                    
                  }else{
                    GameObjs.houses[fI].health-=shot.shotStrong;
                    GameObjs.houses[fI].setHealth(GameObjs.houses[fI].health);
                  }
                }
              }
            }
          }
        
          for(var fI=0;fI<GameObjs.fixes.length;fI++){
            if(is_coll(GameObjs.TANKs[tankI],GameObjs.fixes[fI])){
              if(GameObjs.fixes[fI].ID=="fix"){
                if(GameObjs.TANKs[tankI].health<100){
                  GameObjs.TANKs[tankI].health=100;
                  GameObjs.TANKs[tankI].setHealth(100);
                  GameObjs.fixes=[];
                  playSound("starUp",0.5);
                  createRandomHelpers();
                }
              }else if(GameObjs.fixes[fI].ID=="speedShot"){
                  GameObjs.TANKs[tankI].shotSpeed+=2;
                  playSound("starUp",0.5);
                  GameObjs.fixes=[];
                  createRandomHelpers();
                  disableSpeed(GameObjs.TANKs[tankI]);

              }else if(GameObjs.fixes[fI].ID=="strongShot"){
                  GameObjs.TANKs[tankI].shotStrong+=20;
                  GameObjs.TANKs[tankI].shotColor="Yellow";
                  playSound("starUp",0.5);
                  GameObjs.fixes=[];
                  
                  createRandomHelpers()
                  disableStrong(GameObjs.TANKs[tankI]);

              }else if(GameObjs.fixes[fI].ID=="bigBoom"){

                  playSound("starUp",0.5);
                  GameObjs.fixes=[];
                  createRandomHelpers();

              }

            }
          }

        }//tanks

        for(var fI=0;fI<GameObjs.fixes.length;fI++){
          if(is_coll(GameObjs.Player,GameObjs.fixes[fI])){
            if(GameObjs.fixes[fI].ID=="fix"){
              if(GameObjs.Player.health<100){
                GameObjs.Player.health+=40;
                GameObjs.Player.setHealth(GameObjs.Player.health);
                playSound("starUp",0.5);
                GameObjs.fixes=[];
                createRandomHelpers()
              }

            }else if(GameObjs.fixes[fI].ID=="speedShot"){
                  GameObjs.Player.shotSpeed+=2;
                  playSound("starUp",0.5);
                  GameObjs.fixes=[];
                  createRandomHelpers()
                  disableSpeed(GameObjs.Player);

             }else if(GameObjs.fixes[fI].ID=="strongShot"){
                  GameObjs.Player.shotStrong+=20;
                  GameObjs.Player.shotColor="Yellow";
                  playSound("starUp",0.5);
                  GameObjs.fixes=[];
                  
                  createRandomHelpers()
                  disableStrong(GameObjs.Player);

              }else if(GameObjs.fixes[fI].ID=="bigBoom"){
                  
                  playSound("starUp",0.5);
                  GameObjs.fixes=[];
                  createRandomHelpers();
              }


             

          }
        }
        //GameObjs.SHOTs.loop();
        var shot=null;
        for(y=0;y<GameObjs.SHOTs.length;y++){
            shot=GameObjs.SHOTs[y];
            if(is_coll(GameObjs.Player,shot)){
              if(GameObjs.Player.Team.ID!=shot.ID){

                  setTankHealth(GameObjs.SHOTs[y],5);

                  createExplotions(shot.x,shot.z,shot);
                  addMsg(shot,"ضربت بواسطة");
                  shot.IsOutRang=true;
                  shot.x=1000;
                  playAni(GameObjs.Player);

                  
                  GameObjs.Player.health-=shot.shotStrong;
                  GameObjs.Player.setHealth(GameObjs.Player.health);
                  
                  if(GameObjs.Player.health<=0){
                    if(GameObjs.Teams[0].health>0){
                      GameObjs.Player.x=GameObjs.Teams[0].x;
                      GameObjs.Player.z=GameObjs.Teams[0].z;
                      GameObjs.Player.setHealth(100);
                    }else{
                      GameObjs.Player.dead=true;
                      GameObjs.Player.x=-99999;
                      addKillCount(GameObjs.SHOTs[y],GameObjs.Player.level,GameObjs.TANKs[tankI].KillCount);
                      setTankHealth(GameObjs.SHOTs[y],25);


                      addMsg(shot,"Killed By");
                    }


                  }
                  deleteObject(GameObjs.SHOTs,y);
                  
              }


            }
        }
      


      doCam(GameObjs.Player);
    }



    //geo
    GameObjs.geo.draw(mvMatrix);


    //menu
    if(GameObjs.Player!=null){
      draw_text(12,"زمن اللعب "+(((new Date).getTime()/1000)-StartedIn).toFixed(1),10,20,"rgba(255,255,255,1)");
      draw_text(12,"مرحباً "+GameObjs.Player.Name,10,35,"rgba(255,255,255,1)");
      draw_text(12,"عدد الدبابات في الملعب :"+(GameObjs.TANKs.length+1),10,50,"rgba(255,255,255,1)");
      draw_text(12,"عدد الطلقات :"+(GameObjs.SHOTs.length),10,65,"rgba(255,255,255,1)");
      draw_text(12,"عدد الدبابات المقتوله :"+(GameObjs.Player.KillCount),10,80,"rgba(255,255,255,1)");
      draw_text(12,"______________________",10,95,"rgba(255,255,255,1)");
      draw_text(12,"قوه الدبابه : "+GameObjs.Player.health,10,110,"rgba(255,85,85,1)");
      draw_text(12,"قوة الضربه : "+GameObjs.Player.shotStrong,10,125,"rgba(255,85,85,1)");
      draw_text(12,"الرتبة : "+GameObjs.Player.level,10,140,"rgba(255,215,15,1)");

    }


}

//create a wall
function createWall(x,z,sizeX,sizeZ,sizeY,ang){
  var size=[sizeX,sizeY,sizeZ];
  var box = new lilObj(objs("box","white",size));
  box.x=x;
  box.z=z;
  box.rotate[0]=ang[0];
  box.rotate[1]=ang[1];
  box.rotate[2]=ang[2];
  box.rotateVal=ang[3];
  GameObjs.Walls.push(box);
  delete(box);
}

//create explotions
function createExplotions(x,z,shot){

  var rs=0.2;
  var size=[rs,rs,rs];
  if(shot.kc3dObj==shotBufferRed && RedBoxMesh!=null){
    var box=RedBoxMesh;
  }

  if(shot.kc3dObj==shotBufferBlue && BlueBoxMesh!=null){
    var box=BlueBoxMesh;
  }

  if(shot.kc3dObj==shotBufferGreen && GreenBoxMesh!=null){
    var box=GreenBoxMesh;
  }

  if(shot.kc3dObj==shotBufferYellow && YellowBoxMesh!=null){
    var box=YellowBoxMesh;
  }


  
  for(var i=0;i<4;i++){
    var b = new lilObj(box);
    b.x=x;
    b.z=z;
    b.y=1;
    b.rt=0;
    b.rang=0;
    if(i==0){
      b.setDraw(function(_this){
        _this.rang+=1;
        _this.x+=0.1;
        _this.z+=0.1;
        _this.y+=0.32;
        _this.rt++;
        _this.Matrix=Rotate(_this.rt, [1, 1, 1],_this.Matrix);
      });
    }
    if(i==1){
      b.setDraw(function(_this){
        _this.x-=0.1;
        _this.z-=0.1;
        _this.y+=0.24;
        _this.rang+=1;
        _this.rt++;
        _this.Matrix=Rotate(_this.rt, [1, 1, 1],_this.Matrix);
      });
    }
    if(i==2){
      b.setDraw(function(_this){
        _this.x+=0.1;
        _this.z-=0.1;
        _this.y+=0.14;
        _this.rang+=1;
        _this.rt++;
        _this.Matrix=Rotate(_this.rt, [1, 1, 1],_this.Matrix);
      });
    }
    if(i==3){
      b.setDraw(function(_this){
        _this.x+=0.1;
        _this.z+=0.8;
        _this.y-=0.04;
        _this.rang+=1;
        _this.rt++;
        _this.Matrix=Rotate(_this.rt, [1, 1, 1],_this.Matrix);
      });
    }

    

   GameObjs.Explotions.push(b);
   delete(b);
  }

}


//create explotions big
function createExplotionsBig(x,z,color){

  var box=YellowBoxMesh;

  for(var i=0;i<8;i++){
    var b = new lilObj(box);
    b.x=x;
    b.z=z;
    b.y=1;
    b.rt=0;
    b.rang=0;
    if(i==0){
      b.setDraw(function(_this){
        _this.rang+=1;
        _this.x+=0.1;
        _this.z+=0.1;
        _this.y+=0.02;
        _this.rt++;
        _this.Matrix=Rotate(_this.rt, [1, 1, 1],_this.Matrix);
      });
    }
    if(i==1){
      b.setDraw(function(_this){
        _this.x-=0.1;
        _this.z-=0.1;
        _this.y-=0.04;
        _this.rang+=1;
        _this.rt++;
        _this.Matrix=Rotate(_this.rt, [1, 1, 1],_this.Matrix);
      });
    }
    if(i==2){
      b.setDraw(function(_this){
        _this.x+=0.1;
        _this.z-=0.1;
        _this.y-=0.04;
        _this.rang+=1;
        _this.rt++;
        _this.Matrix=Rotate(_this.rt, [1, 1, 1],_this.Matrix);
      });
    }
    if(i==3){
      b.setDraw(function(_this){
        _this.x+=0.1;
        _this.z+=0.8;
        _this.y-=0.04;
        _this.rang+=1;
        _this.rt++;
        _this.Matrix=Rotate(_this.rt, [1, 1, 1],_this.Matrix);
      });
    }
    if(i==3){
      b.setDraw(function(_this){
        _this.x+=0.4;
        _this.z+=0.8;
        _this.y-=0.04;
        _this.rang+=1;
        _this.rt++;
        _this.Matrix=Rotate(_this.rt, [1, 1, 1],_this.Matrix);
      });
    }
    if(i==4){
      b.setDraw(function(_this){
        _this.x+=0.4;
        _this.z+=0.8;
        _this.y+=0.24;
        _this.rang+=1;
        _this.rt++;
        _this.Matrix=Rotate(_this.rt, [1, 1, 1],_this.Matrix);
      });
    } 
    if(i==5){
      b.setDraw(function(_this){
        _this.x-=0.4;
        _this.z-=0.8;
        _this.y+=0.44;
        _this.rang+=1;
        _this.rt++;
        _this.Matrix=Rotate(_this.rt, [1, 1, 1],_this.Matrix);
      });
    }
    if(i==6){
      b.setDraw(function(_this){
        _this.x-=1.4;
        _this.z-=0.8;
        _this.y+=1.04;
        _this.rang+=1;
        _this.rt++;
        _this.Matrix=Rotate(_this.rt, [1, 1, 1],_this.Matrix);
      });
    }
    if(i==7){
      b.setDraw(function(_this){
        _this.x-=1.4;
        _this.z-=2.8;
        _this.y+=1.04;
        _this.rang+=1;
        _this.rt++;
        _this.Matrix=Rotate(_this.rt, [1, 1, 1],_this.Matrix);
      });
    }
   GameObjs.ExplotionsBig.push(b);
   delete(b);
  }

}

//draw_Cir for 2d map
function draw_cir(x,y,color,size){
  ctxMap.fillStyle=color;
  ctxMap.beginPath();
  ctxMap.moveTo(x, y);
  ctxMap.lineTo(x+size,y);
  ctxMap.lineTo(x+size,y+size);
  ctxMap.lineTo(x,y+size);
  ctxMap.lineTo(x,y);
  ctxMap.closePath();
  ctxMap.fill();

}


//draw text for 2d map
function draw_text (size,text,posX,posY,col){
  ctx.font=size+"px monospace";
  ctx.fillStyle=col;
  ctx.fillText(text,posX,posY);
}


setTimeout(function(){
  fullRot=90;
  fullX=10;
  fullZ=20;
},3000);


//cam position in start
var hcam=-100;

//set camera vars for player
function doCam(Player){
  //camera
  mvMatrix=Matrix.I(4);
  highVal=-31;
  rotateValY=0;
  rotateValX=0;

  if(hcam<20)
    hcam++;
  mvRotate(hcam-UpDown, [1, 0, 0]);
  mvRotate(((rotateValX)-(mouseXY.valueX/20)*-1), [0, 1, 0]);

  
  if(randRm<fullRot){

    randRm+=0.5;
  }
  if(fullXm<fullX){

    fullXm+=0.5;
  }
  if(fullZm<fullZ){

    fullZm+=0.5;
  }
  Player.camRotAniDraw();

  mvRotate(rotateValX*-1+Player.camRotAniVal, [0, 1, 0]);
  
  if(doRec){
    if(randXm>randX){
      randXm-=0.001;
    }
    if(randZm>randZ)
      randZm-=0.001;
  }
  if(randXm<randX){

    randXm+=0.01;
  }

  if(randZm<randZ)
    randZm+=0.01;

  mvMatrix=Translate([
      Player.x*-1+0/*randXm*/+20+FrontBack,
      highVal+UpDown,
      Player.z*-1+/*randZm*/0+30+LeftRight
    ],mvMatrix);
  
}
function is_coll(tank,shot){
    if(typeof tank === "undefined"){
      return ;
    }
    var TankmaxX = tank.sizeX+tank.x;
    var TankminX  = tank.x-tank.sizeX;
    var TankmaxZ = tank.sizeZ+tank.z;
    var TankminZ  = tank.z-tank.sizeZ;
    
    var shotMinX = shot.x;
    var shotMaxX = shot.x+shot.size;
    var shotMinZ = shot.z;
    var shotMaxZ = shot.z+shot.size;

    if(
      (
        (shotMinX > TankminX  && shotMinX < TankmaxX) ||
        (shotMaxX > TankminX  && shotMaxX < TankmaxX) 
      ) &&
      (
        (shotMinZ > TankminZ  && shotMinZ < TankmaxZ) ||
        (shotMaxZ > TankminZ  && shotMaxZ < TankmaxZ) 
      )
    ){
      return true;

    }else{
      return false;
    }
}


//update tank position
function updateTankAr(UID,Ar,x,z,health,KillCount){
  var found = false;

  for (var i = GameObjs.TANKs.length - 1; i >= 0; i--) {
    if(UID==GameObjs.TANKs[i].UID){
      GameObjs.TANKs[i].x=x;
      GameObjs.TANKs[i].z=z;
      
      doMove(GameObjs.TANKs[i],Ar);
      GameObjs.TANKs[i].health = health;
      GameObjs.TANKs[i].KillCount = KillCount;
      found = true;
      
      break;
    }
  }
  if(found==false){
    if(UID!=GameObjs.Player.UID){
      getTankData(UID);
      
    }

  }
}


//create or update tank 
function CreateOrUpdateTank(name,teamID,health,KillCount,x,z,UID,delta_server){
      if(UID==GameObjs.Player.UID){
        GameObjs.Player.x = x;
        GameObjs.Player.z = z;
        GameObjs.Player.health = health;
        
        GameObjs.Player.KillCount = KillCount;
        return ;
      }
      for (var i = GameObjs.TANKs.length - 1; i >= 0; i--) {
        if(UID==GameObjs.TANKs[i].UID){
          GameObjs.TANKs[i].x = x;
          GameObjs.TANKs[i].z = z;

          GameObjs.TANKs[i].health = health;
          GameObjs.TANKs[i].KillCount = KillCount;
          return ;
        }
      }
      createTankPos(name,teamID,health,KillCount,x,z,UID,delta_server);
}


//create or update tank with position
function createTankPos(name,teamID,health,KillCount,posX,posZ,UID,delta_server){
  if(MESHES_LOADEDr && MESHES_LOADEDg && MESHES_LOADEDb  ){
    var Team = GameObjs.Teams[teamID];
    var tank = new boxObj(Team.TankMesh);
    tank.x=posX;
    tank.z=posZ;
    tank.Team=Team;
    tank.delta=delta;
    tank.KillCount = KillCount;
    tank.shotColor=Team.color;
    this.DefshotColor=Team.color;
    tank.LifeObj=new boxObj(objs("life","green"));
    tank.setHealth(health);
    tank.Name=name;
    tank.UID=UID;


    GameObjs.TANKs.push(tank);

    delete(tank);
    
  }

}


//POSITIONs
var AR=["right","up","down","left"];

//move tank to ? AR
//
function doMove(TANKObj,ar){

  if(ar=="none"){
    TANKObj.clicked="none";
    return ;
  }
  if(ar=="down"){
    TANKObj.clicked="down";
    TANKObj.addAccR(ar,TANKObj.LR,function(){

    });
    
    return ;
  }
  if(ar=="up"){
    TANKObj.clicked="up";
    TANKObj.addAccR(ar,TANKObj.LR,function(){

    });

    
    return ;
  }
  if(ar=="left"){
    TANKObj.clicked="left";
    TANKObj.addAccR(ar,TANKObj.LR,function(){

    });
    
    return ;
  }
  if(ar=="right"){
    TANKObj.clicked="right";
    TANKObj.addAccR(ar,TANKObj.LR,function(){

    });
    
    return ;
  }

}


//create new player
function createNewPlayer(name,teamID,health,KillCount,x,z,UID){

        GameObjs.Player=new boxObj(GameObjs.Teams[teamID].TankMesh);
        GameObjs.Player.Team=GameObjs.Teams[teamID];
        GameObjs.Player.KillCount = KillCount;
        GameObjs.Player.delta = delta;
        GameObjs.num_of_frames = fps;
        GameObjs.Player.x=x;
        GameObjs.Player.z=z;
        GameObjs.Player.Name=name;
        GameObjs.Player.LifeObj=new boxObj(objs("life","green"));
        
        GameObjs.Player.shotColor=GameObjs.Teams[teamID].color;
        GameObjs.Player.DefshotColor=GameObjs.Teams[teamID].color;
        GameObjs.Player.UID=UID;
        GameObjs.Player.setHealth(health);
        GameObjs.Player.camRotAniVal=0;
        GameObjs.Player.LastcamRotAniVal=90;
        GameObjs.Player.camRotAniDraw=function(val){
          
            if(this.camRotAniVal<this.LastcamRotAniVal){
              this.camRotAniVal+=1;
            }
            if(this.camRotAniVal>this.LastcamRotAniVal){
              this.camRotAniVal-=1;
            }
        }
        setController(GameObjs.Player,creatshotfunc,commandFunc);
}

//start checking and creating teams intervals
function setIntervals(){
  setInterval(function(){
    if(doRec)
      doRec=false;
    else
      doRec=true;
    
  },1000);
  setInterval(function(){
    randomCam();
  },100);

  var chkLoad=setInterval(function(){
    if(
        MESHES_LOADEDTeamHouseRed && 
        MESHES_LOADEDTeamHouseGreen &&
        MESHES_LOADEDDoomDay &&
        //MESHES_LOADEDTre &&
        MESHES_LOADEDTeamHouseBlue &&
        MESHES_LOADEDb &&
        MESHES_LOADEDg &&
        MESHES_LOADEDr 
        ){

        var team1=new Team();
        var team2=new Team();
        var team3=new Team();

        team1.ID="Team1";
        team1.x=0;
        team1.z=20;
        team1.color="Red";
        team1.TankMesh=RedtankMesh;
        team1.TeamHouseMesh=GameObjs.TeamHouseRed;
        
        
        team2.x=-120;
        team2.z=20;
        team2.ID="Team2";
        team2.color="Blue";
        team2.TankMesh=BluetankMesh;
        team2.TeamHouseMesh=GameObjs.TeamHouseBlue;

        team3.x=120;
        team3.z=20;
        team3.ID="Team3";
        team3.color="Green";
        team3.TankMesh=GreentankMesh;
        team3.TeamHouseMesh=GameObjs.TeamHouseGreen;

        GameObjs.Teams[0]=team1;
        GameObjs.Teams[1]=team2;
        GameObjs.Teams[2]=team3;
        window.clearInterval(chkLoad);

        
    }
  },500);
  //START GAME INTRO
  setTimeout(function(){
    document.getElementById("intro").style.opacity=1;
    setTimeout(function(){
      document.getElementById("intro").style.top="1px";
    },2000);
  },2000);
}


//helpers and fixes objs drawing functions
function setDrawFix(obj){
  obj.setDraw(function(_this){
        _this.Matrix=Translate([
          0,
          Math.sin(_this.rt/100)+2,
          0,
        ],_this.Matrix);
      _this.rt++;
      _this.Matrix=Rotate(_this.rt, [0, 1, 0],_this.Matrix);
    });
      
   
}
//helpers and fixes objs drawing functions
function setNewFix(x,z){

  if(MESHES_LOADEDf){

    var fix=new boxObj(GameObjs.FixMesh);
    fix.ID="fix";
    fix.x=x;
    fix.z=z;
    fix.size=1;
    fix.rt=0;
    setDrawFix(fix);
    GameObjs.fixes.push(fix);

  }
}

//set new speed shot
function setNewSpeedShot(x,z){
  if(MESHES_LOADEDspeedShot){
    var speedShot=new boxObj(GameObjs.SpeedShot);
    speedShot.ID="speedShot";
    speedShot.x=x;
    speedShot.z=z;
    speedShot.size=2;
    speedShot.rt=0;
    setDrawFix(speedShot);
    GameObjs.fixes.push(speedShot);
  }

  
}

//set strong  shot
function setNewStrongShot(x,z){
  if(MESHES_LOADEDStrongShot){
    var strongShot=new boxObj(GameObjs.StrongShot);
    strongShot.ID="strongShot";
    strongShot.x=x;
    strongShot.z=z;
    strongShot.size=2;
    strongShot.rt=0;
    setDrawFix(strongShot);
    GameObjs.fixes.push(strongShot);
  }

  
}

//set big boom  shot
function setNewBigBoom(x,z){
  if(MESHES_LOADEDBigBoom){
    var bigBoom=new boxObj(GameObjs.BigBoom);
    bigBoom.ID="bigBoom";
    bigBoom.x=x;
    bigBoom.z=z;
    bigBoom.size=2;
    bigBoom.rt=0;
    setDrawFix(bigBoom);
    GameObjs.fixes.push(bigBoom);
  }

  
}

//inti webGL buffers
function initBuffers(gl){
  var size = 0;
  var sizeX = 305;
  var TextVal=0.8;

  objs("tank","red",function(tankObj){
    MESHES_LOADEDr=true;
    RedtankMesh=tankObj;
  });

  objs("tank","green",function(tankObj){
    MESHES_LOADEDg=true;
    GreentankMesh=tankObj;
  });
  objs("tank","blue",function(tankObj){
    MESHES_LOADEDb=true;
    BluetankMesh=tankObj;
  });
  
  objs("fix","BlueTank",function(fixObj){
    MESHES_LOADEDf=true;
    GameObjs.FixMesh=fixObj;
  });
  objs("speedShot","BlueTank",function(fixObj){
    MESHES_LOADEDspeedShot=true;
    GameObjs.SpeedShot=fixObj;
  });
  objs("strongShot","yellow",function(fixObj){
    MESHES_LOADEDStrongShot=true;
    GameObjs.StrongShot=fixObj;
  });
  objs("bigBoom","yellow",function(fixObj){
    MESHES_LOADEDBigBoom=true;
    GameObjs.BigBoom=fixObj;
  });
  objs("TeamHouse","blue",function(houseObj){
    MESHES_LOADEDTeamHouseBlue=true;
    GameObjs.TeamHouseBlue=houseObj;

  });
  objs("TeamHouse","green",function(houseObj){
    MESHES_LOADEDTeamHouseGreen=true;
    GameObjs.TeamHouseGreen=houseObj;


  });

  YellowBoxMesh=objs("box","yellow",[0.3,0.3,0.3]);
  GreenBoxMesh=objs("box","green",[0.1,0.1,0.1]);
  RedBoxMesh=objs("box","red",[0.1,0.1,0.1]);
  BlueBoxMesh=objs("box","blue",[0.1,0.1,0.1]);

  shotBufferRed=objs("shot","red");
  shotBufferBlue=objs("shot","blue");
  shotBufferGreen=objs("shot","green");
  shotBufferYellow=objs("shot","yellow");

  objs("DoomDay","white",function(doomObj){
    MESHES_LOADEDDoomDay=true;
    GameObjs.DoomDay=doomObj;
    var s = new boxObj(doomObj) ;
    s.x=-10;
    s.z=10;
    s.y=10;

    

    var s2 = new boxObj(doomObj) ;
    s2.x=0;
    s2.z=16;
    s2.y=10;
    

    var s3 = new boxObj(doomObj) ;
    s3.x=10;
    s3.z=12;
    s3.y=10;
    var x=-10;
    var z=-10;
    var y=10;
    for(var i=0;i<2;i++){
      var s = new boxObj(doomObj) ;
      x=randNumber(10,-10);
      z=randNumber(20,-10);
      s.x=x;
      s.z=z;
      s.y=randNumber(83,10);
      s.setDraw(function(_this){

        _this.x+=0.1;
        if(_this.x>300){
          _this.x=-100;
        }
      });

      GameObjs.DoomDayFs.push(s);
      delete(s);
    }


  });
  
  objs("TeamHouse","red",function(houseObj){
    MESHES_LOADEDTeamHouseRed=true;
    GameObjs.TeamHouseRed=houseObj;

  });
  gl = GL;

  GameObjs.geo=objs("geo","geo");


}


//create shot objs
function createShot(x,z,P,color){

  P.health-=2;


  if(color=="Red"){
    var s = new lilObj(shotBufferRed) ;
    
  }
  if(color=="Blue"){
    var s = new lilObj(shotBufferBlue) ;
    
  }
  if(color=="Green"){
    var s = new lilObj(shotBufferGreen) ;
    
  }
  if(color=="Yellow"){
    var s = new lilObj(shotBufferYellow) ;
  }
  
  s.rotateVal=P.rotateVal+90;
  s.x=P.x+x;
  s.y=P.y+1.4;
  s.z=P.z+z;
  s.rangX=P.x+90;
  s.rangZ=P.z+90;
  s.rangXmin=(P.x-90);
  s.rangZmin=(P.z-90);
  s.rotate=[0,1,0];
  s.Rt=0;
  s.ID=P.Team.ID;
  s.tankUDI=P.UID;
  s.shotStrong=P.shotStrong;
  s.clicked=P.lastTHEAD;
  s.Name=P.Name;

  if(shots_times+700<getSecs(true)){
    playSound("explode4",0.2);

    shots_times=getSecs(true);
  }else{
    playSound("explode4",0.1);
  }

  s.setDraw(function(_this){

    _this.Rt+=4;

    _this.Matrix=Rotate(_this.Rt,[1,0,0],_this.Matrix);
    
    if(_this.x>_this.rangX || _this.x<_this.rangXmin || _this.z>_this.rangZ || _this.z<_this.rangZmin){
       _this.IsOutRang=true;

       createExplotions(_this.x,_this.z,_this);

       return;
    }
    if(s.clicked=="right"){
      _this.z+=P.shotSpeed;
    }
    if(s.clicked=="left"){
      _this.z-=P.shotSpeed;
    }
    if(s.clicked=="up"){
      _this.x+=P.shotSpeed;
    }
    if(s.clicked=="down"){
      _this.x-=P.shotSpeed;
    }
  });
  //GameObjs.SHOTs.addNode(s);

  GameObjs.SHOTs.push(s);
  delete(s);
}

//create shot based on UID of tank
function recivedShot(UID){
  //tank have
  if(UID==GameObjs.Player.UID){
    createShot(0,0,GameObjs.Player,GameObjs.Player.shotColor);
    return ;
  }
  for (var i = GameObjs.TANKs.length - 1; i >= 0; i--) {
    if(UID==GameObjs.TANKs[i].UID){
      createShot(0,0,GameObjs.TANKs[i],GameObjs.TANKs[i].shotColor);
      break;
    }
  }
  
  
}

//stop moving tank based on UID
function NoneMove(UID,x,z){
  for (var i = GameObjs.TANKs.length - 1; i >= 0; i--) {
    if(UID==GameObjs.TANKs[i].UID){
      GameObjs.TANKs[i].clicked="none";
      GameObjs.TANKs[i].x=x;
      GameObjs.TANKs[i].z=z;
      break;
    }
  }
}

//create shot function
function creatshotfunc(){

  if(shots_time+800<getSecs(true)){
    if(GameObjs.Player!=null){
      sendShot(GameObjs.Player);
      shots_time=getSecs(true);
      playSound("explode4",0.7);
    }

  }
}

//set command function based on id key
function commandFunc(id){

}