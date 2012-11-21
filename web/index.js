function uploadSuccess(data) {
  localStorage[data.id] = data.deletehash;
  window.location.href = data.url;
}

function uploadStarting() {
  $("#uploadstatus .messageplate").hide();
  $("#uploadstatus .message").html("Uploading...");
  $("#uploadstatus").show();
  $("#uploadstatus .messageplate").slideDown("fast");
}

function hideUploadStatus() {
  $("#uploadstatus").hide();
}

function uploadError(x) {
  var msg = "We're overloaded! Please try again later.";
  try {
    msg = JSON.parse(x.responseText);
  } catch(_) { /* don't care */ }
  $("#uploadstatus .message").html(msg);
  $("#uploadstatus .close").show();
}

function fillUploadedList() {
  var list = $("#uploads");
  for (var i = 0; i < localStorage.length; i++) {
    var id = localStorage.key(i);
    $("<a href="+id+".html><img src=http://i.imgur.com/"+id+"s.jpg></a>")
      .appendTo(list);
  }
}

$(function() {
  $("form")
    .attr("action", "1/upload.json")
    .ajaxForm({
      beforeSend: uploadStarting,
      error: uploadError,
      success: uploadSuccess
    });

  $("#uploadstatus .close").on("click", hideUploadStatus);

  fillUploadedList();
});
