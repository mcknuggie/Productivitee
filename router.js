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
