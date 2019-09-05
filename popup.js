addURL()
var start = new Date();
// Do things here
var finish = new Date();
var difference = new Date();
difference.setTime(finish.getTime() - start.getTime());


function addURL() {
    chrome.tabs.query({ 'active': true, 'currentWindow': true },
        function (tabs) {
            chrome.storage.sync.set({"url": tabs[0].url, "time": difference}, function(){
                document.getElementById("status").innerHTML  = "we did it"
            })
        }
    );


}

document.getElementById("button").onclick = function () {
    var div = document.getElementById('hello');
    addURL();

    chrome.storage.sync.get(["url"], function(result) { //This does work 
        div.innerHTML = "URL: " + result.url + "<br> Time: " + result.difference
      });

}

