/*
 * TIMING.js
 * Runs in the background ONCE when extension is initially loaded
 */

chrome.runtime.onInstalled.addListener(function() {

    // Remove the current rules 
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        // Replace the current rules
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
        /*
        Create a new event Object with PageStateMatcher that
        matches page urls that follow http and https schemes
        */
        new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: {
                            // hostEquals: 
                            schemes: ['http', 'https']
                        }
                    })
        ], 
                actions: [
            /*
            displays the page action
            */
            new chrome.declarativeContent.ShowPageAction()
        ]
        }])
    })
});

var trackedSites = [
    "www.youtube.com", //red
    "www.twitch.tv", //purple
    "www.facebook.com", //blue
    "www.netflix.com", //darker red
    "www.reddit.com", //orange
    "www.hulu.com", //green
    "www.twitter.com", //lighter blue
    "www.buzzfeed.com", // reddish-orange, white
    "www.disneyplus.com", //dark blue
    "play.hbomax.com", //purple
    "www.instagram.com", //pink, orange, and white
    "www.tumblr.com", //blue
    "www.tiktok.com" //pink and blue
];



var seconds = 0;
var timerVariable;
var hostName;
chrome.storage.local.set({ "timerVariable": null });

chrome.webNavigation.onCompleted.addListener(stopAndStartTimer); // when any page loads or has been navigated to
chrome.tabs.onActivated.addListener(stopAndStartTimer); // when you click on a tab that aren't already on

chrome.tabs.onRemoved.addListener(function() { // when you close a tab
    clearInterval(timerVariable);
});


chrome.storage.local.set({ "totalSeconds": 0 });
chrome.storage.local
    .set({ // list of the unproductive sites that are being tracked and their corresponding initial seconds values of 0
        "trackedSites": {
            "www.youtube.com": 0, 
            "www.twitch.tv": 0,
            "www.facebook.com": 0,
            "www.netflix.com": 0,
            "www.reddit.com": 0,
            "www.hulu.com": 0,
            "www.twitter.com": 0,
            "www.buzzfeed.com": 0,
            "www.disneyplus.com": 0,
            "play.hbomax.com": 0,
            "www.instagram.com": 0,
            "www.tumblr.com": 0,
            "www.tiktok.com": 0
        }
    });
/*
 * Stops and starts the timer when an event is fired
 * The argument to this function will be different depending on the type of event that was used to call it (either onCompleted or onActivated)
 */

function stopAndStartTimer(event) //if a website has loaded/ been navigated to OR if it has been tabbed to
{


    chrome.storage.local.get(["timerVariable"], function(data) { // manipulating local storage, so all code must fall into here
        timerVariable = data.timerVariable;

        if (!("frameId" in event)) {
            clearInterval(timerVariable);
        }

        var tab = null;

        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            
            tab = tabs[0];

            let url = tab.url;

            /*
             * if url exists AND the frameId is 0 
             * (for sites like twitch.tv where onCompleted fires multiple times for a single page load)
             */
            if (url && (!("frameId" in event) || event.frameId == 0)) {    

                clearInterval(timerVariable); // always clear previous interval before starting a new one         
                
                hostName = getHost(url); // use getHost to parse the url and isolate just the hostName

                if (trackedSites.includes(hostName)) // and if that host is in the list
                {   
                    // start a timer and store that timer into local storage         
                    chrome.storage.local.set({ "timerVariable": setInterval(setTime, 1000) });
                }
            }
        })
    });
  
      
}


function getHost(url) {
    url = url.split("//", 2); // isolate just the origin/host name
    url = url[1];
    url = url.split("/", 2);
    let host = url[0]; // store into variable called hostName

    chrome.storage.local.set({ "hostName": host });

    return host;  
}


function setTime() {  

    chrome.storage.local.get(["trackedSites"], function(data) {
        sites = data["trackedSites"];
        sites[hostName]++; // website-specific seconds incremented
        chrome.storage.local.set({ "trackedSites": sites })
    });

    seconds++; //total seconds incremented
    chrome.storage.local.set({ "totalSeconds": seconds });
    
}


console.log('ran! ' + new Date().getSeconds());