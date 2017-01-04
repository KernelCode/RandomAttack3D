function boxObj(kc3d){
  this.x=0;
  this.y=-0.5;
  this.z=0;
  this.sizeX=1;
  this.sizeZ=2;
  this.MaxVal=0.05;
  this.Matrix=0;
  this.kc3dObj=0;
  this.kc3dObj=kc3d;
  this.dobleTankMesh=0;
  this.P=true;
  this.PR=true;
  this.boxAccX=0;
  this.boxAccY=0;
  this.boxAccZ=0;
  this.boxAccR=0;
  this.boxAccXm=0.01;
  this.boxAccYm=0.01;
  this.boxAccZm=0.01;
  this.boxAccRm=8.24;
  this.rotate=[1,1,1];
  this.LR=[0,1,0];
  this.UD=[0,0,1];
  this.Team=null;
  this.DefshotSpeed=0.83;
  this.shotSpeed=0.83;
  this.DefshotStrong=55;
  this.shotStrong=55;
  this.tHead=[0,0,0,1]; //down,right,up,left
  this.finisehdAni=true;
  this.funishedFnc=function(){};
  this.rotateVal=0;
  this.THI=0;
  this.lastTHEAD="left";
  this.clicked="none";
  this.IsOutRang=false;
  this.health=100;

  this.HEALTHMAX=100;
  this.minVal=1;
  this.LeftHealth=1;
  this.FrontHealth=0;
  this.sizeHelath=[0,0,0];
  this.UPHealth=0;
  this.shotColor="Red";
  this.DefshotColor="Red";
  this.Name="";
  this.dead=false;
  this.SXYI=-1;
  this.MoveingSpeed=0.25;
  this.level="لاعب جديد";
  this.UID="kcID";
  this.DrawFuncs=[];
  this.KillCount=0;
  this.setNewTank=function(mesh){
    this.dobleTankMesh=mesh;
  }
  this.deleteBuffers=function(){
    this.kc3dObj.deleteBuffers();
  }
  this.addAccR=function(accR,to,funishedFnc){
    
    if(this.boxAccR!=0)
      return ;
    if(accR==this.lastTHEAD){
      funishedFnc();
      return ;
    }
    this.PR=true;
    switch(accR){
      case "up":
        this.tHead=[0,0,1,0];

        if(this.lastTHEAD=="left"){
          accR=-90;
          this.PR=false;
          
        }
        if(this.lastTHEAD=="down"){
          accR=180;
          
        }
        if(this.lastTHEAD=="right"){
          accR=90;

        }

        this.lastTHEAD="up";
      break;
      case "down":
        
        this.tHead=[1,0,0,0];
        
        if(this.lastTHEAD=="left"){
          accR=90;
        }
        if(this.lastTHEAD=="up"){
          accR=180;
        }
        if(this.lastTHEAD=="right"){
          accR=-90;
          this.PR=false;
        }
        this.lastTHEAD="down";
      break;
      case "left":
        this.tHead=[0,0,0,1];
        

        if(this.lastTHEAD=="up"){
          accR=90;
        }
        if(this.lastTHEAD=="right"){
          accR=180;
        }
        if(this.lastTHEAD=="down"){
          accR=-90;
          this.PR=false;
        }
        this.lastTHEAD="left";
      break;
      case "right":
        this.tHead=[0,1,0,0];
        
        if(this.lastTHEAD=="up"){
          accR=-90;
          this.PR=false;
        }
        if(this.lastTHEAD=="left"){
          accR=180;
        }
        if(this.lastTHEAD=="down"){
          accR=90;

        }
        this.lastTHEAD="right";
      break;
    }

    

    this.funishedFnc=funishedFnc;
    if(this.boxAccR<90){
      this.boxAccR+=accR;
      this.rotateValOrg=this.rotateVal;
      this.rotate=to;
      this.finisehdAni=false;
      
    }

  }

  this.setHealth = function (health){
    this.health=health;

    /*if(health<100 && health>60){

    }else if(health>200 && health<300){

    }else if(health>300 && health<500){

      this.kc3dObj=this.dobleTankMesh;

      
    }else if(health>500 && health<1000){
      
    }else if(health>1000 && health<2000){
      
    }*/
    var text = GameTexturesObj.getText("red");
    if(health<=100){
      var sizeX=((this.health/this.HEALTHMAX)/this.minVal)+this.sizeHelath[0];
    }else{
      var sizeX=((100/this.HEALTHMAX)/this.minVal)+this.sizeHelath[0];
    }
    var sizeY=0.2+this.sizeHelath[1];
    var sizeZ=0.2+this.sizeHelath[2];

    this.LifeObj.kc3dObj.setVrcs([
          // Front face
          sizeX*-1, sizeY*-1,  sizeZ,
           sizeX, sizeY*-1,  sizeZ,
           sizeX,  sizeY,  sizeZ,
          sizeX*-1,  sizeY,  sizeZ,

          // Back face
          sizeX*-1, sizeY*-1, sizeZ*-1,
          sizeX*-1,  sizeY, sizeZ*-1,
           sizeX,  sizeY, sizeZ*-1,
           sizeX, sizeY*-1, sizeZ*-1,

          // Top face
          sizeX,  sizeY, sizeZ,
          sizeX*-1,  sizeY, sizeZ,
          sizeX*-1,  sizeY, sizeZ*-1,
          sizeX,  sizeY, sizeZ*-1,

          // Bottom face
          sizeX*-1, sizeY*-1, sizeZ*-1,
           sizeX, sizeY*-1, sizeZ*-1,
           sizeX, sizeY*-1,  sizeZ,
          sizeX*-1, sizeY*-1,  sizeZ,

          // Right face
           sizeX, sizeY*-1, sizeZ*-1,
           sizeX,  sizeY, sizeZ*-1,
           sizeX,  sizeY,  sizeZ,
           sizeX, sizeY*-1,  sizeZ,

          // Left face
          sizeX*-1, sizeY*-1, sizeZ*-1,
          sizeX*-1, sizeY*-1,  sizeZ,
          sizeX*-1,  sizeY,  sizeZ,
          sizeX*-1,  sizeY, sizeZ*-1
          ]);
    
    this.setDraw(function(_this){
      _this.LifeObj.Matrix=_this.Matrix;
      //this.LifeObj.Matrix.scale(this.Matrix, [2, 2, 2]);
      if(_this.health<=100){
        _this.LifeObj.x=((_this.health/_this.HEALTHMAX)/_this.minVal)-_this.LeftHealth;
      }else{
        _this.LifeObj.x=((100/_this.HEALTHMAX)/_this.minVal)-_this.LeftHealth;
      }
      _this.LifeObj.z=1+_this.FrontHealth;
      _this.LifeObj.y=1+_this.UPHealth;
      

      if(_this.health<=30){
        _this.LifeObj.kc3dObj.textNames[0]="red";
      }else if(_this.health<=60){
        _this.LifeObj.kc3dObj.textNames[0]="orang";
      }else if(_this.health>=60 && _this.health<=200){
        _this.LifeObj.kc3dObj.textNames[0]="green";
      }else if(_this.health>200 && _this.health<300){
        _this.LifeObj.kc3dObj.textNames[0]="white";
      }else if(_this.health>300 && _this.health<500){
        _this.LifeObj.kc3dObj.textNames[0]="gray";
      }else if(_this.health>500 && _this.health<1000){
        _this.LifeObj.kc3dObj.textNames[0]="blackstar";
      }else if(_this.health>1000 && _this.health<2000){
        _this.LifeObj.kc3dObj.textNames[0]="purp";
      }
     
      _this.LifeObj.draw();
      
    });
}
  this.addAcc=function(accX,accY,accZ){
    //accZ up down
    //accX left right
    
    
    //left
    if(this.tHead[3]==1){
      if(accZ!=0 && accX==0 && accY==0){
        accX=accZ*-1;
        accZ=0;
      }else if (accX!=0 && accZ==0 && accY==0){
        accZ=accX;
        accX=0;
      }
    }

    //right
    if(this.tHead[1]==1){
      if(accZ!=0 && accX==0 && accY==0){
        accX=accZ;
        accZ=0;
      }else if (accX!=0 && accZ==0 && accY==0){
        accZ=accX;
        accX=0;
      }
    }

    //up
    if(this.tHead[2]==1){
      if(accZ!=0 && accX==0 && accY==0){
        accX=accZ*-1;
        accZ=0;
      }else if (accX!=0 && accZ==0 && accY==0){
        accZ=accX;
        accX=0;
      }
    }

    //down
    if(this.tHead[0]==1){
      if(accZ!=0 && accX==0 && accY==0){
        accX=accZ;
        accZ=0;
      }else if (accX!=0 && accZ==0 && accY==0){
        accZ=accX;
        accX=0;
      }
    }
    
    if(accX<0 || accY<0 || accZ<0){
      this.P=false;
    }
    else{
      this.P=true;
    }

    if(this.boxAccX<this.MaxVal){

      this.boxAccX+=accX;
    }
    if(this.boxAccY<this.MaxVal){
      this.boxAccY+=accY;
    }
    if(this.boxAccZ<this.MaxVal){
      this.boxAccZ+=accZ;
    }
    
  }
  this.calcAcc=function(){
    if(this.P){

      if(this.boxAccX<0){
        this.boxAccX=0;
      }
      if(this.boxAccY<0){
        this.boxAccY=0;
      }
      if(this.boxAccZ<0){
        this.boxAccZ=0;
      }

      if( this.boxAccY!=0 || this.boxAccX!=0 || this.boxAccZ!=0){
        if(
            (this.boxAccY>=0.000001 && this.boxAccY<=0.1) &&
            (this.boxAccX>=0.000001 && this.boxAccX<=0.1) &&
            (this.boxAccZ>=0.000001 && this.boxAccZ<=0.1) 
          ){
          this.boxAccY=0;
          this.boxAccX=0;
          this.boxAccZ=0;

          
        }else{
          this.x+=this.boxAccX;
          this.y+=this.boxAccY;
          this.z+=this.boxAccZ;

          if(this.boxAccX>0)
            this.boxAccX-=this.boxAccXm;


          if(this.boxAccZ>0)
            this.boxAccZ-=this.boxAccZm;

          if(this.boxAccY>0)
            this.boxAccY-=this.boxAccYm;

          
        }       
      }
    }else{

      if(this.boxAccX>0){
        this.boxAccX=0;
      }

      if(this.boxAccY>0){
        this.boxAccY=0;
      }
      if(this.boxAccZ>0){
        this.boxAccZ=0;
      }

      if( this.boxAccY!=0 || this.boxAccX!=0 || this.boxAccZ!=0 ){
        if(
            (this.boxAccY>=0.000001 && this.boxAccY<=0.1) &&
            (this.boxAccX>=0.000001 && this.boxAccX<=0.1) &&
            (this.boxAccZ>=0.000001 && this.boxAccZ<=0.1) 
          ){
          this.boxAccY=0;
          this.boxAccX=0;
          this.boxAccZ=0;

          
        }else{
          this.x+=this.boxAccX;
          this.y+=this.boxAccY;
          this.z+=this.boxAccZ;

          if(this.boxAccX<0)
            this.boxAccX+=this.boxAccXm;


          if(this.boxAccZ<0)
            this.boxAccZ+=this.boxAccZm;

          if(this.boxAccY<0)
            this.boxAccY+=this.boxAccYm;

          
        }       
      }
    }

  }

this.calcAccR=function(){
    if(this.PR){
      if( this.rotateVal<this.rotateValOrg+this.boxAccR){
        this.rotateVal+=this.boxAccRm;
      }
      else{
        if(this.boxAccR!=0){
          this.rotateVal=this.boxAccR+this.rotateValOrg;
          this.boxAccR=0;
          if(!this.finisehdAni){

            this.funishedFnc();
            this.finisehdAni=true;
          }
        }
      }
    }else{
      if( this.rotateVal>this.rotateValOrg+this.boxAccR){
        this.rotateVal-=this.boxAccRm;
      }
      else{
        if(this.boxAccR!=0){
          this.rotateVal=this.boxAccR+this.rotateValOrg;
          this.boxAccR=0;
          if(!this.finisehdAni){

            this.funishedFnc();
            this.finisehdAni=true;
          }
        }
      }
    }

  }
  this.setMatrix=function(mat){
    this.Matrix=mat;
  }
  this.setDraw = function(drawfunc,id){

    if(id!=null)
      this.DrawFuncs[id]=drawfunc;
    else
      this.DrawFuncs.push(drawfunc);

    return this.DrawFuncs.length-1;
  }
  this.draw=function(){
    if(this.kc3dObj!=0){
      var kc3dObj=this.kc3dObj;
      if(this.dobleTankMesh!=0){
        kc3dObj=this.dobleTankMesh;
      }
      this.calcAccR();


      this.calcAcc();

      if(this.clicked=="left"){
        this.z-=this.MoveingSpeed;
        this.Matrix=Translate([this.x,this.y,this.z],this.Matrix);
      }else if(this.clicked=="right"){
        this.z+=this.MoveingSpeed;
        this.Matrix=Translate([this.x,this.y,this.z],this.Matrix);
      }else if(this.clicked=="up"){
        this.x+=this.MoveingSpeed;
        this.Matrix=Translate([this.x,this.y,this.z],this.Matrix);
      }else if(this.clicked=="down"){
        this.x-=this.MoveingSpeed;
        this.Matrix=Translate([this.x,this.y,this.z],this.Matrix);
      }
      else{
        this.Matrix=Translate([this.x,this.y,this.z],this.Matrix);
      }
      

      this.Matrix=Rotate(this.rotateVal,this.rotate,this.Matrix);
      //this.Matrix=Rotate(90,[0,1,0],this.Matrix);
      
      for(var fui=0;fui<this.DrawFuncs.length;fui++){
        this.DrawFuncs[fui](this);
      }
      

      kc3dObj.draw(this.Matrix);

      

    }
  }
}