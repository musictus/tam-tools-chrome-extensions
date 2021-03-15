chrome.runtime.onMessage.addListener((request, sender, sendResponse)=> {
    
    if (request.findSids == "didNumbers"){
        
        let regexp = /[ ]([\+][0-9]{1,3}([ \.\-])?)?([\(]{1}[0-9]{3}[\)])?([0-9 \.\-]{1,12})|^(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})|[0-9]{3}[- ().]*[0-9]{3}[- ().][0-9]{4}|[+1]*[0-9]{10}/gm;
        let search = document.body.innerText;
        let matchedString = [...search.matchAll(regexp)];
        let array = matchedString.toString().split(',').filter(word => word.length > 10);
        let numberString = [];
        let newString = [];

            for (let i = 0; i < array.length; i++) {
                if (/\S/.test(array[i])) {
                    numberString.push($.trim(array[i]))
                    }
                }
            for (let i = 0; i < numberString.length; i++) {
                newString.push("+" + numberString[i].replace(/[^0-9]/g, "").toString().split(',').join('\n'))
                }
        
        let filteredNewString = newString.filter(word => word.length > 10)
        let removeDupes = [...new Set(filteredNewString)];    
        chrome.runtime.sendMessage({from: "did", did: removeDupes});

    } else if (request.findSids == "regSids"){
        
        let regexBu = /(?<=BU)[A-Za-z0-9]{32}/g;
        let regexAd = /(?<=AD)[A-Za-z0-9]{32}/g;
        let regexAc = /(?<=AC)[A-Za-z0-9]{32}/g;
        // regexFromAc and regexToAc only works under https://calendar.google.com/*
        let regexFromAc = /(?<=:From:AC)[A-Za-z0-9]{32}/g;
        let regexToAc = /(?<=:To:AC)[A-Za-z0-9]{32}/g;
        let regexZd = /(?<=Ticket\s#)[0-9]{7}/g;
        let regexZdForCal = /(?<=https:\/\/twilio\.zendesk\.com\/agent\/tickets\/)[0-9]{7}/g;
        let search = document.body.innerText;
        let searchZd = document.body.innerHTML;
        let arrayBu = [];
        let removeDupesBu = [];
        let arrayAd = [];
        let removeDupesAd = [];
        let arrayAc = [];
        let removeDupesAc = [];
        let arrayFromAc = [];
        let removeDupesFromAc = [];
        let arrayToAc = [];
        let removeDupesToAc = [];
        let arrayZd = [];
        let removeDupesZd = [];
        let arrayZdForCal = [];
        let removeDupesZdForCal = [];

        const bu = ()=> {
            arrayBu = [...search.matchAll(regexBu)];
            let newArrayBu = arrayBu.map(i => 'BU' + i);
            removeDupesBu = [...new Set(newArrayBu)];
            }
        const ad = ()=> {
            arrayAd = [...search.matchAll(regexAd)];
            let newArrayAd = arrayAd.map(i => 'AD' + i);
            removeDupesAd = [...new Set(newArrayAd)];
            }     
        const ac = ()=> {
            arrayAc = [...search.matchAll(regexAc)];
            let newArrayAc = arrayAc.map(i => 'AC' + i);
            removeDupesAc = [...new Set(newArrayAc)];
            }
        const fromAc = ()=> {
            arrayFromAc = [...search.matchAll(regexFromAc)];
            let newArrayFromAc = arrayFromAc.map(i => 'AC' + i);
            removeDupesFromAc = [...new Set(newArrayFromAc)];
            let lastFromAc = removeDupesFromAc.toString().split(',').join('\n');
            chrome.storage.local.set({'from_ac': lastFromAc}, function() {
                console.log("from_ac storage " + lastFromAc);
                });
            }
        const toAc = ()=> {
            arrayToAc = [...search.matchAll(regexToAc)];
            let newArrayToAc = arrayToAc.map(i => 'AC' + i);
            removeDupesToAc = [...new Set(newArrayToAc)];
            let lastToAc = removeDupesToAc.toString().split(',').join('\n');
            chrome.storage.local.set({'to_ac': lastToAc}, function() {
                console.log("to_ac storage " + lastToAc);
                });
            }
        const zd = ()=> {
            arrayZd = [...searchZd.matchAll(regexZd)];
            removeDupesZd = [...new Set(arrayZd)];
            let lastArrayZd = arrayZd.toString().split(',').join('\n');
            chrome.storage.local.set({'zd': lastArrayZd}, function() {
                console.log("zd storage " + lastArrayZd);
                });
            }
        const zdForCal = ()=> {
            arrayZdForCal = [...search.matchAll(regexZdForCal)];
            removeDupesZdForCal = [...new Set(arrayZdForCal)];
            let lastArrayZd = arrayZdForCal.toString().split(',').join('\n');
            chrome.storage.local.set({'zd': lastArrayZd}, function() {
                console.log("zd storage " + lastArrayZd);
                });
            }
        const all = ()=> {
            let combinedArray = removeDupesBu.concat(removeDupesAd, removeDupesAc);
            chrome.runtime.sendMessage({from: "sid", sid: combinedArray});
            }
        const allWithFromTo = ()=> {
            let combinedArray = removeDupesBu.concat(removeDupesAd, removeDupesFromAc, removeDupesToAc);
            chrome.runtime.sendMessage({from: "sidWithFromTo", sid: combinedArray});
            }

        chrome.storage.local.get(['calendar'],(is)=> {
            if (is.calendar === true){
                // this means you're under https://calendar.google.com/*
                bu()
                ad()
                fromAc()
                toAc()
                zdForCal()
                allWithFromTo()
                } else {
                    bu()
                    ad()
                    ac()
                    zd()
                    all()
                }
            });

    } else if (request.findSids == "insert!") {
        chrome.storage.local.get(['did', 'from_ac', 'to_ac', 'ad', 'bu'],(sid)=> {
            
            document.getElementById("fromAccount").value = sid.from_ac;
            document.getElementById("toAccount").value = sid.to_ac;
            document.getElementById("bundleSid").value = sid.bu;
            document.getElementById("addressSid").value = sid.ad;
            document.getElementsByName("dids")[0].value = sid.did;
        });
    }
});
