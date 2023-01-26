$(document).ready(function () {
  $("form").on("submit", form_submit)
})

function form_submit(e) {
  form = e.target
  $(form).find("input[type=submit]").val("Uploading...").prop("disabled", true)

  e.preventDefault()

  $.ajax({
    url: form.action,
    method: "POST",
    // The form data to be sent with the request
    data: new FormData(form),
    // Allows browser to set Content-Type header itself including the boundary
    // Ex: multipart/form-data; boundary=----WebKitFormBoundaryfAcnUBSPYeXwpwxq
    contentType: false,
    // Don't process data. Just use the FormData we provided
    processData: false,
    // Setup progress event handler. See https://stackoverflow.com/a/8758614/935514
    xhr: function () {
      var xhr = new window.XMLHttpRequest();
      xhr.upload.addEventListener("progress", handleProgress, false);
      return xhr;
    },
    error: handleError,
    success: handleSuccess
  });

  function handleProgress(e) {
    $submit_button = $(form).find("input[type=submit]")
    if (e.lengthComputable) {
      progress = (e.loaded / e.total) * 100;
      $submit_button.val("Uploading (" + Math.round(progress) + "%) . . .")
    }
  }

  function handleError(e) {
    console.log(e)
    resetForm()
  }

  function handleSuccess(response) {
    $("#videos").append(response)
    resetForm()
  }

  function resetForm() {
    $(form).find("input[type=submit]").val("Upload").prop("disabled", false)
    form.reset()
  }
}
