$(()=> {
    chrome.storage.local.get(['did'], (found)=> {
        $('#number_input').val(found.did);
    });

    $('#grab_did').click(()=> {  
        clearCache();    
        chrome.tabs.query({active:true,currentWindow: true}, (tabs)=> {
            chrome.tabs.sendMessage(tabs[0].id, {findSids: "didNumbers"});
            });
        });

    $('#cleanit').click(()=> {
        
        let init_numbers = $('#number_input').val();
        let each_lines = init_numbers.split(/\n/);
        let numberString = [];
        let newString = [];

        for (let i = 0; i < each_lines.length; i++) {
            if (/\S/.test(each_lines[i])) {
                numberString.push($.trim(each_lines[i]))
                }
            }
            for (let i = 0; i < numberString.length; i++) {
                newString.push("+" + numberString[i].replace(/[^0-9]/g, ""))
                }
                    $('#number_input').val(newString.toString().split(',').join('\n'));
        })
    
    $('#add_prefix').click(()=> {

        let init_numbers = $('#number_input').val();
        let added_prefix = $('#prefix_input').val();
        let each_lines = init_numbers.split(/\n/);
        let numberString = [];
        let newString = [];

        for (let i = 0; i < each_lines.length; i++) {
            if (/\S/.test(each_lines[i])) {
                numberString.push($.trim(each_lines[i]))
                }
            }
            for (let i = 0; i < numberString.length; i++) {
                newString.push("+" + added_prefix + numberString[i].replace(/[^0-9]/g, ""))
                }
                    $('#number_input').val(newString.toString().split(',').join('\n'));
        })
    
    $('#open_tab').click(()=> {
        let textAreaValue = $('#number_input').val();
        chrome.storage.local.set({'did': textAreaValue}, ()=>{ console.log("saved whilte opening Tab! " + textAreaValue)});  
        let didForUrl = textAreaValue.replace(/[+]/g, '%2B');
        let valueToArr = didForUrl.split(/\n/)  
        let didResult = [];
                
                for (let i = 0; i < valueToArr.length; i++) {
                    if (/\S/.test(valueToArr[i])) {
                        didResult.push($.trim(valueToArr[i]));
                        chrome.tabs.create({
                            url:"https://monkey.twilio.com/search?q=" + didResult[i],
                            selected: false  // We open the tab in the background
                            })
                        }
                    }
        });
    
    $('#copy1').click(()=> {
        $('#number_input').select();
        document.execCommand('copy');
        });

    $('#save').click(()=> {  
        save();    
        });
    
    $('#clear').click(()=> {  
        clearCache()
        });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse)=> {
        if (request.finally == "the dids!"){
            chrome.storage.local.get(['key'], (result)=>{
                for (var key in result) {
                    var obj = result[key]
                    }
                sidResult = obj
                let lastResult = obj.toString().split(',').join('\n')
                    if (obj.length === 0) {
                        $('#how_many').append( $('<span>').text("found " + obj.length + " DIDs"));
                        } else {
                            $('#number_input').val(lastResult);
                            chrome.storage.local.set({'did': lastResult}, ()=> {
                                console.log("saved did " + lastResult);
                              });
                            $('#how_many').append($('<span id="temp">').text("found " + obj.length + " total DIDs"));
                            console.log(obj.length);
                            }
                });
            }
        });

    const save = ()=> {
        let savedDid = $('#number_input').val();
        chrome.storage.local.set({'did': savedDid}, ()=> {
            console.log("saved did " + savedDid);
            });
        }

    const clearCache = ()=> {
        chrome.storage.local.clear(()=> {
            var error = chrome.runtime.lastError;
            if (error) {
                console.error(error);
                }
                $('#temp').remove();
                $('#how_many').empty();
                $('#number_input').val("").empty();
            });
        }

})
