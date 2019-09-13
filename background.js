chrome.webNavigation.onBeforeNavigate.addListener(function (tab) {
    var list = []

    if (tab.frameId == 0) { //parent frame
        var startTime = new Date(); //This is the time the page is loaded

        grabList(list, startTime);
    }
})

chrome.tabs.onRemoved.addListener(function (tabID) {
    //this will return a tabID
    var currentTime = new Date();
    currentTime = currentTime.getTime()


    chrome.storage.sync.get("urlList", function (response) { //Grab the list from storage
        if (response.urlList != null && response.urlList.length != 0) {
            list = response.urlList;

            var closedURLNode = findClosedURLNode(tabID, list);

            searchTabId(tabID, list, closedURLNode.url) //Remove the tabID from the node


            if (closedURLNode.tabID.length == 0) { //No tabs open with this url anymore
                calcTime(list, closedURLNode.url); //Calculate the time
            }

            else {
                alert("url still exists" + closedURLNode.url + " number of tabs still open with this url: " + closedURLNode.tabID.length);
                //URL still exists in another tab
            }

            //we should now be able to calculate the time and update the list
            chrome.storage.sync.set({ "urlList": list })
        }
        else {
            list = []
        }
    });

})


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        chrome.storage.sync.get('urlList', function (response) {
            if (response.urlList) {
                calcAllTimes(response.urlList)
                sendResponse({ status: response.urlList })
            }
            else {
                sendResponse({ status: "not happening chief" })
            }
        })
        return true
    });


//Good way to calculate time would be to just grab the current time the page is loaded
//Then if they go to a different url, get the time and subtract final-initial
//If they stay on the same url, you dont need to get the current time since they have not left yet

//Should store the start time in the node for each site, 
//If the user closes a tab, the time for the url of that tab is calculated
//If the user opens anohter tab, the original tab keeps its start time, and the new tab gets the current time as start time for that url
//The the user changes url's in the same tab, the start time is added for the new url, and the total time gets time added to it for the old url
//The only events in which time should be added to total is if the url changes, or the tab is closed (chrome.onRemoved)

//The node needs to be pushed into storage as soon as possible, storing the start time and the url so that 
//New start times can be created in the case that another tab is opened


//Need to figure out how to calucaltw timw now
//I think that there should be 1 time vairbale, currentTime that all of the times in the program are based off of at each instant this is called

//This is used to calculate the "open time" of all open websites.
//Used by popup.js to update the display when the user clicks on it
function calcAllTimes(list) {

    for (var i = 0; i < list.length; i++) {
        var node = list[i]
        if (node.tabID.length > 0) { //If the tab is currently open

            var startTime = node.startTime
            var stopTime = new Date()
            var difference = new Date()
            difference.setTime(stopTime.getTime() - startTime);
            difference = difference.getTime()

            node.time += difference

            var time = new Date(difference)
            var hours = time.getUTCHours();
            var minutes = time.getUTCMinutes();
            var seconds = time.getUTCSeconds();
            var milliseconds = time.getUTCMilliseconds();
            var timeString = hours + " Hours   " + minutes + " Minutes    " + seconds + " Seconds     " + milliseconds + " Milliseconds     ";


            node.startTime = stopTime.getTime()

            chrome.storage.sync.set({ "urlList": list })
        }
    }
}

//Finds the urlNode which was closed
function findClosedURLNode(tabID, list) {
    var node;
    for (var i = 0; i < list.length; i++) {
        node = list[i]
        if (node.tabID.includes(tabID)) {
            return node
        }
    }
    return false
}

//Clears chrome storage
function clearStorage(list) {
    chrome.storage.sync.clear()
    list = []
}

//Returns the index of the url's Node in the list
function nodeIndex(list, url) {

    for (var i = 0; i < list.length; i++) {
        if (list[i].url == url) {

            return i;
        }
    }
    return false;
}

//This function is used to make sure that no other url shares the given tabID
//If the tabID is found in any node, it is deleted.
//The tabID is then added back by addURL
function searchTabId(tabID, list, url) {

    //If this causes a node to have a tabID List of size 0, then we should calculate the total time that it was open
    for (var i = 0; i < list.length; i++) {
        var tabIdList = list[i].tabID
        if (tabIdList.includes(tabID)) {
            //Remove it from the list
            tabIdList.splice(tabIdList.indexOf(tabID), 1);
            if (tabIdList.length == 0 && list[i].url != url) { //You have changed url's within the same tab, no other tab contains the old url, and it is not a brand new url
                calcTime(list, list[i].url)
            }
        }
    }

}

//This function is responsible for retrieving the urlList from chrome storage, and calling addURL
function grabList(list, startTime) {
    chrome.storage.sync.get("urlList", function (response) { //Grab the list from storage
        if (response.urlList != null && response.urlList.length != 0) {
            list = response.urlList;

            addURL(list, startTime)
        }
        else {
            list = []
            addURL(list, startTime);
        }
    });

}


//This function will take in the urlList, and the url that it is searching for
// It will check to see if there are any tabs open with given url
//If not, it will calculate the time the page was open, update the time, and save the list. 
//Note, this does not update the start time, since when the url is opened again, its start time will be updated by addURL
function calcTime(list, url) {

    var index = nodeIndex(list, url);
    var stopTime = new Date()
    var node = list[index]
    var startTime = node.startTime

    if (node.tabID.length == 0) {

        var difference = new Date()
        difference.setTime(stopTime.getTime() - startTime);
        difference = difference.getTime()

        node.time += difference

        var time = new Date(difference)
        var hours = time.getUTCHours();
        var minutes = time.getUTCMinutes();
        var seconds = time.getUTCSeconds();
        var milliseconds = time.getUTCMilliseconds();
        var timeString = hours + " Hours   " + minutes + " Minutes    " + seconds + " Seconds     " + milliseconds + " Milliseconds     ";

        chrome.storage.sync.set({ "urlList": list })

    }

}

//Determines if the url already exists is the given list
function isRepeat(url, list) {
    var existingList = []

    for (var i = 0; i < list.length; i++) { //Set up the list of existing url's
        if (!existingList.includes(list[i].url)) {
            existingList.push(list[i].url)
        }
    }

    if (existingList.includes(url)) {
        return true;
    }
    else {
        return false;
    }
}

//This function is reponsible for adding and updating the URL list
// It essentially states "if this already exists, update it. If it doesnt already exist, add it to the list"
function addURL(list, startTime) {

    chrome.tabs.query({ 'active': true, 'currentWindow': true },
        function (tabs) {
            if (tabs[0].url) {

                var tab = tabs[0];
                var tabID = tab.id

                var url = new URL(tab.url)

                url = url.hostname

                searchTabId(tabID, list, url) //This should remove the current tabID from any other nodes

                if (list == null) {
                    list = []
                }

                if (!isRepeat(url, list)) { //Different url, push the node into the list

                    var node = { "url": url, "time": 0, "startTime": startTime.getTime(), "tabID": [tabID] } //Create an object to hold the url, the total time, and the start time which is updated each time they visit the site

                    list.push(node) //Add these objects to a list

                    chrome.storage.sync.remove("urlList"); //Remove the existing list

                    chrome.storage.sync.set({ "urlList": list })
                }

                else { //Url already exists. Check it's tabID list to see if this is a new tab w/ same url
                    var index = nodeIndex(list, url);
                    var node = list[index]
                    var tabIDList = node.tabID

                    if (tabIDList.length == 0) {
                        //tab previousuly existed but did not have anohter tab open. update start time
                        node.startTime = startTime.getTime()
                    }
                    tabIDList.push(tabID); //Add the current tab id to the existing url.

                    chrome.storage.sync.set({ "urlList": list })

                }
            }
        }
    );
}