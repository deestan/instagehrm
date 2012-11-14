var http = require("http");
var fs = require("fs");
var FormData = require("form-data");

module.exports.postImage = postImage;

var KEY = fs.readFileSync("imgur_anonymous_key");

function postImage(filename, callback) {
  var form = new FormData();
  form.append('key', KEY);
  form.append('image', fs.createReadStream(filename));
  form.submit("http://api.imgur.com/2/upload.json", function (err, res) {
    if (err) return callback(err);
    var data = [];
    res.on('data', function (dataChunk) {
      data.push(dataChunk);
    });
    res.on('end', function () {
      callback(null, JSON.parse(data.join("")));
    });
  });
}
