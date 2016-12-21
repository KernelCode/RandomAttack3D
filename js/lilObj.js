function lilObj(kc3d){
  this.x=0;
  this.y=-0.5;
  this.z=0;
  this.sizeX=1;
  this.sizeZ=1;

  this.Matrix=0;
  this.kc3dObj=0;
  this.kc3dObj=kc3d;
  this.rotate=[1,1,1];
  this.rotateVal=0;

  this.finisehdAni=true;
  this.funishedFnc=function(){};
  this.DrawFuncs=[];
  this.deleteBuffers=function(){
    this.kc3dObj.deleteBuffers();
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
      this.Matrix=Translate([this.x,this.y,this.z],this.Matrix);
      this.Matrix=Rotate(this.rotateVal,this.rotate,this.Matrix);
      for(var fui=0;fui<this.DrawFuncs.length;fui++){
        this.DrawFuncs[fui](this);
      }
      if(this.Matrix==0 || typeof this.Matrix=="undefined"){
        console.log("error");
      }
      this.kc3dObj.draw(this.Matrix);

      

    }
  }
}