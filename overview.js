/*
 * overview.js
 * Runs when they click the link at the bottom of the popup screen
 */

var hostName;
var websiteSeconds;
var totalSeconds = 0;
var sites;

let timerLinkUrl = "chrome-extension://" + chrome.runtime.id + "/timer_popup.html";
const overviewLink = document.getElementById("timer_link");
overviewLink.setAttribute("href", timerLinkUrl);

var trackedSites = [
    "www.youtube.com",
    "www.twitch.tv",
    "www.facebook.com",
    "www.netflix.com",
    "www.reddit.com",
    "www.hulu.com",
    "www.twitter.com",
    "www.buzzfeed.com",
    "www.disneyplus.com",
    "play.hbomax.com",
    "www.instagram.com",
    "www.tumblr.com",
    "www.tiktok.com"
];



chrome.storage.local.get(["trackedSites"], function(data) {
    sites = data["trackedSites"];

    // before we do anything else, let's check if we're on a valid page.
    chrome.storage.local.get(["hostName"], function(hostData) {
        hostName = hostData.hostName;
    
        if (!(hostName in sites)) {
            // get rid of back button!
            document.getElementById("timer_link").setAttribute("hidden", "true");
        } 
    
    });

    for (i = 0; i < trackedSites.length; i++) // go through each tracked website...
    {
        updateTime(trackedSites[i]); // ...and calculate + display the correct times
    }


    hideUnvisitedSites(sites); // then, hide all the sites in trackedSites that we haven't visited yet

});



//functions

/*
 * updates the time based on the host it's given by assigning the element id for the corresponding host/website.
 */
function updateTime(host) {   


    websiteSeconds = sites[host];

    name = parseName(host);

    secondsId = name + "_seconds"; 

    minutesId = name + "_minutes";

    hoursId = name + "_hours";


    document.getElementById(secondsId).innerHTML = adjust(websiteSeconds % 60);
    websiteMinutes = adjust(parseInt(websiteSeconds / 60));
    document.getElementById(minutesId).innerHTML = adjust(parseInt(websiteMinutes % 60)); 
    document.getElementById(hoursId).innerHTML = adjust(parseInt(websiteMinutes / 60));

    
    chrome.storage.local.get(["totalSeconds"], function(data) {
        totalSeconds = data.totalSeconds;

        total_seconds.innerHTML = adjust(totalSeconds % 60);
        totalMinutes = adjust(parseInt(totalSeconds / 60));
        total_minutes.innerHTML = adjust(parseInt(totalMinutes % 60));
        total_hours.innerHTML = adjust(parseInt(totalMinutes / 60));
    });

}


/*
 * parses name from host (Example: "www.youtube.com" --> "youtube")
 */
function parseName(hostUrl) {
    hostUrl = hostUrl.split(".");
    name = hostUrl[hostUrl.length - 2]; //get the second to last element
    return name;
}

/*
 * Converts an integer to a two digit string
 */
function adjust(value) {
    var num_string = value + "";
    if (num_string.length < 2) {
        return "0" + num_string;
    } else {
        return num_string;
    }
}
/*
 * gets rid of sites you have not visited yet in order to make the summary popup html visually cleaner
 */
function hideUnvisitedSites(sites) {
    for (key in sites) {

        name = parseName(key);

        if (sites[key] == 0) {
            document.getElementById(name).style.display = "none";
        }
    }
}
