var http = require("http");
var fs = require("fs");
var FormData = require("form-data");

module.exports.postImage = postImage;

var KEY = fs.readFileSync("imgur_api_key");

function postImage(fileStream, callback) {
  var form = new FormData();
  form.append('key', KEY);
  form.append('image', fileStream);
  form.submit("http://api.imgur.com/2/upload.json", function (err, res) {
    if (err) return callback(err);
    var data = [];
    res.on('data', function (dataChunk) {
      data.push(dataChunk);
    });
    res.on('end', function () {
      var body = data.join("");
      if (res.statusCode != 200) {
        return callback((res.statusCode + " " + body) || "unknown");
      }
      callback(null, JSON.parse(body));
    });
  });
}
