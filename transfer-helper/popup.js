$(function(){

    chrome.storage.local.get(['did', 'from_ac', 'to_ac', 'ad', 'bu', 'zd'],function(sid){
        $('#number_input').val(sid.did);
        $('#from_result').val(sid.from_ac);
        $('#to_result').val(sid.to_ac);
        $('#bu_result').val(sid.bu);
        $('#ad_result').val(sid.ad);
        $('#zd_id').val(sid.zd);
    });

    $('#grab_did').click(function(){  
        clearCacheDid();    
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

    $('#grab_reg').click(function(){  
        clearCacheSid();    
        chrome.tabs.query({active:true,currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {findSids: "regSids"});
            });
        });

    $('#copy1').click(function(){
        $('#number_input').select();
            document.execCommand('copy');
        });
    
    $('#insert').click(function(){  
        chrome.tabs.query({active:true,currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {findSids: "insert!"});
            console.log("testing insert now")
            })
        });
    
    $('#gsheet').click(function(){  
        
        chrome.storage.local.get(['did', 'from_ac', 'to_ac', 'ad', 'bu', 'zd'],function(get){

            chrome.tabs.create({

                url:"https://docs.google.com/forms/d/e/1FAIpQLSc9A2PS9KewEqKlq0yOh-rI5eDCP6TU9pwWR4QE3h2Gf-3FdQ/viewform?usp=pp_url"
                + "&entry.1433373205=" + get.from_ac
                + "&entry.246019091=" + get.to_ac
                + "&entry.1834915644=" + get.bu
                + "&entry.1121789603=" + get.ad
                + "&entry.161182515=%2B16149831388%0A%2B16144125605%0A%2B16143503610"
                + "&entry.977706640=2021-03-05+20:00"
                + "&entry.271349283=https://twilio.zendesk.com/agent/tickets/" + get.zd,
                
                selected:false  // We open the tab in the background
                })
            });
        })
        
    $('#save').click(function(){  
        save();    
        });
    
    $('#clear').click(function(){  
        clearCacheDid()
        clearCacheSid()  
        });

    $('#open_transfer').click(function(){
            chrome.tabs.create({
                url:"https://monkey.twilio.com/did/tools/transfer-numbers-v2",
                selected:false  // We open the tab in the background
                })
        });

    // this is for #copy_open
    let sidResult = [];

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
    
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
        if (request.finally == "the sids!"){
            chrome.storage.local.get(['key'], function(result) {
                for (var key in result) {
                    var obj = result[key]
                    }
                    sidResult = obj
                    let arrayBu = obj.filter(value => /(?<=BU)[A-Za-z0-9]{32}/g.test(value));
                    let arrayAd = obj.filter(value => /(?<=AD)[A-Za-z0-9]{32}/g.test(value));
                    let arrayAc = obj.filter(value => /(?<=AC)[A-Za-z0-9]{32}/g.test(value));
                    // let arrayZd = obj.filter(value => /^[0-9]{7}$/g.test(value));
                    let lastArrayBu = arrayBu.toString().split(',').join('\n');
                    let lastArrayAd = arrayAd.toString().split(',').join('\n');
                    let lastArrayAc = arrayAc.toString().split(',').join('\n');
                    // let lastArrayZd = arrayZd.toString().split(',').join('\n');
                    
                    chrome.storage.local.set({'from_ac': lastArrayAc}, function() {
                        console.log("from ac storage " + lastArrayAc);
                      });
                    chrome.storage.local.set({'to_ac': lastArrayAc}, function() {
                        console.log("to ac storage " + lastArrayAc);
                      });
                    chrome.storage.local.set({'bu': lastArrayBu}, function() {
                        console.log("bu storage " + lastArrayBu);
                      });
                    chrome.storage.local.set({'ad': lastArrayAd}, function() {
                        console.log("ad storage " + lastArrayAd);
                      });
                    // chrome.storage.local.set({'zd': lastArrayZd}, function() {
                    // console.log("zd storage " + lastArrayZd);
                    // });
                    
                    if (obj.length === 0) {
                        $('#how_many').append( $('<span>').text("found " + obj.length + " DIDs"));
                        } else {
                            $('#from_result').val(lastArrayAc);
                            $('#to_result').val(lastArrayAc);
                            $('#bu_result').val(lastArrayBu);
                            $('#ad_result').val(lastArrayAd);
                            // $('#zd_id').val(lastArrayZd);
                            chrome.storage.local.get(['zd'],function(id){
                                $('#zd_id').val(id.zd);
                            });

                            $('#how_many').append($('<span id="temp">').text("found " + obj.length + " total SIDs"));
                            }
                });
            }
        });
        
        const save = function() {
            let savedDid = $('#number_input').val();
            let savedFromAc = $('#from_result').val();
            let savedToAc = $('#to_result').val();
            let savedBu = $('#bu_result').val();
            let savedAd = $('#ad_result').val();
            let savedZd = $('#zd_id').val();

            chrome.storage.local.set({'did': savedDid}, function() {
                console.log("saved did " + savedDid);
              });
            chrome.storage.local.set({'from_ac': savedFromAc}, function() {
                console.log("saved from ac " + savedFromAc);
              });
            chrome.storage.local.set({'to_ac': savedToAc}, function() {
                console.log("saved to ac " + savedToAc);
              });
            chrome.storage.local.set({'bu': savedBu}, function() {
                console.log("saved bu " + savedBu);
              });
            chrome.storage.local.set({'ad': savedAd}, function() {
                console.log("saved ad " + savedAd);
              });
            chrome.storage.local.set({'zd': savedZd}, function() {
            console.log("saved zd " + savedZd);
            });
            }

        const clearCacheDid = function() {
            chrome.storage.local.clear(function() {
                var error = chrome.runtime.lastError;
                if (error) {
                    console.error(error);
                    }
                    $('#temp').remove();
                    $('#how_many').empty();
                    $('#number_input').val("").empty();
                    $('#prefix_input').val("").empty();
                });
            }
       
        const clearCacheSid = function() {
            chrome.storage.local.clear(function() {
                var error = chrome.runtime.lastError;
                if (error) {
                    console.error(error);
                    }
                    $('#temp').remove();
                    $('#how_many').empty();
                    $('#from_result').val("").empty();
                    $('#to_result').val("").empty();
                    $('#bu_result').val("").empty();
                    $('#ad_result').val("").empty();
                    $('#zd_id').val("").empty();
                });
            }

})

// regex to grab sids
// (?<=CA)[A-Za-z0-9]{32}
// (?<=SM)[A-Za-z0-9]{32}