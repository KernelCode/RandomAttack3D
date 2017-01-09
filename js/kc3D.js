/*
  class to abscract WebGl functions
  
 */

var KC3D =function(gl){
  //main gl
  this.gl=gl;

  //vertics buffer
  this.vrcs;

  //normals buffer
  this.normals;

  //indecs buffer
  this.indcs; 

  //textures buffer
  this.text; 

  //textures names 
  this.textNames=[];

  //active texture
  this.ActiveText=0;

  //main matrix
  this.Matrix =  Matrix.I(4); // same as loadIdentity();

  //main texture
  this.GameTextures;
}



//deleting all buffers

KC3D.prototype.deleteBuffers=function(){
  this.gl.deleteBuffer(this.vrcs);
  this.gl.deleteBuffer(this.indcs);
  this.gl.deleteBuffer(this.normals);
  console.log("deleted");
}


//set vertics buffers
KC3D.prototype.setVrcs=function(vrcs){
  this.vrcs=this.buildBuffer(this.vrcs,this.gl.ARRAY_BUFFER,vrcs,vrcs.length);
}

//set create new shader object 
KC3D.prototype.setupShader=function(sh){
  this.shader = new shader(sh,this.gl);
  
}


//build WebGL buffer with type and data
KC3D.prototype.buildBuffer = function( buffer, type, data, itemSize ){
  
  buffer = this.gl.createBuffer();
  var f_or_u = Float32Array;

  if(type === this.gl.ARRAY_BUFFER){
    f_or_u = Float32Array;
  }else{
    f_or_u = Uint16Array;
  }
  
  this.gl.bindBuffer(type, buffer);
  this.gl.bufferData(type, new f_or_u(data), this.gl.STATIC_DRAW);
  buffer.type=type;
  buffer.itemSize = itemSize;

  buffer.numItems = data.length / itemSize;

  return buffer;
}

//setting up defualt settings

KC3D.prototype.setUpSettings=function(){

  if(this.text==null){

      this.shader.disableAtt("aTextureCoord");

  }
  if(this.indcs==null){

      this.shader.disableAtt("vertexIndices");

  }
  if(this.normals==null){

      this.shader.disableAtt("normals");

  }

} 

//add texture to textures chain
KC3D.prototype.setTexure = function(GameTextures,file_name,obj,glText0){

  this.GameTextures=GameTextures;

  this.GameTextures.load(file_name);
  
  this.textNames.push(file_name);

}


//bind texture to WebGL buffer
KC3D.prototype.bindTexure = function(txt){

  this.gl.bindTexture(this.gl.TEXTURE_2D, txt.buffer);
  this.gl.uniform1i(this.gl.getUniformLocation(this.shader.shaderProgram, "uSampler"), 0);

}

//bind Attrib value to WebGL shader
KC3D.prototype.bindAttBuffer=function (name,attr,len){
    if(name!=null){

      this.gl.bindBuffer(name.type, name);
      if(len>0){
        this.shader.setAttrs([attr]);
        this.gl.vertexAttribPointer(this.shader.getAttr(attr), len, this.gl.FLOAT, false, 0, 0);
      }
    }

  
    
}

//bind Uniform  value to WebGL shader
KC3D.prototype.bindUniBuffer=function (name,data){
    this.gl.uniform1f(this.gl.getUniformLocation(this.shader.shaderProgram, name), data);
}

//set Uniforms values
KC3D.prototype.setMatrixUniforms = function (mvMatrix) {
    var pUniform = this.gl.getUniformLocation(this.shader.shaderProgram, "uPMatrix");
    this.gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

    var mvUniform = this.gl.getUniformLocation(this.shader.shaderProgram, "uMVMatrix");
    this.gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));

    var normalMatrix = mvMatrix.inverse();
    if(normalMatrix!=null){
      normalMatrix = normalMatrix.transpose();
      var nUniform = this.gl.getUniformLocation(this.shader.shaderProgram, "uNormalMatrix");
      this.gl.uniformMatrix4fv(nUniform, false, new Float32Array(normalMatrix.flatten())); 
    }

}

//draw mesh and apply matrices 
KC3D.prototype.draw = function(mainMatrix){

    this.gl.useProgram(this.shader.shaderProgram);
    this.bindAttBuffer(this.vrcs,"aVertexPosition",3);

    this.bindAttBuffer(this.indcs,"vertexIndices",0);

    this.bindAttBuffer(this.normals,"aVertexNormal",3);

    this.bindAttBuffer(this.text,"aTextureCoord",2);



    this.gl.bindTexture(this.gl.TEXTURE_2D,null);

    this.setMatrixUniforms(mainMatrix);

    for(ti=0;ti<this.textNames.length;ti++){
      
      this.ActiveText=this.GameTextures.getText(this.textNames[ti]);

      if(this.ActiveText){

        this.gl.bindTexture(this.gl.TEXTURE_2D,this.ActiveText.buffer);

      }
      
    }

    this.gl.drawElements(this.gl.TRIANGLES, this.indcs.itemSize, this.gl.UNSIGNED_SHORT, 0);
    
}


//shader class to manage shaders and set shaders values
function shader(names,gl){

  this.gl = gl;
  
  this.shaderProgram;

  this.shaderProgram = gl.createProgram();

  this.attrs=[];

  this.unies=[];

  this.attrsIndex=0;

  for( i = 0 ; i<names.length ; i ++){
    this.gl.attachShader(this.shaderProgram, getShader( this.gl, names[i] ) );
  }


  this.gl.linkProgram(this.shaderProgram);



  if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
    throw("error shader program failed!");
  }  

  
}
shader.prototype.getAttr=function(name){
  
  for( i = 0 ; i<this.attrsIndex ; i ++){

    if(this.attrs[i]['name']==name){
      return this.attrs[i]['val'];
    }
  }
}

shader.prototype.setAttrs = function(names){
  for( i = 0 ; i < names.length ; i ++){
   
    this.attrs[this.attrsIndex]={name:names[i],val:this.gl.getAttribLocation(this.shaderProgram, names[i])};
    this.gl.enableVertexAttribArray(this.attrs[this.attrsIndex]['val']);
    this.attrsIndex++;
  }
}

shader.prototype.disableAtt = function(names){
  for( i = 0 ; i<this.attrsIndex ; i ++){

    if(this.attrs[i]['name']==name){
      this.gl.disableVertexAttribArray(this.attrs[i]['val']);
      return ;
    }
  }
}

shader.prototype.enableAtt = function(names){
  for( i = 0 ; i<this.attrsIndex ; i ++){

    if(this.attrs[i]['name']==name){
      this.gl.enableVertexAttribArray(this.attrs[i]['val']);
      return ;
    }
  }
}

shader.prototype.setUnies= function(names){
  for( i = 0 ; i < names.length ; i ++){
    this.unies[this.uniesIndex]={name:names[i],val:this.gl.getUniformLocation(this.shaderProgram, names[i])};
    this.uniesIndex++;
  }
}


shader.prototype.createAndGetShders =function(names){
  for( i = 0 ; i<names.length ; i ++){
    this.shads.push( getShader( this.gl, names[i] ) );
  }
}

shader.prototype.linkProgram =function(){
  this.shaderProgram = this.gl.createProgram();
  for( i = 0 ; i<this.shads.length ; i ++){
    this.gl.attachShader(this.shaderProgram, this.shads[i]);
  }
  this.gl.linkProgram(this.shaderProgram);

  if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
    throw("error shader program failed!");
  }

}