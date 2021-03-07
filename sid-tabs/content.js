chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (request.findSids == "callSids"){
        
        let regexp = /(?<=CA)[A-Za-z0-9]{32}/g;
        let search = document.body.innerText;
        let array = [...search.matchAll(regexp)];
        let newArray = array.map(i => 'CA' + i);
        let removeDupes = [...new Set(newArray)];
        chrome.runtime.sendMessage(removeDupes);

    } else if (request.findSids == "msgSids"){
        
            let regexp = /(?<=SM)[A-Za-z0-9]{32}/g;
            let search = document.body.innerText;
            let array = [...search.matchAll(regexp)];
            let newArray = array.map(i => 'SM' + i);
            let removeDupes = [...new Set(newArray)];   
         
            chrome.runtime.sendMessage(removeDupes);

        } else if (request.findSids == "regSids"){
            
            let regexBu = /(?<=BU)[A-Za-z0-9]{32}/g;
            let regexAd = /(?<=AD)[A-Za-z0-9]{32}/g;
            let regexAc = /(?<=AC)[A-Za-z0-9]{32}/g;
            let search = document.body.innerText;
            let arrayBu = [];
            let removeDupesBu = [];
            let arrayAd = [];
            let removeDupesAd = [];
            let arrayAc = [];
            let removeDupesAc = [];

            const bu = function() {
                arrayBu = [...search.matchAll(regexBu)];
                let newArrayBu = arrayBu.map(i => 'BU' + i);
                removeDupesBu = [...new Set(newArrayBu)];
            }
            const ad = function() {
                arrayAd = [...search.matchAll(regexAd)];
                let newArrayAd = arrayAd.map(i => 'AD' + i);
                removeDupesAd = [...new Set(newArrayAd)];
            }     
            const ac = function() {
                arrayAc = [...search.matchAll(regexAc)];
                let newArrayAc = arrayAc.map(i => 'AC' + i);
                removeDupesAc = [...new Set(newArrayAc)];
            }
            const all = function() {
                let combinedArray = removeDupesBu.concat(removeDupesAd, removeDupesAc);
                chrome.runtime.sendMessage(combinedArray);
            }

            bu()
            ad()
            ac()
            all()
    }
});
