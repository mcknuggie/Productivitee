

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


/*
* parses name from host (Example: "www.youtube.com" --> "youtube")
*/
function parseName(hostUrl) {
    hostUrl = hostUrl.split(".");
    name = hostUrl[hostUrl.length - 2]; //get the second to last element
    return name;
}


const timeSummaryLink = "chrome-extension://" + chrome.runtime.id + "/overview.html";
const timerPopupLink = "chrome-extension://" + chrome.runtime.id + "/timer_popup.html";


chrome.storage.local.get(["hostName"], function(hostData) {
    hostName = hostData.hostName;

    chrome.storage.local.get(["trackedSites"], function(sitesData) {
        let trackedSites = sitesData.trackedSites;
        if(hostName in trackedSites) {
            location.href = timerPopupLink; // link to site-specific page
        } else {
            location.href = timeSummaryLink; // link to overview.
        }

    });

});
