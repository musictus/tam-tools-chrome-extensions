$(function(){
    chrome.storage.local.get(['did'],function(found){
        $('#number_input').val(found.did);
    });

    $('#grab_did').click(function(){  
        clearCache();    
        chrome.tabs.query({active:true,currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {findSids: "didNumbers"});
            });
        });

    $('#cleanit').click(function() {
        
        let init_numbers = $('#number_input').val();
        let each_lines = init_numbers.split(/\n/);
        let numberString = [];
        let newString = [];

        for (var i=0; i < each_lines.length; i++) {
            if (/\S/.test(each_lines[i])) {
                numberString.push($.trim(each_lines[i]))
                }
            }
            for (var i = 0; i < numberString.length; i++) {
                newString.push("+" + numberString[i].replace(/[^0-9]/g, ""))
                }
                    $('#number_input').val(newString.toString().split(',').join('\n'));
        })
    
    $('#add_prefix').click(function() {

        let init_numbers = $('#number_input').val();
        let added_prefix = $('#prefix_input').val();
        let each_lines = init_numbers.split(/\n/);
        let numberString = [];
        let newString = [];

        for (var i=0; i < each_lines.length; i++) {
            if (/\S/.test(each_lines[i])) {
                numberString.push($.trim(each_lines[i]))
                }
            }
            for (var i = 0; i < numberString.length; i++) {
                newString.push("+" + added_prefix + numberString[i].replace(/[^0-9]/g, ""))
                }
                    $('#number_input').val(newString.toString().split(',').join('\n'));
        })
    
    $('#copy1').click(function(){
        $('#number_input').select();
        document.execCommand('copy');
        });

    $('#save').click(function(){  
        save();    
        });
    
    $('#clear').click(function(){  
        clearCache()
        });

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
        if (request.finally == "the dids!"){
            chrome.storage.local.get(['key'], function(result) {
                for (var key in result) {
                    var obj = result[key]
                    }
                sidResult = obj
                let lastResult = obj.toString().split(',').join('\n')
                    if (obj.length === 0) {
                        $('#how_many').append( $('<span>').text("found " + obj.length + " DIDs"));
                        } else {
                            $('#number_input').val(lastResult);
                            chrome.storage.local.set({'did': lastResult}, function() {
                                console.log("saved did " + lastResult);
                              });
                            $('#how_many').append($('<span id="temp">').text("found " + obj.length + " total DIDs"));
                            console.log(obj.length);
                            }
                });
            }
        });

    const save = function() {
        let savedDid = $('#number_input').val();
        chrome.storage.local.set({'did': savedDid}, function() {
            console.log("saved did " + savedDid);
            });
        }

    const clearCache = function() {
        chrome.storage.local.clear(function() {
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
