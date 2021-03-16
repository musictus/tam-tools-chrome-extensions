$(()=> {
    // load saved data on popup
    chrome.storage.local.get(['did', 'from_ac', 'to_ac', 'ad', 'bu', 'zd', 'date', 'timezone', 'calendar', 'currentUrl'],(get)=> {
        $('#number_input').val(get.did);
        $('#from_result').val(get.from_ac);
        $('#to_result').val(get.to_ac);
        $('#bu_result').val(get.bu);
        $('#ad_result').val(get.ad);
        $('#zd_id').val(get.zd);
        $('#due_date').val(get.date);
        $("#timezone option[value='" + get.timezone + "']").attr("selected","selected");
    });
    
    // all the clicks below
    $('#grab_did').click(()=>{  
        clearCacheDid();    
        chrome.tabs.query({active:true, currentWindow: true}, (tabs)=> {
           chrome.tabs.sendMessage(tabs[0].id, {findSids: "didNumbers"});
            });
        });
    
    $('#cleanit').click(()=> {
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
    
    $('#add_prefix').click(()=> {
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

    $('#grab_reg').click(()=> {  
        clearCacheSid();    
        chrome.tabs.query({active:true, currentWindow: true}, (tabs)=> {
            chrome.tabs.sendMessage(tabs[0].id, {findSids: "regSids"});
            let url = tabs[0].url;
                chrome.storage.local.set({'currentUrl': url}, ()=> { 
                    console.log("URL Saved"); 
                    });
            console.log("Whats the URL? " + url);
            if (url.includes("https://calendar.google.com/calendar/") === true){
                    chrome.storage.local.set({'calendar': true}, ()=> { 
                        console.log("We are on the calendar page!") 
                    });
                } else {
                    chrome.storage.local.set({'calendar': false}, ()=> { 
                        console.log("We are NOT on the calendar page!")
                    })
                }
            });
        });

    $('#copy1').click(()=> {
        $('#number_input').select();
            document.execCommand('copy');
        });

    $('#insert').click(()=> {  
        chrome.tabs.query({active:true,currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {findSids: "insert!"});
            console.log("testing insert now")
            })
        });

    $('#gsheet').click(()=> {          
        chrome.storage.local.get(['did', 'from_ac', 'to_ac', 'ad', 'bu', 'zd', 'date', 'timezone'], (get)=> {            
            let didForGsheet = get.did.replace(/[+]/g, '%2B').replace(/\n/g, '%0A');
            // console.log("test storage data: " + get.did, '\n', get.from_ac, '\n', get.to_ac, '\n', get.bu, '\n', get.ad, '\n', get.zd, '\n', get.date, '\n', didForGsheet)
            chrome.tabs.create({
                url:"https://docs.google.com/forms/d/e/1FAIpQLSc9A2PS9KewEqKlq0yOh-rI5eDCP6TU9pwWR4QE3h2Gf-3FdQ/viewform?usp=pp_url"
                + "&entry.1433373205=" + get.from_ac
                + "&entry.246019091=" + get.to_ac
                + "&entry.1834915644=" + get.bu
                + "&entry.1121789603=" + get.ad
                + "&entry.161182515=" + didForGsheet
                + "&entry.977706640=" + get.date
                + "&entry.1818989476=" + get.timezone
                + "&entry.271349283=https://twilio.zendesk.com/agent/tickets/" + get.zd,
                selected:false  // We open the tab in the background
                })
            });
        })

    $('#save').click(()=> {  
        save();    
        });
    $('#save2').click(()=> {  
        save();    
        });

    $('#clear').click(()=> {  
        clearCacheDid()
        clearCacheSid()  
        });

    $('#open_transfer').click(()=> {
            chrome.tabs.create({
                url:"https://monkey.twilio.com/did/tools/transfer-numbers-v2",
                selected:false
                })
        });

    $('#calendar').click(()=> {
        chrome.storage.local.get(['did', 'from_ac', 'to_ac', 'ad', 'bu', 'zd', 'date', 'timezone'], (get)=> {
            let cleanDate = get.date.replace(/[-:]/g, '');
            let didForCal = get.did.replace(/[+]/g, '%2B').replace(/\n/g, '%0A');

            chrome.tabs.create({
                url:"https://www.google.com/calendar/render?action=TEMPLATE"
                + "&text=Internal%20Transfer"
                + "&dates=" + cleanDate + "00" + "/" + cleanDate + "00"
                + "&ctz=" + get.timezone
                + "&details=https%3A%2F%2Ftwilio%2Ezendesk%2Ecom%2Fagent%2Ftickets%2F" + get.zd
                + "%0A:From:" + get.from_ac
                + "%0A:To:" + get.to_ac
                + "%0A" + get.bu
                + "%0A" + get.ad
                + "%0A" + didForCal
                + "&crm=BUSY",
                selected:true
                })
        })
    });
    
    let sidResult = [];
    // listen for DIDs request
    chrome.runtime.onMessage.addListener((request, sender, sendResponse)=> {
        if (request.finally == "the dids!"){
            chrome.storage.local.get(['key'], (result)=> {
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
    // listen for SIDs request
    chrome.runtime.onMessage.addListener((request, sender, sendResponse)=> {
        if (request.finally == "the sids!"){
            chrome.storage.local.get(['key'], (result)=> {
                for (var key in result) {
                    var obj = result[key]
                    }
                    sidResult = obj
                    let arrayBu = obj.filter(value => /(?<=BU)[A-Za-z0-9]{32}/g.test(value));
                    let arrayAd = obj.filter(value => /(?<=AD)[A-Za-z0-9]{32}/g.test(value));
                    let arrayAc = obj.filter(value => /(?<=AC)[A-Za-z0-9]{32}/g.test(value));
                    let lastArrayBu = arrayBu.toString().split(',').join('\n');
                    let lastArrayAd = arrayAd.toString().split(',').join('\n');
                    let lastArrayAc = arrayAc.toString().split(',').join('\n');

                    chrome.storage.local.set({'from_ac': lastArrayAc}, ()=> { console.log("from ac storage " + lastArrayAc) });
                    chrome.storage.local.set({'to_ac': lastArrayAc}, ()=> { console.log("to ac storage " + lastArrayAc) });
                    chrome.storage.local.set({'bu': lastArrayBu}, ()=> { console.log("bu storage " + lastArrayBu) });
                    chrome.storage.local.set({'ad': lastArrayAd}, ()=> { console.log("ad storage " + lastArrayAd) });

                    if (obj.length === 0) {
                        $('#how_many').append( $('<span>').text("found " + obj.length + " DIDs"));
                        } else {
                            $('#from_result').val(lastArrayAc);
                            $('#to_result').val(lastArrayAc);
                            $('#bu_result').val(lastArrayBu);
                            $('#ad_result').val(lastArrayAd);
                                // chrome.storage.local.get(['zd'],(id)=> {
                                //     $('#zd_id').val(id.zd);
                                // });
                                chrome.storage.local.get(['currentUrl'],(get)=> {
                                    let zdId = get.currentUrl.replace(/https:\/\/twilio\.zendesk\.com\/agent\/tickets\//g, '');
                                    $('#zd_id').val(zdId);
                                    chrome.storage.local.set({'zd': zdId}, ()=> { console.log("ZD ID storage " + zdId) });
                                });
                            $('#how_many').append($('<span id="temp">').text("found " + obj.length + " total SIDs"));
                            }
                });

            } else if (request.finally == "the sids for calendar!"){

                chrome.storage.local.get(['key'], (result)=> {
                    for (var key in result) {
                        var obj = result[key]
                        }
                        sidResult = obj
                        let arrayBu = obj.filter(value => /(?<=BU)[A-Za-z0-9]{32}/g.test(value));
                        let arrayAd = obj.filter(value => /(?<=AD)[A-Za-z0-9]{32}/g.test(value));
                        let lastArrayBu = arrayBu.toString().split(',').join('\n');
                        let lastArrayAd = arrayAd.toString().split(',').join('\n');
                        chrome.storage.local.set({'bu': lastArrayBu}, function() { console.log("bu storage " + lastArrayBu) });
                        chrome.storage.local.set({'ad': lastArrayAd}, function() { console.log("ad storage " + lastArrayAd) });

                        if (obj.length === 0) {
                            $('#how_many').append( $('<span>').text("found " + obj.length + " DIDs"));
                            } else {
                                $('#bu_result').val(lastArrayBu);
                                $('#ad_result').val(lastArrayAd);
                                    chrome.storage.local.get(['from_ac', 'to_ac', 'zd'],(id)=> {
                                        $('#zd_id').val(id.zd);
                                        $('#from_result').val(id.from_ac);
                                        $('#to_result').val(id.to_ac);
                                    });
                                $('#how_many').append($('<span id="temp">').text("found " + obj.length + " total SIDs"));
                                }
                    });
                }
        });
        // function for SAVE button
        const save = ()=> {
            let savedDid = $('#number_input').val();
            let savedFromAc = $('#from_result').val();
            let savedToAc = $('#to_result').val();
            let savedBu = $('#bu_result').val().replace(/\r?\n|\r/,'');
            let savedAd = $('#ad_result').val().replace(/\r?\n|\r/,'');
            let savedZd = $('#zd_id').val().replace(/\r?\n|\r/,'');
            let savedDate = $('#due_date').val();
            let savedTimeZone = $('#timezone').val();

                chrome.storage.local.set({'did': savedDid}, ()=> { console.log("saved did " + savedDid) });
                chrome.storage.local.set({'from_ac': savedFromAc}, ()=> { console.log("saved from ac " + savedFromAc) });
                chrome.storage.local.set({'to_ac': savedToAc}, ()=> { console.log("saved to ac " + savedToAc) });
                chrome.storage.local.set({'bu': savedBu}, ()=> { console.log("saved bu " + savedBu) });
                chrome.storage.local.set({'ad': savedAd}, ()=> { console.log("saved ad " + savedAd) });
                chrome.storage.local.set({'zd': savedZd}, ()=> { console.log("saved zd " + savedZd) });
                chrome.storage.local.set({'date': savedDate}, ()=> { console.log("saved date " + savedDate) });
                chrome.storage.local.set({'timezone': savedTimeZone}, ()=> { console.log("saved timezone " + savedTimeZone) });
            }
        // function for CLEAR button (DID section)
        const clearCacheDid = ()=> {
            chrome.storage.local.clear(()=> {
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
        // function for CLEAR button (SID section)
        const clearCacheSid = ()=> {
            chrome.storage.local.clear(()=> {
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
                    $('#due_date').val("").empty();
                    $('#timezone').val("");
                });
            }
})