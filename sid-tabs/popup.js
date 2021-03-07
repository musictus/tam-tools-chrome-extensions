$(function(){
    chrome.storage.local.get(['sid'],function(found){
        $('#sid_result').val(found.sid);
    });

    $('#grab_ca').click(function(){  
        clearCache();    
        chrome.tabs.query({active:true,currentWindow: true}, function(tabs){
           chrome.tabs.sendMessage(tabs[0].id, {findSids: "callSids"});
            });
        });

    $('#grab_sm').click(function(){
        clearCache();      
        chrome.tabs.query({active:true,currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {findSids: "msgSids"});
            });
        });

    $('#grab_reg').click(function(){  
        clearCache();    
        chrome.tabs.query({active:true,currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {findSids: "regSids"});
            });
        });

    $('#copy1').click(function(){
            $('#sid_result').select();
            document.execCommand('copy');
        });
    
    let sidResult = [];
    let savedSidResult = "";
    let saved = false;

    $('#open_tab').click(function(){
        if (saved === true) {
            let textAreaValue = $('#sid_result').val().split(/\n/);
            for (var i=0; i < textAreaValue.length; i++) {
                if (/\S/.test(textAreaValue[i])) {
                    sidResult.push($.trim(textAreaValue[i]));
                    chrome.tabs.create({
                        url:"https://monkey.twilio.com/search?q=" + sidResult[i],
                        selected: false  // We open the tab in the background
                        })
                    }
                }
            } else {
                for (var i = 0; i < sidResult.length; i++) {
                    chrome.tabs.create({
                        url:"https://monkey.twilio.com/search?q=" + sidResult[i],
                        selected: false  // We open the tab in the background
                        })
                    }
                }
        });
    
    $('#save').click(function(){  
        save();    
        });
    
    $('#clear').click(function(){  
        clearCache()
        });
    
    $('#ca_kibana').click(function(){
        if (saved === true) {
            let textAreaValue = $('#sid_result').val().split(/\n/);
            for (var i=0; i < textAreaValue.length; i++) {
                if (/\S/.test(textAreaValue[i])) {
                    sidResult.push($.trim(textAreaValue[i]));
                    chrome.tabs.create({
                        url:"https://voice-insights6.us1.eak.twilio.com/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-30d,to:now))&_a=(columns:!(_source),index:e6754050-0a40-11ea-98d5-23817bb73bfe,interval:auto,query:(language:kuery,query:" + sidResult[i] + "),sort:!('@timestamp',desc))",
                        selected:false  // We open the tab in the background
                        })
                    }
                }
            } else {
                for (var i = 0; i < sidResult.length; i++) {
                    chrome.tabs.create({
                        url:"https://voice-insights6.us1.eak.twilio.com/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-30d,to:now))&_a=(columns:!(_source),index:e6754050-0a40-11ea-98d5-23817bb73bfe,interval:auto,query:(language:kuery,query:" + sidResult[i] + "),sort:!('@timestamp',desc))",
                        selected:false  // We open the tab in the background
                        })
                    }
                }
        });
    
        
    $('#sm_kibana').click(function(){
        if (saved === true) {
            let textAreaValue = $('#sid_result').val().split(/\n/);
            for (var i=0; i < textAreaValue.length; i++) {
                if (/\S/.test(textAreaValue[i])) {
                    sidResult.push($.trim(textAreaValue[i]));
                    chrome.tabs.create({
                        url:"https://messaging-es.us1.twilio.com/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-30d,mode:quick,to:now))&_a=(columns:!(_source),index:e47f5980-47a4-11e8-b508-037649b93398,interval:auto,query:(language:lucene,query:" + sidResult[i] + "),sort:!(timestamp,desc))",
                        selected:false  // We open the tab in the background
                        })
                    }
                }
            } else {
                for (var i = 0; i < sidResult.length; i++) {
                    chrome.tabs.create({
                        url:"https://messaging-es.us1.twilio.com/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-30d,mode:quick,to:now))&_a=(columns:!(_source),index:e47f5980-47a4-11e8-b508-037649b93398,interval:auto,query:(language:lucene,query:" + sidResult[i] + "),sort:!(timestamp,desc))",
                        selected:false  // We open the tab in the background
                        })
                    }
                }
        });

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
        if (request.finally == "the sids!"){
            chrome.storage.local.get(['key'], function(result) {
                for (var key in result) {
                    var obj = result[key]
                    }
                sidResult = obj
                let lastResult = obj.toString().split(',').join('\n')
                    if (obj.length === 0) {
                        $('#how_many').append( $('<span>').text("found " + obj.length + " SIDs"));
                        } else {
                            $('#sid_result').val(lastResult);
                            chrome.storage.local.set({'sid': lastResult}, function() {
                                console.log("saved sids " + lastResult);
                              });
                            $('#how_many').append($('<span id="temp">').text("found " + obj.length + " total SIDs"));
                            console.log(obj.length);
                            }
                });
            }
        });

        const save = function() {
            saved = true;
            savedSidResult = $('#sid_result').val();
            console.log("saveddddd " + savedSidResult);
            chrome.storage.local.set({'sid': savedSidResult}, function() {
                console.log("saved sid " + savedSidResult);
                });
            }

        const clearCache = function() {
            saved = false;
            chrome.storage.local.clear(function() {
                var error = chrome.runtime.lastError;
                if (error) {
                    console.error(error);
                    }
                    $('#temp').remove();
                    $('#how_many').empty();
                    $('#sid_result').val("").empty();
                });
            }

})

// regex to grab sids
// (?<=CA)[A-Za-z0-9]{32}
// (?<=SM)[A-Za-z0-9]{32}