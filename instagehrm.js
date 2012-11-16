var fs = require("fs");
var imgur = require("./immegrize.js");
var cp = require("child_process");

var outputFileCounter = 0;
var generatedFolder = "../instagehrmed";

module.exports.generatedHTMLFolder = generatedFolder;
module.exports.processImage = processImage;

function processImage(file, next) {
  horriblize(file, function(err, newStream) {
    if (err) return next(err);
    imgur.postImage(newStream, function(err, postedData) {
      if (err) return next(err);
      saveImageInfo(postedData, next);
    });
  });
}

function horriblize(inName, next) {
  outName = "output" + outputFileCounter++ + ".png";
  inFileReady();

  function inFileReady() {
    cp.exec("python horriblize.py " + inName + " " + outName, outFileReady);
  }

  function outFileReady(err) {
    fs.unlink(inName, function() {});
    if (err) return next(err);
    var readStream = fs.createReadStream(outName);
    readStream.on("end", function() {
      fs.unlink(outName, function() {});
    });
    next(null, readStream);
  }
}

var generatedFolder = "../instagehrmed";
if (!fs.existsSync(generatedFolder))
  fs.mkDirSync(generatedFolder)

function saveImageInfo(data, next) {
  var id = data.upload.image.hash;
  var html =
    "<!doctype html>\n"+
    "<title>INSTAGEHRMED " + id + "</title>\n"+
    "<a href=\""+data.upload.links.imgur_page+"\">"+
    "<img src=\""+data.upload.links.original+"\">"+
    "</a>";
  var name = id + ".html";
  fs.writeFile(generatedFolder + "/" + name, html, function(err) {
    if (err) return next(err);
    next(null, name);
  });
}
