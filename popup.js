// var list = []
// grabList()

// var start = new Date();

// var finish = new Date();
// var difference = new Date();
// difference.setTime(finish.getTime() - start.getTime());
// difference = difference.getMilliseconds()


 function clearStorage() {
     chrome.storage.sync.clear()
 }

// function addURL() {
//     grabList()

//     chrome.tabs.query({ 'active': true, 'currentWindow': true },
//         function (tabs) {

//             var url = tabs[0].url

//             var node = { "url": url, "time": difference } //Create an object to hold the url and the time

//             if (!list) {
//                 list = []
//             }

//             if (!isRepeat(url)) {
//                 list.push(node) //Add these objects to a list

//                 chrome.storage.sync.remove("urlList"); //Remove the existing list

//                 chrome.storage.sync.set({ "urlList": list }, function () { //Store the list as urlList
//                     document.getElementById("status").innerHTML = "size of list: " + list.length;
//                 })
//             }
//             //Else dont add anything to the list

//         }

//     );
// }

// function isRepeat(url) {
//     var existingList = []


//     for (var i = 0; i < list.length; i++) {
//         if (!existingList.includes(list[i].url)) {
//             existingList.push(list[i].url)
//         }
//     }

//     if (existingList.includes(url)) {
//         document.getElementById("status").innerHTML = "Element is already in the list <br> Current URL: " + url + " Current List: " + existingList.toString();
//         return true;
//     }
//     else {
//         return false;
//     }
// }

// function grabList() {
//     chrome.storage.sync.get("urlList", function (result) { //Grab the list from storage
//         if (result.urlList != null) {
//             list = result.urlList
//         }
//         else {
//             document.getElementById("status").innerHTML = "Stored list is undefined";
//         }
//     });
// }


// document.getElementById("button").onclick = function () {
//     var div = document.getElementById('hello');
//     div.innerHTML = ""
//     var i = 0
//     for (i; i < list.length; i++) {
//         div.innerHTML += "URL: " + list[i].url + "<br> Time: " + list[i].time + "<br><br>"
//     }

// }

document.getElementById('clearStorage').onclick = function () {
    clearStorage()
    var stat = document.getElementById("status")
    var div = document.getElementById('hello');
    div.innerHTML = ""
    stat.innerHTML = "List cleared."
}