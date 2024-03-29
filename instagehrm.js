var fs = require("fs");
var imgur = require("./immegrize.js");
var cp = require("child_process");
var htmlizer = require("./htmlizer");

var outputFileCounter = 0;
var generatedFolder = "../instagehrmed";
var imageDataFolder = "../instagehrmed-data";

module.exports.imageDataFolder = imageDataFolder;
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

if (!fs.existsSync(generatedFolder))
  fs.mkDirSync(generatedFolder)
if (!fs.existsSync(imageDataFolder))
  fs.mkDirSync(imageDataFolder)

function saveImageInfo(data, next) {
  var id = data.upload.image.hash;

  fs.writeFile(
    imageDataFolder + "/" + id + ".json",
    JSON.stringify(data),
    function(err) {
      // No biggie.
    });
  
  var html = htmlizer.generatePage(data);

  var name = id + ".html";

  fs.writeFile(generatedFolder + "/" + name, html, function(err) {
    if (err) return next(err);
    next(null, { file: name,
                 id: id,
                 deletehash: data.upload.image.deletehash });
  });
}
