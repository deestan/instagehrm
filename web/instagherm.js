/* Deps:
 * - ccv
 * - face
*/

function cutHeads (canvas) {
  detected = ccv.detect_objects({
    "canvas" : ccv.pre(canvas),
    "cascade" : cascade,
    "interval" : 5,
    "min_neighbors" : 1 });
  
  var topIncision = Infinity;
  var horizontalIncision = Infinity;
  var isLeft = true;

  for (var i=0; i<detected.length; i++) {
    var face = detected[i];
    console.log(face);
    if (face.confidence > 0.0) {
      if (face.y < topIncision)
        topIncision = face.y;
      if (face.x < horizontalIncision) {
        horizontalIncision = face.x;
        isLeft = true;
      }
      var faceRight = canvas.width - (face.x + face.width);
      if (faceRight < horizontalIncision) {
        horizontalIncision = faceRight;
        isLeft = false;
      }
    }
  }

  if (topIncision > canvas.height * 0.4)
    topIncision = 0;
  if (horizontalIncision > canvas.width * 0.4) {
    horizontalIncision = 0;
    isLeft = true;
  }

  var newWidth = canvas.width - horizontalIncision;
  var newHeight = canvas.height - topIncision;
  var whRatio = canvas.width / canvas.height;

  while (newWidth / newHeight < whRatio)
    newHeight -= 1;
  while (newWidth / newHeight > whRatio)
    newWidth -= 1;

  var fromLeft = horizontalIncision;
  if (!isLeft)
    fromLeft = canvas.width - horizontalIncision - newWidth;

  canvas.getContext('2d').drawImage(
    canvas,
    fromLeft, topIncision, newWidth, newHeight,
    0, 0, canvas.width, canvas.height
  );
}

function blur (canvas) {
  var mini = document.createElement("canvas");
  mini.width = Math.floor(canvas.width / 100);
  mini.height = Math.floor(canvas.height / 100);
  mini.imageSmoothingEnabled = true;
  mini.getContext('2d').drawImage(canvas, 0, 0);
  canvas.getContext('2d').drawImage(mini, 0, 0);
}

var img = document.getElementById("img");
var canvas = document.getElementById("canvas");
var detected;
window.onload = function () {
  canvas.width = img.width;
  canvas.height = img.height;
  canvas.imageSmoothingEnabled = true;
  canvas.getContext('2d').drawImage(img, 0, 0);
  
  cutHeads(canvas);
  blur(canvas);
};
