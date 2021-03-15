console.log("background running");

chrome.runtime.onMessage.addListener((response, sender, sendResponse)=>{

    let array = response
    console.log(array);
    chrome.storage.local.set({key: array}, ()=>{
        console.log(array);
        chrome.runtime.sendMessage({finally: "the sids!"});
      });

});