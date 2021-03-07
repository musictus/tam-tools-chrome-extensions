chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    
    if (request.findSids == "didNumbers"){
        
        let regexp = /(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})|^([\+][0-9]{1,3}([ \.\-])?)?([\(]{1}[0-9]{3}[\)])?([0-9A-Z \.\-]{1,32})$/gm;
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


    }
});