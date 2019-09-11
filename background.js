chrome.webNavigation.onCompleted.addListener(function (tab) {
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
    alert("TAB CLOSED: " + tabID)

    chrome.storage.sync.get("urlList", function (response) { //Grab the list from storage
        if (response.urlList != null && response.urlList.length != 0) {
            list = response.urlList;

            var closedURLNode = findClosedURLNode(tabID, list);

            searchTabId(tabID, list) //Remove the tabID from the node

            if(closedURLNode.tabID.length == 0){ //No tabs open with this url anymore
                //calculate time
            }
            else{
                //URL still exists in another tab
            }

            //we should now be able to calculate the time and update the list

            chrome.storage.sync.set({ "urlList": list }, function () { //Store the list as urlList
                alert("New list pushed to storage: " + list.toString())
            })
        }
        else {
            alert("list is null or empty");
            list = []
        }
    });

})


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

function findClosedURLNode(tabID, list) {
    var node;
    for (var i = 0; i < list.length; i++) {
        node = list[i]
        alert("Current NODE: " + node + "Current NOde LIST: " + node.tabID)
        if (node.tabID.includes(tabID)) {
            alert("closedURLNODe found a urlNOde")
            return node
        }
    }
    return false
}

function clearStorage(list) {
    chrome.storage.sync.clear()
    list = []
}

//Returns the index of the url's Node in the list
function nodeIndex(list, url) {
    alert(list.length)

    for (var i = 0; i < list.length; i++) {
        if (list[i].url == url) {
            
            return i;
        }
    }
    return false;
}

//This function is used to make sure that no other url shares the given tabID
function searchTabId(tabID, list) {

    //If this causes a node to have a tabID List of size 0, then we should calculate the total time that it was open
    for (var i = 0; i < list.length; i++) {
        var tabIdList = list[i].tabID
        if (tabIdList.includes(tabID)) {
            //Remove it from the list
            alert("tabID found in tabIDList at position " + tabIdList.indexOf(tabID) + " in urlNode " + list[i].url + "   Prev List" + tabIdList.toString())
            tabIdList.splice(tabIdList.indexOf(tabID), 1);
            alert("aFTER Removal:  " + tabIdList.toString())
            if(tabIdList.length == 0){
                //calculat the total time

            }
        }
    }

}

function grabList(list, startTime) {
    chrome.storage.sync.get("urlList", function (response) { //Grab the list from storage
        if (response.urlList != null && response.urlList.length != 0) {
            alert("List is not null or empty" + response.urlList.toString())
            list = response.urlList;

            addURL(list, startTime)
        }
        else {
            alert("list is null or empty");
            list = []
            addURL(list, startTime);
        }
    });

}


function isRepeat(url, list) {
    var existingList = []

    for (var i = 0; i < list.length; i++) {
        if (!existingList.includes(list[i].url)) {
            existingList.push(list[i].url)
        }
    }

    if (existingList.includes(url)) {
        alert("url already included in list: Existing list:  " + existingList.toString())
        return true;
    }
    else {
        alert("url not included in list Existing list:  " + existingList.toString())
        return false;
    }
}

function addURL(list, startTime) {
    // list = grabList();

    chrome.tabs.query({ 'active': true, 'currentWindow': true },
        function (tabs) {
            if (tabs[0].url) {

                var tab = tabs[0];
                var tabID = tab.id

                searchTabId(tabID, list) //This should remove the current tabID from any other nodes


                var url = new URL(tab.url)

                url = url.hostname

                if (list == null) {
                    list = []
                }

                if (!isRepeat(url, list)) { //Different url, push the node into the list

                    var stopTime = new Date() //This is not correct, we cant assume that it is stopping
                    var difference = new Date()


                    difference.setTime(stopTime.getTime() - startTime.getTime());
                    difference = difference.getTime()

                    var time = new Date(difference)
                    var hours = time.getUTCHours();
                    var minutes = time.getUTCMinutes();
                    var seconds = time.getUTCSeconds();
                    var milliseconds = time.getUTCMilliseconds();
                    var timeString = hours + " Hours   " + minutes + " Minutes    " + seconds + " Seconds     " + milliseconds + " Milliseconds     ";

                    if (list.length > 0) {
                        alert("time spent on " + list[list.length - 1].url + ":    " + timeString)
                    }

                    var node = { "url": url, "time": difference, "startTime": startTime, "tabID": [tabID] } //Create an object to hold the url, the total time, and the start time which is updated each time they visit the site

                    alert("Before pushing node: " + list.toString())

                    list.push(node) //Add these objects to a list

                    alert("Node added to list: " + list.toString())

                    chrome.storage.sync.remove("urlList"); //Remove the existing list

                    chrome.storage.sync.set({ "urlList": list }, function () { //Store the list as urlList
                        alert("New list pushed to storage: " + list.toString())
                        //                    document.getElementById("status").innerHTML = "size of list: " + list.length;
                    })
                }

                else { //Url already exists, update its start time. Check it's tabID list to see if this is a new tab w/ same url
                    var index = nodeIndex(list,url);
                    var node = list[index]
                    var tabIDList = node.tabID

                    alert("Prev tabIDList:  " + tabIDList)
                    tabIDList.push(tabID); //Add the current tab id to the existing url.
                    alert("New tabID List:  " + tabIDList.toString())

                    chrome.storage.sync.set({ "urlList": list }, function () { //Store the list as urlList
                        alert("New list pushed to storage: " + list.toString())
                    })

                    alert("Current url is a repeat and was updated");
                    // This should then grab the time stored and add time to it, and update the start time
                }
            }
            //Else dont add anything to the list

        }

    );
}