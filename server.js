var express = require("express");
var ig = require("./instagehrm");
var formidable = require("formidable");
var fs = require("fs");

var app = express();
app.use(express.static(__dirname + "/web"));
app.use(express.static(__dirname + "/" + ig.generatedHTMLFolder));

app.post('/1/upload', function (req, res) {
  function returnError(err) {
    res.statusCode = 500;
    res.end(err);
  }
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    if (err) return returnError(err);
    var file = files.image.path;
    ig.processImage(file, function(err, newfile) {
      if (err) return returnError(err);
      res.redirect(newfile);
    });
  });
});

app.listen(8855);