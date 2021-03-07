console.log("background running");

chrome.runtime.onMessage.addListener(function(response, sender, sendResponse){
  if (response.from == "did") {
    var array = response.did
    console.log(array);
    chrome.storage.local.set({key: array}, function() {
        console.log(array);
        chrome.runtime.sendMessage({finally: "the dids!"});
      });
  }
});