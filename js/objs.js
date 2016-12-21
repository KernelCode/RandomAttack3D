var TANKs=[];
var Shots=[];
var GameTexturesObj=0 ;
var tankMesh=0;
function GOBJ(gl,vrcs,normals,indcs,text,col,ID,shaderfs){

        var g2 = new KC3D(gl);

        if(shaderfs){
        	g2.setupShader([shaderfs,"shader-vs"]);
        }else
         g2.setupShader(["shader-fs","shader-vs"]);
        if(vrcs)
          g2.vrcs=g2.buildBuffer(g2.vrcs,gl.ARRAY_BUFFER,vrcs,vrcs.length);
        if(normals)
          g2.normals=g2.buildBuffer(g2.normals,gl.ARRAY_BUFFER,normals,normals.length);
        if(indcs)
          g2.indcs=g2.buildBuffer(g2.indcs,gl.ELEMENT_ARRAY_BUFFER,indcs,indcs.length);
        if(text){

          g2.text=g2.buildBuffer(g2.text,gl.ARRAY_BUFFER,text,text.length);
          GameTexturesObj.gl=gl;
          g2.setTexure(GameTexturesObj,col);
        
          
          
          
        }
        g2.setUpSettings();
        
        return g2;
}

function objs(type,ID,func,vrcsSize){
	if(GameTexturesObj==0){
		GameTexturesObj =new GameTextures(GL);
	}
	if(type=="life"){
		var sizeX=0.9;
		var sizeY=0.2;
		var sizeZ=0.2;

		var TextVal=0.1;
		
		return GOBJ(
                GL,
	                [
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
			    ],
			    [
			    // Front
			     0.0,  0.0,  1.0,
			     0.0,  0.0,  1.0,
			     0.0,  0.0,  1.0,
			     0.0,  0.0,  1.0,

			    // Back
			     0.0,  0.0, -1.0,
			     0.0,  0.0, -1.0,
			     0.0,  0.0, -1.0,
			     0.0,  0.0, -1.0,

			    // Top
			     0.0,  1.0,  0.0,
			     0.0,  1.0,  0.0,
			     0.0,  1.0,  0.0,
			     0.0,  1.0,  0.0,

			    // Bottom
			     0.0, -1.0,  0.0,
			     0.0, -1.0,  0.0,
			     0.0, -1.0,  0.0,
			     0.0, -1.0,  0.0,

			    // Right
			     1.0,  0.0,  0.0,
			     1.0,  0.0,  0.0,
			     1.0,  0.0,  0.0,
			     1.0,  0.0,  0.0,

			    // Left
			    -1.0,  0.0,  0.0,
			    -1.0,  0.0,  0.0,
			    -1.0,  0.0,  0.0,
			    -1.0,  0.0,  0.0
			    ],
			    [
			        0,  1,  2,      0,  2,  3,    // front
			        4,  5,  6,      4,  6,  7,    // back
			        8,  9,  10,     8,  10, 11,   // top
			        12, 13, 14,     12, 14, 15,   // bottom
			        16, 17, 18,     16, 18, 19,   // right
			        20, 21, 22,     20, 22, 23    // left
			      ],
			          [
			      // Front
			      0.0,  0.0,
			      1.0,  0.0,
			      1.0,  1.0,
			      0.0,  1.0,
			      // Back
			      0.0,  0.0,
			      1.0,  0.0,
			      1.0,  1.0,
			      0.0,  1.0,
			      // Top
			      0.0,  0.0,
			      1.0,  0.0,
			      1.0,  1.0,
			      0.0,  1.0,
			      // Bottom
			      0.0,  0.0,
			      1.0,  0.0,
			      1.0,  1.0,
			      0.0,  1.0,
			      // Right
			      0.0,  0.0,
			      1.0,  0.0,
			      1.0,  1.0,
			      0.0,  1.0,
			      // Left
			      0.0,  0.0,
			      1.0,  0.0,
			      1.0,  1.0,
			      0.0,  1.0
	    ],ID,ID,"shader-fs"
	    );
	}
	if(type=="shot"){
		var sizeX=0.17;
		var sizeY=0.17;
		var sizeZ=0.17;

		var TextVal=0.1;
		
		return GOBJ(
                GL,
	                [
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
			    ],
			    [
			    // Front
			     0.0,  0.0,  1.0,
			     0.0,  0.0,  1.0,
			     0.0,  0.0,  1.0,
			     0.0,  0.0,  1.0,

			    // Back
			     0.0,  0.0, -1.0,
			     0.0,  0.0, -1.0,
			     0.0,  0.0, -1.0,
			     0.0,  0.0, -1.0,

			    // Top
			     0.0,  1.0,  0.0,
			     0.0,  1.0,  0.0,
			     0.0,  1.0,  0.0,
			     0.0,  1.0,  0.0,

			    // Bottom
			     0.0, -1.0,  0.0,
			     0.0, -1.0,  0.0,
			     0.0, -1.0,  0.0,
			     0.0, -1.0,  0.0,

			    // Right
			     1.0,  0.0,  0.0,
			     1.0,  0.0,  0.0,
			     1.0,  0.0,  0.0,
			     1.0,  0.0,  0.0,

			    // Left
			    -1.0,  0.0,  0.0,
			    -1.0,  0.0,  0.0,
			    -1.0,  0.0,  0.0,
			    -1.0,  0.0,  0.0
			    ],
			    [
			        0,  1,  2,      0,  2,  3,    // front
			        4,  5,  6,      4,  6,  7,    // back
			        8,  9,  10,     8,  10, 11,   // top
			        12, 13, 14,     12, 14, 15,   // bottom
			        16, 17, 18,     16, 18, 19,   // right
			        20, 21, 22,     20, 22, 23    // left
			      ],
			          [
			      // Front
			      0.0,  0.0,
			      1.0,  0.0,
			      1.0,  1.0,
			      0.0,  1.0,
			      // Back
			      0.0,  0.0,
			      1.0,  0.0,
			      1.0,  1.0,
			      0.0,  1.0,
			      // Top
			      0.0,  0.0,
			      1.0,  0.0,
			      1.0,  1.0,
			      0.0,  1.0,
			      // Bottom
			      0.0,  0.0,
			      1.0,  0.0,
			      1.0,  1.0,
			      0.0,  1.0,
			      // Right
			      0.0,  0.0,
			      1.0,  0.0,
			      1.0,  1.0,
			      0.0,  1.0,
			      // Left
			      0.0,  0.0,
			      1.0,  0.0,
			      1.0,  1.0,
			      0.0,  1.0
	    ],ID,ID,"shader-fsBlur"
	    );
	}
	if(type=="box"){
		var sizeX=func[0];
		var sizeY=func[1];
		var sizeZ=func[2];

		var TextVal=0.1;
		
		return GOBJ(
                GL,
	                [
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
			    ],
			    [
			    // Front
			     0.0,  0.0,  1.0,
			     0.0,  0.0,  1.0,
			     0.0,  0.0,  1.0,
			     0.0,  0.0,  1.0,

			    // Back
			     0.0,  0.0, -1.0,
			     0.0,  0.0, -1.0,
			     0.0,  0.0, -1.0,
			     0.0,  0.0, -1.0,

			    // Top
			     0.0,  1.0,  0.0,
			     0.0,  1.0,  0.0,
			     0.0,  1.0,  0.0,
			     0.0,  1.0,  0.0,

			    // Bottom
			     0.0, -1.0,  0.0,
			     0.0, -1.0,  0.0,
			     0.0, -1.0,  0.0,
			     0.0, -1.0,  0.0,

			    // Right
			     1.0,  0.0,  0.0,
			     1.0,  0.0,  0.0,
			     1.0,  0.0,  0.0,
			     1.0,  0.0,  0.0,

			    // Left
			    -1.0,  0.0,  0.0,
			    -1.0,  0.0,  0.0,
			    -1.0,  0.0,  0.0,
			    -1.0,  0.0,  0.0
			    ],
			    [
			        0,  1,  2,      0,  2,  3,    // front
			        4,  5,  6,      4,  6,  7,    // back
			        8,  9,  10,     8,  10, 11,   // top
			        12, 13, 14,     12, 14, 15,   // bottom
			        16, 17, 18,     16, 18, 19,   // right
			        20, 21, 22,     20, 22, 23    // left
			      ],
			          [
			      // Front
			      0.0,  0.0,
			      1.0,  0.0,
			      1.0,  1.0,
			      0.0,  1.0,
			      // Back
			      0.0,  0.0,
			      1.0,  0.0,
			      1.0,  1.0,
			      0.0,  1.0,
			      // Top
			      0.0,  0.0,
			      1.0,  0.0,
			      1.0,  1.0,
			      0.0,  1.0,
			      // Bottom
			      0.0,  0.0,
			      1.0,  0.0,
			      1.0,  1.0,
			      0.0,  1.0,
			      // Right
			      0.0,  0.0,
			      1.0,  0.0,
			      1.0,  1.0,
			      0.0,  1.0,
			      // Left
			      0.0,  0.0,
			      1.0,  0.0,
			      1.0,  1.0,
			      0.0,  1.0
	    ],ID,ID
	    );
	}
	if(type=="geo"){
		//console.log("geo loaded");
		var size=0;
		var sizeX=308;
		var TextVal=1.2;
		return GOBJ(
                GL,
                [
    // Front face
    size*-1, size*-1,  size,
     size, size*-1,  size,
     size,  size,  size,
    size*-1,  size,  size,

    // Back face
    size*-1, size*-1, size*-1,
    size*-1,  size, size*-1,
     size,  size, size*-1,
     size, size*-1, size*-1,

    // Top face
    sizeX,  0, sizeX,
    sizeX*-1,  0, sizeX,
    sizeX*-1,  0, sizeX*-1,
    sizeX,  0, sizeX*-1,

    // Bottom face
    size*-1, size*-1, size*-1,
     size, size*-1, size*-1,
     size, size*-1,  size,
    size*-1, size*-1,  size,

    // Right face
     size, size*-1, size*-1,
     size,  size, size*-1,
     size,  size,  size,
     size, size*-1,  size,

    // Left face
    size*-1, size*-1, size*-1,
    size*-1, size*-1,  size,
    size*-1,  size,  size,
    size*-1,  size, size*-1
    ],
    [
    // Front
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,

    // Back
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,

    // Top
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,

    // Bottom
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,

    // Right
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,

    // Left
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0
    ],
    [
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23    // left
      ],
          [
      // Front
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Back
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Top
      sizeX/TextVal, sizeX/TextVal,
      1.0,  sizeX/TextVal,
      1.0,  1.0,
      sizeX/TextVal,  5.0,
      // Bottom
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Right
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Left
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0
    ],"floorText","Player"
    );
	}
	if(type=="tank"){
		OBJ.downloadMeshes({
	      'tank': '/objs/tank2.obj'  
	    },
	    function(meshes){
	      gl = GL;
	      var mesh=meshes.tank;
	      tankMesh=mesh;
	      for(i=0;i<mesh.vertices.length;i++){
	        mesh.vertices[i]*=0.6;
	      }
	      for(i=0;i<mesh.textures.length;i++){
	        mesh.textures[i]*=0.12;
	      }
	     
	      func(GOBJ(
	          GL,
	          mesh.vertices,
	          mesh.vertexNormals,
	          mesh.indices,
	          mesh.textures,ID,"Player"
	        ));

	    });
	}
	if(type=="Solider"){
		var vertices=[];
	    for(i=0;i<tankMesh.vertices.length;i++){
	      vertices[i]=tankMesh.vertices[i]*vrcsSize;
	    }
	    for(i=0;i<tankMesh.textures.length;i++){
	      tankMesh.textures[i]*=0.12;
	    }
	     
	    func(GOBJ(
	        GL,
	        vertices,
	        tankMesh.vertexNormals,
	        tankMesh.indices,
	        tankMesh.textures,ID,"Player"
	    ));
	}
	if(type=="OFFCIER"){
		var vertices=[];
	    for(i=0;i<tankMesh.vertices.length;i++){
	      vertices[i]=tankMesh.vertices[i]*vrcsSize;
	    }
	    for(i=0;i<tankMesh.textures.length;i++){
	      tankMesh.textures[i]*=0.12;
	    }
	     
	    func(GOBJ(
	        GL,
	        vertices,
	        tankMesh.vertexNormals,
	        tankMesh.indices,
	        tankMesh.textures,ID,"Player"
	    ));
	}
	if(type=="CORNOL"){
		var vertices=[];
	    for(i=0;i<tankMesh.vertices.length;i++){
	      vertices[i]=tankMesh.vertices[i]*vrcsSize;
	    }
	    for(i=0;i<tankMesh.textures.length;i++){
	      tankMesh.textures[i]*=0.12;
	    }
	     
	    func(GOBJ(
	        GL,
	        vertices,
	        tankMesh.vertexNormals,
	        tankMesh.indices,
	        tankMesh.textures,ID,"Player"
	    ));
	}
	if(type=="Worrior"){
		var vertices=[];
	    for(i=0;i<tankMesh.vertices.length;i++){
	      vertices[i]=tankMesh.vertices[i]*vrcsSize;
	    }
	    for(i=0;i<tankMesh.textures.length;i++){
	      tankMesh.textures[i]*=0.12;
	    }
	     
	    func(GOBJ(
	        GL,
	        vertices,
	        tankMesh.vertexNormals,
	        tankMesh.indices,
	        tankMesh.textures,ID,"Player"
	    ));
	}
	if(type=="GOVNER"){
		var vertices=[];
	    for(i=0;i<tankMesh.vertices.length;i++){
	      vertices[i]=tankMesh.vertices[i]*vrcsSize;
	    }
	    for(i=0;i<tankMesh.textures.length;i++){
	      tankMesh.textures[i]*=0.12;
	    }
	     
	    func(GOBJ(
	        GL,
	        vertices,
	        tankMesh.vertexNormals,
	        tankMesh.indices,
	        tankMesh.textures,ID,"Player"
	    ));
	}
	if(type=="CAPTEN"){
		var vertices=[];
	    for(i=0;i<tankMesh.vertices.length;i++){
	      vertices[i]=tankMesh.vertices[i]*vrcsSize;
	    }
	    for(i=0;i<tankMesh.textures.length;i++){
	      tankMesh.textures[i]*=0.12;
	    }
	     
	    func(GOBJ(
	        GL,
	        vertices,
	        tankMesh.vertexNormals,
	        tankMesh.indices,
	        tankMesh.textures,ID,"Player"
	    ));
	}
	if(type=="Presdnet"){
		var vertices=[];
	    for(i=0;i<tankMesh.vertices.length;i++){
	      vertices[i]=tankMesh.vertices[i]*vrcsSize;
	    }
	    for(i=0;i<tankMesh.textures.length;i++){
	      tankMesh.textures[i]*=0.12;
	    }
	     
	    func(GOBJ(
	        GL,
	        vertices,
	        tankMesh.vertexNormals,
	        tankMesh.indices,
	        tankMesh.textures,ID,"Player"
	    ));
	}
	if(type=="MASTER"){
		var vertices=[];
	    for(i=0;i<tankMesh.vertices.length;i++){
	      vertices[i]=tankMesh.vertices[i]*vrcsSize;
	    }
	    for(i=0;i<tankMesh.textures.length;i++){
	      tankMesh.textures[i]*=0.12;
	    }
	     
	    func(GOBJ(
	        GL,
	        vertices,
	        tankMesh.vertexNormals,
	        tankMesh.indices,
	        tankMesh.textures,ID,"Player"
	    ));
	}
	if(type=="NINJA"){
		var vertices=[];
	    for(i=0;i<tankMesh.vertices.length;i++){
	      vertices[i]=tankMesh.vertices[i]*vrcsSize;
	    }
	    for(i=0;i<tankMesh.textures.length;i++){
	      tankMesh.textures[i]*=0.12;
	    }
	     
	    func(GOBJ(
	        GL,
	        vertices,
	        tankMesh.vertexNormals,
	        tankMesh.indices,
	        tankMesh.textures,ID,"Player"
	    ));
	}
	if(type=="RandomAttack"){
		var vertices=[];
	    for(i=0;i<tankMesh.vertices.length;i++){
	      vertices[i]=tankMesh.vertices[i]*vrcsSize;
	    }
	    for(i=0;i<tankMesh.textures.length;i++){
	      tankMesh.textures[i]*=0.12;
	    }
	     
	    func(GOBJ(
	        GL,
	        vertices,
	        tankMesh.vertexNormals,
	        tankMesh.indices,
	        tankMesh.textures,ID,"Player"
	    ));
	}
	if(type=="DoomDay"){
		OBJ.downloadMeshes({
	      'tank': '/objs/DoomDay.obj'  
	    },
	    function(meshes){
	      gl = GL;
	      var mesh=meshes.tank;
	      for(i=0;i<mesh.vertices.length;i++){
	        mesh.vertices[i]*=0.6;
	      }
	      for(i=0;i<mesh.textures.length;i++){
	        mesh.textures[i]*=0.12;
	      }
	     
	      func(GOBJ(
	          GL,
	          mesh.vertices,
	          mesh.vertexNormals,
	          mesh.indices,
	          mesh.textures,ID,"Player"
	        ));

	    });
	}
	if(type=="fix"){
		OBJ.downloadMeshes({
	      'fix': '/objs/fixtank.obj'  
	    },
	    function(meshes){
	      gl = GL;
	      var mesh=meshes.fix;
	      for(i=0;i<mesh.vertices.length;i++){
	        mesh.vertices[i]*=1.4;
	      }

	      func(GOBJ(
	          GL,
	          mesh.vertices,
	          mesh.vertexNormals,
	          mesh.indices,
	          mesh.textures,ID,"Fix"
	        ));

	    });
	}
	if(type=="speedShot"){
		OBJ.downloadMeshes({
	      'fix': '/objs/speedShot.obj'  
	    },
	    function(meshes){
	      gl = GL;
	      var mesh=meshes.fix;
	      for(i=0;i<mesh.vertices.length;i++){
	        mesh.vertices[i]*=1.4;
	      }

	      func(GOBJ(
	          GL,
	          mesh.vertices,
	          mesh.vertexNormals,
	          mesh.indices,
	          mesh.textures,ID,"speedShot"
	        ));

	    });
	}
	if(type=="strongShot"){
		OBJ.downloadMeshes({
	      'fix': '/objs/strongShot.obj'  
	    },
	    function(meshes){
	      gl = GL;
	      var mesh=meshes.fix;
	      for(i=0;i<mesh.vertices.length;i++){
	        mesh.vertices[i]*=1.4;
	      }

	      func(GOBJ(
	          GL,
	          mesh.vertices,
	          mesh.vertexNormals,
	          mesh.indices,
	          mesh.textures,ID,"strongShot"
	        ));

	    });
	}
	if(type=="bigBoom"){
		OBJ.downloadMeshes({
	      'fix': '/objs/BigBoom.obj'  
	    },
	    function(meshes){
	      gl = GL;
	      var mesh=meshes.fix;
	      for(i=0;i<mesh.vertices.length;i++){
	        mesh.vertices[i]*=1.4;
	      }

	      func(GOBJ(
	          GL,
	          mesh.vertices,
	          mesh.vertexNormals,
	          mesh.indices,
	          mesh.textures,ID,"bigBoom"
	        ));

	    });
	}
	if(type=="TeamHouse"){
		OBJ.downloadMeshes({
	      'fix': '/objs/TeamHouse.obj'  
	    },
	    function(meshes){
	      gl = GL;
	      var mesh=meshes.fix;
	      for(i=0;i<mesh.vertices.length;i++){
	        mesh.vertices[i]*=1.4;
	      }

	      func(GOBJ(
	          GL,
	          mesh.vertices,
	          mesh.vertexNormals,
	          mesh.indices,
	          mesh.textures,ID,"bigBoom"
	        ));

	    });
	}
	if(type=="Tre"){
		OBJ.downloadMeshes({
	      'tre': '/objs/tre.obj'  
	    },
	    function(meshes){
	      gl = GL;
	      var mesh=meshes.tre;
	      for(i=0;i<mesh.vertices.length;i++){
	        mesh.vertices[i]*=10.4;
	      }
	      for(i=0;i<mesh.textures.length;i++){
	        mesh.textures[i]*=12.12;
	      }
	      func(GOBJ(
	          GL,
	          mesh.vertices,
	          mesh.vertexNormals,
	          mesh.indices,
	          mesh.textures,ID,"tre"
	        ));

	    });
	}
}