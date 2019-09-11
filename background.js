chrome.webNavigation.onCompleted.addListener(function (tab) {
    var list = []
    //grabList(list);
    alert("list after grablist: " + list.toString());

    if (tab.frameId == 0) { //parent frame
        alert("DOM LOADED");

        var start = new Date();

        var finish = new Date();
        var difference = new Date();
        difference.setTime(finish.getTime() - start.getTime());
        difference = difference.getMilliseconds()

        grabList(list);
    }
})



function clearStorage(list) {
    chrome.storage.sync.clear()
    list = []
}

function grabList(list) {
    chrome.storage.sync.get("urlList", function (response) { //Grab the list from storage
        if (response.urlList != null && response.urlList.length != 0) {
            alert("List is not null or empty" + response.urlList.toString())
            list = response.urlList;

            addURL(list)
        }
        else {
            alert("list is null or empty");
            list = []
            addURL();
            //            document.getElementById("status").innerHTML = "Stored list is undefined";
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
        //        document.getElementById("status").innerHTML = "Element is already in the list <br> Current URL: " + url + " Current List: " + existingList.toString();
        return true;
    }
    else {
        alert("url not included in list Existing list:  " + existingList.toString())
        return false;
    }
}

function addURL(list) {
    // list = grabList();

    chrome.tabs.query({ 'active': true, 'currentWindow': true },
        function (tabs) {

            if (tabs[0].url) {
                var url = tabs[0].url

                var node = { "url": url, "time": 0 } //Create an object to hold the url and the time

                if (list == null) {
                    list = []
                }

                if (!isRepeat(url, list)) {
                    alert("Before pushing node: " + list.toString())

                    list.push(node) //Add these objects to a list

                    alert("Node added to list: " + list.toString())

                    chrome.storage.sync.remove("urlList"); //Remove the existing list

                    chrome.storage.sync.set({ "urlList": list }, function () { //Store the list as urlList
                        alert("New list pushed to storage: " + list.toString())
                        //                    document.getElementById("status").innerHTML = "size of list: " + list.length;
                    })
                }

                else {
                    alert("Current url is a repeat and was not added");
                }
            }
            //Else dont add anything to the list

        }

    );
}