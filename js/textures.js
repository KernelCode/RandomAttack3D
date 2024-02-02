/*
  handling and loading textures class

 */

var GameTextures = function (gl) {
  //textures array
  this.gameText = [];

  //textures WebGL ID
  this.glID = gl.TEXTURE1;
};

// set texture to webgl buffer and map it to positions
GameTextures.prototype.handleTextureLoaded = function (file_name, image, buffer) {
  var tBuf = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tBuf);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  gl.generateMipmap(gl.TEXTURE_2D);

  this.gameText.push({
    name: file_name,
    buffer: tBuf,
    ActiveGL: this.glID,
  });
  gl.bindTexture(gl.TEXTURE_2D, null);
};

//get Texture by filename
GameTextures.prototype.getText = function (filename) {
  for (i = 0; i < this.gameText.length; i++) {
    if (filename == this.gameText[i].name) {
      return this.gameText[i];
    }
  }

  this.load(filename);

  return null;
};

//set Texture by filename
GameTextures.prototype.setTexure = function (image, file_name, obj) {
  image.onload = function () {
    obj.handleTextureLoaded(file_name, image);
  };

  image.src = "//objs/" + file_name + ".png";
};

//load Texture by filename
GameTextures.prototype.load = function (file_name) {
  this.setTexure(new Image(), file_name, this);
};
