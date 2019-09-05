<<<<<<< HEAD
addURL()
=======
var list = []
>>>>>>> b930d706830ca9e7c28da952cd994baa156b6887
var start = new Date();
// Do things here
var finish = new Date();
var difference = new Date();
difference.setTime(finish.getTime() - start.getTime());


<<<<<<< HEAD
function addURL() {
    chrome.tabs.query({ 'active': true, 'currentWindow': true },
        function (tabs) {
            chrome.storage.sync.set({"url": tabs[0].url, "time": difference}, function(){
                document.getElementById("status").innerHTML  = "we did it"
            })
        }
    );
=======
>>>>>>> b930d706830ca9e7c28da952cd994baa156b6887


document.getElementById("button").onclick = function () {
<<<<<<< HEAD
    var div = document.getElementById('hello');
    addURL();

    chrome.storage.sync.get(["url"], function(result) { //This does work 
        div.innerHTML = "URL: " + result.url + "<br> Time: " + result.difference
      });

=======
    addURL(list);
    document.getElementById("hello").innerText = list
    var div = document.getElementById('hello');
    div.innerHTML = div.innerHTML + "<br> Difference: " + difference.getMilliseconds()
>>>>>>> b930d706830ca9e7c28da952cd994baa156b6887
}

function addURL(urlList) {
    chrome.tabs.query({ 'active': true, 'currentWindow': true },
        function (tabs) {
            alert(tabs[0].url);
        }
    );
}