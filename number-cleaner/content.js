chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
    
    if (request.findSids == "didNumbers"){
        
        const regexp = /[ ]([\+][0-9]{1,3}([ \.\-])?)?([\(]{1}[0-9]{3}[\)])?([0-9 \.\-]{1,12})|^(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})|[0-9]{3}[- ().]*[0-9]{3}[- ().][0-9]{4}|[ ][+1]*[0-9]{10}/gm;
        const search = document.body.innerText;
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

    }
});