/*
 * when_they_click.js
 * Runs when they click the extension icon.
 */
debugger;

let hostName;
let websiteSeconds;
const totalSeconds = 0;
// runtime.id dynamically gets the current id of the extension
let timeSummaryLink = "chrome-extension://" + chrome.runtime.id + "/overview.html";
// "link" is a an id referring to the time summary <a> tag that brings the user to the time summary
const overviewLink = document.getElementById("overview_link");
overviewLink.setAttribute("href", timeSummaryLink);

chrome.storage.local.get(["hostName"], function(hostData) {
    hostName = hostData.hostName;   

    let element = document.getElementById("host_text")
    element.setAttribute("data-host", hostName)
    element.innerHTML = parseName(hostName); // display just the isolated name of the website

});


updateTime(); // always start by updating the time first
setInterval(updateTime, 1000); // update the timer element every second to display the current time





//functions


/*
 * parses name from host (Example: "www.youtube.com" --> "youtube")
 */
function parseName(hostUrl) {
    hostUrl = hostUrl.split(".");
    name = hostUrl[hostUrl.length - 2]; //get the second to last element
    return name;
}

/*
 * updates the hour, minute, and second values for the timer element on the popup
 */
function updateTime() {   
    chrome.storage.local.get(["trackedSites"], function(data) {
        sites = data["trackedSites"];
        websiteSeconds = sites[hostName];

        seconds.innerHTML = adjust(websiteSeconds % 60); //parseInt converts strings into num's, AND it also truncates   
        websiteMinutes = adjust(parseInt(websiteSeconds / 60));
        minutes.innerHTML = adjust(parseInt(websiteMinutes % 60));
        hours.innerHTML = adjust(parseInt(websiteMinutes / 60));
    });

}

/*
 * Converts an integer to a two digit string
 */
function adjust(value) {
    let num_string = value + "";
    if (num_string.length < 2) {
        return "0" + num_string;
    } else {
        return num_string;
    }
}

