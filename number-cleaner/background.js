console.log("background running");

chrome.runtime.onMessage.addListener((response, sender, sendResponse)=>{
  if (response.from == "did") {
    let array = response.did
    console.log(array);
    chrome.storage.local.set({key: array}, ()=>{
        console.log(array);
        chrome.runtime.sendMessage({finally: "the dids!"});
      });
  }
});