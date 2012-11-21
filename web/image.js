$(function () {
  var deleteHash = localStorage[image_id];
  if (deleteHash) {
    $("#deletelink")
      .attr("href", "http://imgur.com/delete/" + deleteHash)
      .css("visibility", "visible");
  }
});
