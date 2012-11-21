var fs = require("fs");

module.exports.regenAll = regenAll;
module.exports.generatePage = generatePage;

function generatePage(data) {
  var id = data.upload.image.hash;
  var orientation = "landscape";
  if (parseInt(data.upload.image.width, 10) <
      parseInt(data.upload.image.height, 10)) {
    orientation = "portrait";
  }
  var html = "<!doctype html>\n"+
    "<link rel=stylesheet type=text/css href=main.css></link>\n"+
    "<link rel=stylesheet type=text/css href=image.css></link>\n"+
    "<script src=jquery-1.7.2.min.js></script>\n"+
    "<script>var image_id='" + id + "';</script>\n"+
    "<script src=image.js></script>\n"+
    "<title>" + id + " : instagehrm</title>\n"+
    // facecode
    '<div id="fb-root"></div>'+
    '<script>(function(d, s, id) {'+
    'var js, fjs = d.getElementsByTagName(s)[0];'+
    'if (d.getElementById(id)) return;'+
    'js = d.createElement(s); js.id = id;'+
    'js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";'+
    'fjs.parentNode.insertBefore(js, fjs);'+
    "}(document, 'script', 'facebook-jssdk'));</script>"+
    // body
    "<div class=titlebar>"+
    " <a class=home href=/>&lt;&lt;</a>"+
    " <div class=title>INSTAGEHRMED : " + id + "</div>"+
    "</div>"+
    "<a href=\""+data.upload.links.imgur_page+"\">"+
    " <img class="+ orientation +" src=\""+data.upload.links.original+"\">"+
    "</a>"+
    "<div class=img-footer>"+
    "<div>"+
    "click image to go to its <a href=http://www.imgur.com>imgur</a> page"+
    "</div>"+
    "<div><a id=deletelink href=#>Delete from imgur</a></div>"+
    "</div>"+
    "<div id=shares>"+
    "<span>twat this picture on face+</span>"+
    // twat
    '<div id=twat>'+
    '<a href="https://twitter.com/share" class="twitter-share-button" data-text="i took a pitcure&quot;!" data-size="large" data-count="none" data-hashtags="instagehrm" data-dnt="true">Tweet</a>'+
    '</div>'+
    // g+
    '<div id=goggle><div class="g-plusone" data-annotation="none"></div></div>'+
    // shareface
    '<div id=face>'+
    '<div class="fb-like" data-send="false" data-layout="button_count" data-width="450" data-show-faces="false" data-action="recommend"></div>'+
    '</div>'+
    // end shares
    '</div>'+
    // twatcode
    '<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>'+
    // g+ code
    '<script type="text/javascript">'+
    "(function() {"+
    "var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;"+
    "po.src = 'https://apis.google.com/js/plusone.js';"+
    "var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);"+
    "})();"+
    '</script>';
  return html;
}

function regenAll(dataDir, webDir) {
  var dataz = fs.readdirSync(dataDir);
  for (var i = 0; i < dataz.length; i++) {
    var f = dataz[i];
    if (!(/\.json$/.test(f)))
      continue;
    data = JSON.parse(fs.readFileSync(dataDir + "/" + f));
    var html = generatePage(data);
    fs.writeFile(webDir + "/" + data.upload.image.hash + ".html",
                 html,
                 function(whatever) { });
  }
}
