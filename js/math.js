function loadIdentity() {
  mvMatrix = Matrix.I(4);
}
function multMatrixR(m,rm) {
  return  rm.x(m);
}

function Translate(v,matrix) {
  return multMatrixR(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4(),matrix);
}

function multMatrix(m) {
  mvMatrix = mvMatrix.x(m);
}

function mvTranslate(v) {
  multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}


function OmultMatrix(m) {
  return mvMatrix.x(m);
}

function OmvTranslate(v) {
  return OmultMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}
function Rotate(angle, v,matrix) {
  var inRadians = angle * Math.PI / 180.0;

  var m = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
  return multMatrixR(m,matrix);
}
function mvRotate(angle, v) {
  var inRadians = angle * Math.PI / 180.0;

  var m = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
  multMatrix(m);
}
var mvMatrixStack = [];

function mvPushMatrix(m) {
  if (m) {
    mvMatrixStack.push(m.dup());
    mvMatrix = m.dup();
  } else {
    mvMatrixStack.push(mvMatrix.dup());
  }
}

function mvPopMatrix() {
  if (!mvMatrixStack.length) {
    throw("Can't pop from an empty matrix stack.");
  }

  mvMatrix = mvMatrixStack.pop();
  return mvMatrix;
}
function matrixVectorMultiply(v, m, dst) {
  dst = dst || new Float32Array(4);
  for (var i = 0; i < 4; ++i) {
    dst[i] = 0.0;
    for (var j = 0; j < 4; ++j) {
      dst[i] += v[j] * m[j * 4 + i];
    }
  }
  return dst;
}