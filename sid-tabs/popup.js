$(()=>{

    let sidResult = [];
    let savedSidResult = '';
    let saved = false;
    let requestType = '';

    // get data from storage on initial load
    chrome.storage.local.get(['sid', 'type'], (found)=>{
        $('#sid_result').val(found.sid);
        found.type = requestType;
    });

    // grab related clicks
    $('#grab_ca').click(()=>{
        clearCache();    
        chrome.tabs.query({active:true,currentWindow: true}, (tabs)=>{
           chrome.tabs.sendMessage(tabs[0].id, {findSids: "callSids"});
            });
        // save request type
        requestType = 'CA';
        chrome.storage.local.set({'type': requestType}, ()=>{     
            console.log("saved request type " + requestType)
            });
        });

    $('#grab_sm').click(()=>{
        clearCache();      
        chrome.tabs.query({active:true,currentWindow: true}, (tabs)=>{
        chrome.tabs.sendMessage(tabs[0].id, {findSids: "msgSids"});
            });
        // save request type
        requestType = 'SM';
        chrome.storage.local.set({'type': requestType}, ()=> {     
            console.log("saved request type " + requestType)
            });
        });

    $('#grab_reg').click(()=>{  
        clearCache();    
        chrome.tabs.query({active:true,currentWindow: true}, (tabs)=>{
        chrome.tabs.sendMessage(tabs[0].id, {findSids: "regSids"});
            });
        // save request type
        requestType = '';
        chrome.storage.local.set({'type': requestType}, ()=> {     
            console.log("saved request type " + requestType)
            });
        });

    $('#copy1').click(()=>{
            $('#sid_result').select();
            document.execCommand('copy');
        });

    $('#open_tab').click(()=>{
            let textAreaValue = $('#sid_result').val();
            let valueToArr = textAreaValue.split(/\n/)
            chrome.storage.local.set({'sid': textAreaValue}, ()=>{ console.log("saved whilte opening Tab! " + textAreaValue)});     
                    
                    for (let i = 0; i < valueToArr.length; i++) {
                        if (/\S/.test(valueToArr[i])) {
                            sidResult.push($.trim(valueToArr[i]));
                            chrome.tabs.create({
                                url:"https://monkey.twilio.com/search?q=" + sidResult[i],
                                selected: false  // We open the tab in the background
                                })
                            }
                        }
        });
    
    $('#save').click(()=>{  
        save();    
        });
    
    $('#clear').click(()=>{  
        clearCache()
        });
    
    $('#kibana').click(()=>{
        let textAreaValue = $('#sid_result').val();
        let valueToArr = textAreaValue.split(/\n/)
        chrome.storage.local.set({'sid': textAreaValue}, ()=>{ console.log("saved while opening Kibana! " + textAreaValue)});

        chrome.storage.local.get(['type'], (found)=>{
            if (found.type === 'CA') {
                for (let i = 0; i < valueToArr.length; i++) {
                    if (/\S/.test(valueToArr[i])) {
                        sidResult.push($.trim(valueToArr[i]));
                        chrome.tabs.create({
                            url:"https://voice-insights6.us1.eak.twilio.com/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-30d,to:now))&_a=(columns:!(_source),index:e6754050-0a40-11ea-98d5-23817bb73bfe,interval:auto,query:(language:kuery,query:" + sidResult[i] + "),sort:!('@timestamp',desc))",
                            selected: false
                            })
                        }
                    }
            } else if (found.type === 'SM') {
                for (let i = 0; i < valueToArr.length; i++) {
                    if (/\S/.test(valueToArr[i])) {
                        sidResult.push($.trim(valueToArr[i]));
                        chrome.tabs.create({
                            url:"https://messaging-es.us1.twilio.com/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-30d,mode:quick,to:now))&_a=(columns:!(_source),index:e47f5980-47a4-11e8-b508-037649b93398,interval:auto,query:(language:lucene,query:" + sidResult[i] + "),sort:!(timestamp,desc))",
                            selected: false 
                            })
                        }
                    }
                }
            })
        });
    
    $('#open_cops').click(()=>{
        chrome.storage.local.get(['type'],(found)=>{
            if (found.type === 'CA') {
                chrome.tabs.create({
                    url:"https://monkey.twilio.com/cops-dashboard/#/voice/query-sids",
                    selected: false
                    })
                } else if (found.type === 'SM'){                
                        chrome.tabs.create({
                            url:"https://monkey.twilio.com/cops-dashboard/#/messaging/query-sids",
                            selected: false
                            })
                    } else {
                        clearHowMany();
                        $('#how_many').append($('<span id="temp">').text("❗️ Grab CA or SM"));
                        }
            })
        });

        $('#insert').click(()=>{  
            chrome.storage.local.get(['type'], (found)=>{
                if (found.type === 'CA') {
                    console.log("CA working on pop!");
                    chrome.tabs.query({active:true,currentWindow: true}, (tabs)=>{
                        chrome.tabs.sendMessage(tabs[0].id, {findSids: "insert_CA"});
                        });
                } else if (found.type === 'SM') {
                        console.log("SM working on pop!")
                        chrome.tabs.query({active:true,currentWindow: true}, (tabs)=>{
                            chrome.tabs.sendMessage(tabs[0].id, {findSids: "insert_SM"});
                            });
                        }
                    })
            });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
        if (request.finally == "the sids!"){
            chrome.storage.local.get(['key'], (result)=>{
                for (let key in result) {
                    var obj = result[key]
                    }
                sidResult = obj
                let lastResult = obj.toString().split(',').join('\n')
                    if (obj.length === 0) {
                        $('#how_many').append( $('<span>').text("found " + obj.length + " SIDs"));
                        } else {
                            $('#sid_result').val(lastResult);
                            chrome.storage.local.set({'sid': lastResult}, ()=>{
                                console.log("saved sids " + lastResult);
                              });
                            $('#how_many').append($('<span id="temp">').text("found " + obj.length + " total SIDs"));
                            console.log(obj.length);
                            }
                });
            }
        });

        const save = ()=>{
            saved = true;
            savedSidResult = $('#sid_result').val();
            chrome.storage.local.set({'sid': savedSidResult}, ()=>{
                console.log("saved sid " + savedSidResult);
                });
            chrome.storage.local.set({'type': requestType}, ()=>{     
                console.log("saved request type " + requestType)
                });
            }

        const clearCache = ()=>{
            saved = false;
            requestType = '';
            chrome.storage.local.clear(()=>{
                let error = chrome.runtime.lastError;
                if (error) {
                    console.error(error);
                    }
                    $('#temp').remove();
                    $('#how_many').empty();
                    $('#sid_result').val("").empty();
                });
            };

        const clearHowMany = ()=>{
            $('#temp').remove();
            $('#how_many').empty();
            };

});