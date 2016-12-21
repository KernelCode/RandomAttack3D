var GameTextures=function(gl){
	this.gameText=[];
	this.glID=gl.TEXTURE1;

	this.handleTextureLoaded = function(file_name,image,buffer){

    var tBuf=gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tBuf);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
    gl.UNSIGNED_BYTE, image);

    gl.generateMipmap(gl.TEXTURE_2D);
    
    //this.glID++;
    
    this.gameText.push({
      name:file_name,
      buffer:tBuf,
      ActiveGL:this.glID
    });
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  this.getText = function(filename){

  	for(i=0;i<this.gameText.length;i++){
  		if(filename==this.gameText[i].name){
  			return this.gameText[i];
  		}
  		
  	}
  	this.load(filename);
  	//console.log("returning null from text");
  	return null;
  }
  this.setTexure = function(image,file_name,obj){

    image.onload = function() { obj.handleTextureLoaded(file_name,image); }
    image.src = "/objs/"+file_name+".png";

  }
  this.load = function(file_name){
  	this.setTexure(new Image(),file_name,this);
  }
}