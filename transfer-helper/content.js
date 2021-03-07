chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    
    if (request.findSids == "didNumbers"){
        
        let regexp = /(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})|([\+][0-9]{1,3}([ \.\-])?)?([\(]{1}[0-9]{3}[\)])?([0-9A-Z \.\-]{1,32})/gm;
        let search = document.body.innerText;
        let matchedString = [...search.matchAll(regexp)];
        let array = matchedString.toString().split(',');
        let filteredArray = array.filter(word => word.length > 10);
        let numberString = [];
        let newString = [];

        for (var i = 0; i < filteredArray.length; i++) {
            if (/\S/.test(filteredArray[i])) {
                numberString.push($.trim(filteredArray[i]))
                }
            }

        for (var i = 0; i < numberString.length; i++) {
            newString.push("+" + numberString[i].replace(/[^0-9]/g, "").toString().split(',').join('\n'))
            }

        let removeDupes = [...new Set(newString)];    
        chrome.runtime.sendMessage({from: "did", did: removeDupes});

    } else if (request.findSids == "regSids"){
        
        let regexBu = /(?<=BU)[A-Za-z0-9]{32}/g;
        let regexAd = /(?<=AD)[A-Za-z0-9]{32}/g;
        let regexAc = /(?<=AC)[A-Za-z0-9]{32}/g;
        let regexZd = /(?<=Ticket\s#)[0-9]{7}/g;
        let search = document.body.innerText;
        let searchZd = document.body.innerHTML;
        let arrayBu = [];
        let removeDupesBu = [];
        let arrayAd = [];
        let removeDupesAd = [];
        let arrayAc = [];
        let removeDupesAc = [];
        let arrayZd = [];
        let removeDupesZd = [];

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
        const zd = function() {
            arrayZd = [...searchZd.matchAll(regexZd)];
            removeDupesZd = [...new Set(arrayZd)];
            let lastArrayZd = arrayZd.toString().split(',').join('\n');
            chrome.storage.local.set({'zd': lastArrayZd}, function() {
                console.log("zd storage " + lastArrayZd);
                });
        }
        const all = function() {
            let combinedArray = removeDupesBu.concat(removeDupesAd, removeDupesAc);
            chrome.runtime.sendMessage({from: "sid", sid: combinedArray});
        }

        bu()
        ad()
        ac()
        zd()
        all()
        
    } else if (request.findSids == "insert!") {
        chrome.storage.local.get(['did', 'from_ac', 'to_ac', 'ad', 'bu'],function(sid){
            
            document.getElementById("fromAccount").value = sid.from_ac;
            document.getElementById("toAccount").value = sid.to_ac;
            document.getElementById("bundleSid").value = sid.bu;
            document.getElementById("addressSid").value = sid.ad;
            document.getElementsByName("dids")[0].value = sid.did;
            
        });

    }
});
