var KC3D =function(gl){
  this.vrcs;
  this.normals;
  this.indcs; 
  this.text; 
  this.textNames=[];
  this.ActiveText=0;
  this.Matrix =  Matrix.I(4); // same as loadIdentity();
  this.GameTextures;

  this.AniTrans =function(v){
    //this.Matrix=Matrix.I(4);
    //this.Matrix=Translate([-0.0, -0.0,v],this.Matrix) ;
  }
  this.deleteBuffers=function(){
    gl.deleteBuffer(this.vrcs);
    gl.deleteBuffer(this.indcs);
    gl.deleteBuffer(this.normals);
    console.log("deleted");
  }
  this.setVrcs=function(vrcs){
    this.vrcs=this.buildBuffer(this.vrcs,gl.ARRAY_BUFFER,vrcs,vrcs.length);
  }
  
  this.setupShader=function(sh){
    this.shader = new shader(sh,gl);
    
  }


  this.buildBuffer = function( buffer, type, data, itemSize ){
    
    buffer = gl.createBuffer();
    var f_or_u = Float32Array;

    if(type === gl.ARRAY_BUFFER){
      f_or_u = Float32Array;
    }else{
      f_or_u = Uint16Array;
    }
    
    gl.bindBuffer(type, buffer);
    gl.bufferData(type, new f_or_u(data), gl.STATIC_DRAW);
    buffer.type=type;
    buffer.itemSize = itemSize;

    buffer.numItems = data.length / itemSize;

    return buffer;
  }
  this.setUpSettings=function(){
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

  this.setTexure = function(GameTextures,file_name,obj,glText0){
    this.GameTextures=GameTextures;
    this.GameTextures.load(file_name);
    
    this.textNames.push(file_name);

  }

  this.bindTexure = function(txt){

    gl.bindTexture(gl.TEXTURE_2D, txt.buffer);
    gl.uniform1i(gl.getUniformLocation(this.shader.shaderProgram, "uSampler"), 0);
    /*gl.uniform3f(
        gl.getUniformLocation(this.shader.shaderProgram, "uSampler"),
        parseFloat(document.getElementById("lightPositionX").value),
        parseFloat(document.getElementById("lightPositionY").value),
        parseFloat(document.getElementById("lightPositionZ").value)
    );*/
  }
  this.bindAttBuffer=function (name,attr,len){
      if(name!=null){

        gl.bindBuffer(name.type, name);
        if(len>0){
          this.shader.setAttrs([attr]);
          gl.vertexAttribPointer(this.shader.getAttr(attr), len, gl.FLOAT, false, 0, 0);
        }
      }

    
      
  }

  this.bindUniBuffer=function (name,data){
      gl.uniform1f(gl.getUniformLocation(this.shader.shaderProgram, name), data);
  }
  
  this.setMatrixUniforms = function (mvMatrix) {
      var pUniform = gl.getUniformLocation(this.shader.shaderProgram, "uPMatrix");
      gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

      var mvUniform = gl.getUniformLocation(this.shader.shaderProgram, "uMVMatrix");
      gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));

      var normalMatrix = mvMatrix.inverse();
      if(normalMatrix!=null){
        normalMatrix = normalMatrix.transpose();
        var nUniform = gl.getUniformLocation(this.shader.shaderProgram, "uNormalMatrix");
        gl.uniformMatrix4fv(nUniform, false, new Float32Array(normalMatrix.flatten())); 
      }

  }
  this.draw = function(mainMatrix){
     // var val = this.AniTrans(val,mainMatrix);

      //for(i=0;i<this.textures.length;i++){
        
       // gl.activeTexture(this.textures[i].glText0);
      //  gl.bindTexture(gl.TEXTURE_2D,this.textures[i].buffer);
     // }

      

      gl.useProgram(this.shader.shaderProgram);
      this.bindAttBuffer(this.vrcs,"aVertexPosition",3);
      
      this.bindAttBuffer(this.indcs,"vertexIndices",0);
      this.bindAttBuffer(this.normals,"aVertexNormal",3);
      this.bindAttBuffer(this.text,"aTextureCoord",2);



      //d(this);
      gl.bindTexture(gl.TEXTURE_2D,null);
      this.setMatrixUniforms(mainMatrix);
      for(ti=0;ti<this.textNames.length;ti++){
        
        this.ActiveText=this.GameTextures.getText(this.textNames[ti]);

        if(this.ActiveText){

         // gl.activeTexture(this.ActiveText.ActiveGL);
          gl.bindTexture(gl.TEXTURE_2D,this.ActiveText.buffer);

    
        }
      }
      gl.drawElements(gl.TRIANGLES, this.indcs.itemSize, gl.UNSIGNED_SHORT, 0);
      

      //return val;
  }
}

function shader(names,gl){
 
  this.shaderProgram;

  this.shaderProgram = gl.createProgram();

  this.attrs=[];

  this.unies=[];
  
  this.attrsIndex=0;

  for( i = 0 ; i<names.length ; i ++){
    gl.attachShader(this.shaderProgram, getShader( gl, names[i] ) );
  }


  gl.linkProgram(this.shaderProgram);

  

  if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
    throw("error shader program failed!");
  }  

  this.getAttr=function(name){
    
    for( i = 0 ; i<this.attrsIndex ; i ++){

      if(this.attrs[i]['name']==name){
        return this.attrs[i]['val'];
      }
    }
  }
 
  this.setAttrs = function(names){
    for( i = 0 ; i < names.length ; i ++){
     
      this.attrs[this.attrsIndex]={name:names[i],val:gl.getAttribLocation(this.shaderProgram, names[i])};
      gl.enableVertexAttribArray(this.attrs[this.attrsIndex]['val']);
      this.attrsIndex++;
    }
  }

  this.disableAtt = function(names){
    for( i = 0 ; i<this.attrsIndex ; i ++){

      if(this.attrs[i]['name']==name){
        gl.disableVertexAttribArray(this.attrs[i]['val']);
        return ;
      }
    }
  }

  this.enableAtt = function(names){
    for( i = 0 ; i<this.attrsIndex ; i ++){

      if(this.attrs[i]['name']==name){
        gl.enableVertexAttribArray(this.attrs[i]['val']);
        return ;
      }
    }
  }

  this.setUnies= function(names){
    for( i = 0 ; i < names.length ; i ++){
      this.unies[this.uniesIndex]={name:names[i],val:gl.getUniformLocation(this.shaderProgram, names[i])};
      this.uniesIndex++;
    }
  }
  

  this.createAndGetShders =function(names){
    for( i = 0 ; i<names.length ; i ++){
      this.shads.push( getShader( gl, names[i] ) );
    }
  }

  this.linkProgram =function(){
    this.shaderProgram = gl.createProgram();
    for( i = 0 ; i<this.shads.length ; i ++){
      gl.attachShader(this.shaderProgram, this.shads[i]);
    }
    gl.linkProgram(this.shaderProgram);

    if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
      throw("error shader program failed!");
    }

  }

}