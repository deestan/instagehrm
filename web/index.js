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

$(function() {
  $("form")
    .attr("action", "1/upload.json")
    .ajaxForm({
      beforeSend: uploadStarting,
      error: uploadError,
      success: uploadSuccess
    });

  $("#uploadstatus .close").on("click", hideUploadStatus);
});
