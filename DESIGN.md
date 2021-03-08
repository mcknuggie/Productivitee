# Design

The very first task I knew I needed to complete was figuring out how to keep track of time. I knew I could either:

* Use a real world clock and subtract the starting time from the current time to track how long the user spent on a website
* OR I could have a function that incremented the total number of seconds passed every single second using setInterval(). (this was the option I settled on)

The following is a breakdown of each file's code and the functions within them. 

## timing.js

### stopAndStartTimer()

First, I found a way to store seconds on a single website (youtube.com) using storage.local. I initially had a single event handler, "chrome.tabs.onActivated.addListener(timerFunction)". But, I realized that this would only be able to keep track of when a site had been "tabbed to", as opposed to when a site had been loaded or navigated to. Therefore, I ended up settling on three different event handlers: onCompleted and onActivated (which would start a timer), and onRemoved (which would always stop the timer). The stopAndStartTimer function is made such that the interval will always be cleared before it is set again, and that, based on the event that called the function, would clear the interval at different points in the code. (Note: when I first wrote it, the stopAndStartTimer function was initially two different functions: one for each type of event (navigating vs "tabbing" to a website) However, these two functions repeated a lot of the same code, and therefore I decided to collapse them into a single function, writing two if statements that would ensure the correct code would run for the correct type of event).

Separately, this function checks for a specific frameId. onCompleted will fire once for each frameId. Most websites only have a single one. However, for websites such as twitch.tv, there might be multiple frameId's that need to be loaded, and therefore not checking for a specific one could clear and set the interval repeatedly, causing errors. This is why we specifically check for a frameId of 0.

### getHost()

The getHost function simply isolates the hostName from the rest of the url using split(). I created this to have a way of checking whether or not the user has navigated to one of the 13 "unproductive" websites.

### setTime()

The setTime function is where the code is actually incrementing the seconds values. You can see above in the stopAndStartTimer function that it is called every second using setInterval. The seconds spent on the website the user is currently on are stored into local storage. (As well as the total seconds spent on "unproductive" websites)

## when_they_click.js

This file is run when the user clicks on the extension icon to view the popup. The file has only three main actions.

1. Getting the current website's host name from storage.local and storing it into a global variable called hostName.
2. Updating the time a single time initially
3. Repeatedly calling updateTime() every second using setInterval

### (when_they_click.js) updateTime()

This function's purpose is to convert the total seconds a user has spent on the current website into a readable time format (hours : minutes: seconds). The method uses the hostName of the current website to key into our "trackedSites" object in local storage. This gives us access to the current number of seconds the user has spent on this website (websiteSeconds). The lines below use websiteSeconds along with a helper function and some remainder and division math in order to display the number of hours, minutes and seconds the user has spent on this website in a readable format.

### parseName()

This function is similar to getHost, but instead, it outputs the colloquial name for the website. (Ex: www.youtube.com --> youtube) We use this function to display just the name of the website in the popup instead of the whole host name.

## overview.js

This file is run when the user clicks on the "time summary" link at the bottom of the timer popup screen. 

This file has only two main processes:

1. Iterating through the list of "unproductive" websites and calling updateTime() on each of them
2. Hiding the html of the "unproductive" sites that user has not yet visited.

### (overview.js) updateTime()

This function does a similar process as updateTime() from when_they_click.js. However, in this context, not only are the time values of the current website converted from seconds to real world time, but ALL of the "unproductive" website timers are converted this way. On top of this, the total time spent on unproductive websites is converted to real world time as well. In order to figure out which element on the html to apply these time values to, the parseName() function is once again used to get the colloquial name of the website. This string is then concatenated to either "_seconds", "_minutes", or "_hours" depending on which type of time value is being updated.

### hideUnvisitedSites()

This function iterates over all of the keys in "sites". The variable "sites" represents the entire "trackedSites" object from storage.local. We go through every key-value pair and check if each key's seconds value is equal to 0. If it is equal to zero, then we hide the div in the html that contains the timer display (Ex: "youtube: hours : minutes : seconds" would be entirely hidden if the value of trackedSites[www.youtube.com] == 0). This has the effect of only displaying the sites that the user has visited. It makes the html much cleaner for the user.

## A Note About Asynchronous Code:

Throughout the code for this extension, you might see that whole blocks of code are contained inside of a .get call to storage.local. This is the case because all functions within storage.local are called asynchronously, meaning they happen at the same time, or even after, all the other code is being executed. I initially ran into many problems with this because leaving code outside of these function-calls can result in errors as well as code being executed in an unintended order. Therefore, the best solution to this was to put everything inside the asynchronous function call. This way, the program knows to run the rest of your code only AFTER the asynchronous call has finished.