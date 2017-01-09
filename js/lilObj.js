/*
  class to create small objects

 */
function lilObj(kc3d){
  //obj posissions
  this.x=0;
  this.y=-0.5;
  this.z=0;

  // obj size to apply scale mat
  this.sizeX=1;
  this.sizeZ=1;

  //the matrix to apply when rendring
  this.Matrix=0;
  
  //the kc3dObj the object holding textures, obj mesh and webgl functions
  this.kc3dObj=kc3d;

  // the rotate values to apply in the matrix
  this.rotate=[1,1,1];

  //current rotate value
  this.rotateVal=0;

  //obj animation function
  this.finisehdAni=true;
  this.funishedFnc=function(){};
  this.DrawFuncs=[];



}

//delete all buffers
lilObj.prototype.deleteBuffers=function(){
  this.kc3dObj.deleteBuffers();
}

//set main matrix
lilObj.prototype.setMatrix=function(mat){
  this.Matrix=mat;
}

//set and add draw function
lilObj.prototype.setDraw = function(drawfunc,id){

  if(id!=null)
    this.DrawFuncs[id]=drawfunc;
  else
    this.DrawFuncs.push(drawfunc);

  return this.DrawFuncs.length-1;
}

//draw/render obj
lilObj.prototype.draw=function(){
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