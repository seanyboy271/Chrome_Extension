var list = []
grabList()

var start = new Date();

//setTimeout(function () {alert("TIMEOUT")}, 5000);

var finish = new Date();
var difference = new Date();
difference.setTime(finish.getTime() - start.getTime());
difference = difference.getMilliseconds()


function clearStorage(){
    chrome.storage.sync.clear()
}

function addURL() {
    grabList()

    chrome.tabs.query({ 'active': true, 'currentWindow': true },
        function (tabs) {
            // alert("DIFFERENCE = " + difference)
            var node = { "url": tabs[0].url, "time": difference } //Create an object to hold the url and the time

            if (!list) {
                list = []
            }

            list.push(node) //Add these objects to a list


            chrome.storage.sync.set({ "urlList": list }, function () { //Store the list as urlList
                document.getElementById("status").innerHTML = "size of list: " + list.length;
            })
        }
    );
}

function grabList() {
    chrome.storage.sync.get("urlList", function (result) { //Grab the list from storage
        list = result.urlList
    });
}


document.getElementById("button").onclick = function () {
    var div = document.getElementById('hello');
    div.innerHTML = ""
    addURL();

    var i = 0
    for(i; i < list.length; i++){
        div.innerHTML += "URL: " + list[i].url + "<br> Time: " + list[i].time + "<br><br>"
    }

}

document.getElementById('clearStorage').onclick = function(){
    clearStorage()
    var div = document.getElementById('hello');
    div.innerHTML = ""
}