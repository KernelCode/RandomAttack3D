/* 
  controllers.js sprated file to manage user input,camera position,
  mouse and keyboard clicks

*/

//mouse value x and y
var mouseXY={};

// vars to calc camera position
var UpDown=0;
var FrontBack=0;
var LeftRight=0;
var is_up=true;
var is_right=true;
var mainMapX=0;
var mainMapY=0;
var MapSpeed=0.25;
var camMapX=0;
var camMapY=0;

// when key clicked
var clicked = "up";

//set player to set the camera on and detect input 
function setController(Player,creatshotfunc,command){

  //on key up we remove the cliced
  document.onkeyup  = function(e){

      if(clicked=="up")
        return ;

      clicked="up";
      sendNoneMove(Player);

      Player.clicked="none";
        
  }

  //on mouse click make a shot !
  document.onclick=function(){

    creatshotfunc();

  }


  //on key down we see calc camera position and mouse position
  document.onkeydown  = function(e){

    if(clicked=="down")
     return ;
    
    switch(e.which){

        case 40: //down


          mainMapY-=MapSpeed;
          Player.addAccR("down",Player.LR,function(){
            
          });
       
          Player.camRotAniVal=Player.LastcamRotAniVal;
          if(is_up){

            Player.LastcamRotAniVal=270;

            is_up=false;
            LeftRight=0;
            FrontBack=-39;

          }else{

            Player.LastcamRotAniVal=90;
            is_up=true;
            LeftRight=0;
            FrontBack=0;

          }
          
          

        break;
        case 83: //down s

          clicked="down";

          mainMapY-=MapSpeed;

          if(Player.LastcamRotAniVal==0){

            Player.clicked="right";

            updateTankFunc(Player,"right");

            Player.addAccR("right",Player.LR,function(){});

          }else if(Player.LastcamRotAniVal==180){

            Player.clicked="left";

            updateTankFunc(Player,"left");

            Player.addAccR("left",Player.LR,function(){});

          }else if(Player.LastcamRotAniVal==270){

            Player.clicked="up";

            updateTankFunc(Player,"up");

            Player.addAccR("up",Player.LR,function(){});

          }else{

            Player.clicked="down";

            updateTankFunc(Player,"down");

            Player.addAccR("down",Player.LR,function(){});

          }

        break;
        case 38: //up

        mainMapY+=MapSpeed;

        Player.addAccR("up",Player.LR,function(){});

        Player.camRotAniVal=Player.LastcamRotAniVal;

        if(is_up){

          Player.LastcamRotAniVal=90;
          is_up=false;
          LeftRight=0;
          FrontBack=0;

        }else{

          Player.LastcamRotAniVal=270;
          is_up=true;
          LeftRight=0;
          FrontBack=-39;
          is_up=true;

        }

        break;
        case 87: //up w 

          clicked="down";

          mainMapY+=MapSpeed;

          if( Player.LastcamRotAniVal == 0 ){

            Player.clicked="left";

            updateTankFunc(Player,"left");

            Player.addAccR("left",Player.LR,function(){});

          }else if( Player.LastcamRotAniVal == 180 ){

            Player.clicked="right";

            updateTankFunc(Player,"right");

            Player.addAccR("right",Player.LR,function(){});

          }else if( Player.LastcamRotAniVal == 270 ){

            Player.clicked="down";

            updateTankFunc(Player,"down");

            Player.addAccR("down",Player.LR,function(){});

          }else{

            Player.clicked="up";

            updateTankFunc(Player,"up");

            Player.addAccR("up",Player.LR,function(){});

          }
            
        break;
        case 39: //right

        mainMapX-=MapSpeed;
        Player.addAccR("right",Player.LR,function(){});

        Player.camRotAniVal=Player.LastcamRotAniVal;

        if(is_right){

          Player.LastcamRotAniVal=180;

          FrontBack=-19;

          LeftRight=19;

          is_right=false;

        }else{

          Player.LastcamRotAniVal=0;

          FrontBack=-19;

          LeftRight=-18;

          is_right=true;
        }

        break;

        case 68 : //right d

          clicked="down";

          mainMapX-=MapSpeed;

          if( Player.LastcamRotAniVal == 0 ){

            Player.clicked="up";

            updateTankFunc(Player,"up");

            Player.addAccR("up",Player.LR,function(){});

          }else if(Player.LastcamRotAniVal==180){

            Player.clicked="down";

            updateTankFunc(Player,"down");

            Player.addAccR("down",Player.LR,function(){});

          }else if(Player.LastcamRotAniVal==270){

            Player.clicked="left";

            updateTankFunc(Player,"left");

            Player.addAccR("left",Player.LR,function(){});

          }else{

            Player.clicked="right";

            updateTankFunc(Player,"right");

            Player.addAccR("right",Player.LR,function(){});

          }
          
        break;
        case 80: //p
          
          
        break;
        case 37: //left
       
          mainMapX+=MapSpeed;

          Player.addAccR("left",Player.LR,function(){});

          Player.camRotAniVal=Player.LastcamRotAniVal;

          if(is_right){

            Player.LastcamRotAniVal=180;

            FrontBack=-19;

            LeftRight=19;

            is_right=false;

          }else{

            Player.LastcamRotAniVal=0;

            FrontBack=-19;

            LeftRight=-18;

            is_right=true;

          }
          
        break;
        case 65: //left a

          clicked="down";

          mainMapX+=MapSpeed;

          if(Player.LastcamRotAniVal==0){

            Player.clicked="down";

            updateTankFunc(Player,"down");

            Player.addAccR("down",Player.LR,function(){});

          }else if(Player.LastcamRotAniVal==180){

            Player.clicked="up";

            updateTankFunc(Player,"up");

            Player.addAccR("up",Player.LR,function(){});

          }else if(Player.LastcamRotAniVal==270){

            Player.clicked="right";

            updateTankFunc(Player,"right");

            Player.addAccR("right",Player.LR,function(){});

          }else{
            
            Player.clicked="left";
            
            updateTankFunc(Player,"left");
            
            Player.addAccR("left",Player.LR,function(){});

          }
          
        break;
        case 32: //space
         
          creatshotfunc();

        break;
        case 69: //e

         UpDown+=0.7;
         
        break;
        case 81: //q

          UpDown-=0.7;

        break;
        case 49: //1

          command(1);
        break;
        case 50: //2

          command(2);
        break;
      }


      
    };
    
}

//mouse values
var mXCurrnt=0;
var valueX=0;
var mYCurrnt=0;
var valueY=0;
var valX=20;
var valY=5;
var lastLeftRight=false;
var lastUpDown=false;

//on mouse move set the right mouse values
document.onmousemove  = function(e){

  mouseXY={mX:e.pageX,mY:e.pageY,valueX:valueX,valueY:valueY};
  if(e.pageX-mXCurrnt>0){
    
    valueX+=valX;

    lastLeftRight=false;

  }else if(e.pageX-mXCurrnt<0){
   
    valueX-=valX;

    lastLeftRight=true;

  }else{

    if(lastLeftRight){
     
      valueX-=valX;

    }else{
      
      valueX+=valX;
    }

  }
  if(e.pageY-mYCurrnt>0){
    
    valueY+=valY;

    lastUpDown=false;

  }else if(e.pageY-mYCurrnt<0){
    
    valueY-=valY;

    lastUpDown=true;

  }else{

    if(lastUpDown){
     
      valueY-=valY;

    }else{
     
      valueY+=valY;
    }

  }

  mXCurrnt=e.pageX;

  mYCurrnt=e.pageY;

};
