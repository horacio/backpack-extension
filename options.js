function save() {
  var webtaskURL = document.getElementById("webtask_url").value;

  chrome.storage.sync.set({
    webtaskURL: webtaskURL,
  }, function() {
    var status = document.getElementById("status");

    status.textContent = "Options saved.";

    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restore() {
  chrome.storage.sync.get({
    webtaskURL: "Put your Webtask service URL here...",
  }, function(items) {
    document.getElementById("webtask_url").value = items.webtaskURL;
  });
}

document.addEventListener("DOMContentLoaded", restore);
document.getElementById("save").addEventListener("click", save);
