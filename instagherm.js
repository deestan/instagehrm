var fs = require("fs");
var imgur = require("./immegrize.js");
var cp = require("child_process");

module.exports.processImage = processImage;

function processImage(stream, next) {
  horriblize(stream, function(err, newStream) {
    if (err) return next(err);
    imgur.postImage(newStream, function(err, postedData) {
      if (err) return next(err);
      saveImageInfo(postedData, next);
    });
  });
}

function horriblize(stream, next) {
  var newName = "input";
  var outName = "output.png";
  var writeStream = fs.createWriteStream(newName);
  stream.pipe(writeStream);
  stream.on("end", function() {
    writeStream.end();
  });
  writeStream.on("close", inFileReady);

  function inFileReady(err) {
    if (err) return next(err);
    cp.exec("python horriblize.py " + newName + " " + outName, outFileReady);
  }

  function outFileReady(err) {
    fs.unlink(newName, function() {});
    if (err) return next(err);
    var readStream = fs.createReadStream(outName);
    readStream.on("end", function() {
      fs.unlink(outName, function() {});
    });
    next(null, readStream);
  }
}

function saveImageInfo(data, next) {
  var id = data.upload.image.hash;
  var html =
    "<!doctype html>\n"+
    "<title>INSTAGHERM " + id + "</title>\n"+
    "<a href=\""+data.upload.links.imgur_page+"\">"+
    "<img src=\""+data.upload.links.original+"\">"+
    "</a>";
  var name = id + ".html";
  fs.writeFile("web/" + name, html, function(err) {
    if (err) return next(err);
    next(null, name);
  });
}
