var express = require("express");
var ig = require("./instagehrm");
var formidable = require("formidable");
var fs = require("fs");

var app = express();
app.use(express.static(__dirname + "/web"));
app.use(express.static(__dirname + "/" + ig.generatedHTMLFolder));

app.post('/1/upload', function (req, res) {
  dealWithTheUpload(req, function(err, uploaded) {
    if (err) return returnError(res, err);
    res.redirect(uploaded.file);
  });
});

app.post('/1/upload.json', function (req, res) {
  dealWithTheUpload(req, function(err, uploaded) {
    if (err) return returnError(res, err);
    res.send({ url: uploaded.file,
               id: uploaded.id,
               deletehash: uploaded.deletehash });
  });
});

function dealWithTheUpload(req, next) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    if (err) return next(err);
    if (!files.image)
      return next({instagehrmError: "No image given."});
    var file = files.image.path;
    ig.processImage(file, next);
  });
}

function returnError(res, err) {
  if (err && err.instagehrmError)
    return res.json(500, err.instagehrmError);
  // generic error
  res.statusCode = 500;
  res.end("" + err);
}

app.listen(8855);