var list = []

//addURL(list)

var start = new Date();
// Do things here
var finish = new Date();
var difference = new Date();
difference.setTime(finish.getTime() - start.getTime());


function addURL(urlList) {
    chrome.tabs.query({ 'active': true, 'currentWindow': true },
        function (tabs) {
            urlList.push(tabs[0].url)
            var testJSON = {"url": tabs[0].url, "time": difference}
            chrome.storage.sync.set({"url": tabs[0].url, "time": difference}, function(){
                document.getElementById("status").innerHTML  = "we did it"
            })
        }
    );


}

document.getElementById("button").onclick = function () {
    var div = document.getElementById('hello');
    addURL(list);

    chrome.storage.sync.get(["url"], function(result) { //This does work 
        div.innerHTML = result.url
      });

    //list.toString() + "<br> Difference: " + difference.getMilliseconds()
}

