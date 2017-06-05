function saveHighlight(info, tab) {
  var url = tab.url,
      title = tab.title,
      selectionText = info.selectionText;

  if (selectionText === "" || selectionText === null) return;

  var highlight = {
    url: url,
    title: title,
    text: selectionText,
    created_at: getCurrentDate()
  };

  save(highlight);
}

function save(data) {
  chrome.storage.sync.get("webtaskURL", function(items) {
    var url = items.webtaskURL,
        serializedData = JSON.stringify(data),
        request = new XMLHttpRequest();

    request.open("POST", url, true);
    request.setRequestHeader("Content-type", "application/json");

    request.onload = function() {
      if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
        notify("success", "Alrighty!", "Highlight saved successfully.");
      }
    };

    request.onerror = function() {
      if (!url) {
        notify("error", "Don't panic.", "Please configure Backpack before using it.");
      } else {
        notify("error", "Oopsie.", "Something went horribly wrong. Try again?");
      }
    };

    request.send(serializedData);
  });
}

// Utility functions.

function getCurrentDate() {
  var date = new Date();

  var day = date.getDate(),
      month = date.getMonth() + 1,
      year = date.getFullYear();

  if (day < 10) day = "0" + day;
  if (month < 10) month = "0" + month;

  return [year, month, day].join("-")
}

function notify(action, title, message) {
  chrome.notifications.create(action, {
    type: "basic",
    iconUrl: "icon-16.png",
    title: title,
    message: message
  }, function(notificationId) {});
}

// Setup.

chrome.runtime.onInstalled.addListener(function(object) {
  if (object.reason == "install") {
    chrome.tabs.create({ url: "install.html" }, function(tab) {
      console.log("Thanks for installing Backpack! Please, take a look at our README.");
    });
  }
});

chrome.contextMenus.create({
  id: "saveHighlight",
  title: "Save highlight to Backpack",
  contexts: ["selection"]
});

chrome.contextMenus.onClicked.addListener(saveHighlight);
