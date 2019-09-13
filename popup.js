function clearStorage() {
    chrome.storage.sync.clear()
}

document.getElementById('clearStorage').onclick = function () {
    clearStorage()
    var stat = document.getElementById("status")
    var div = document.getElementById('hello');
    div.innerHTML = ""
    stat.innerHTML = "List cleared."
}

chrome.runtime.sendMessage({ greeting: "plsCalculateThanks" }, function (response) {


    chrome.storage.sync.get('urlList', function (result) {
        var hello = document.getElementById("hello");
        
        //Build the table to show in the popup
        if(response.status != "not happening chief"){
            var list = response.status
            var table = document.createElement("table")
            table.className = "table table-striped table-dark"
            var tableHead = document.createElement("thead")
            var headRow = document.createElement("tr")
            var websiteHeader = document.createElement("th")
            var timeHeader = document.createElement("th")

        
            var textnode = document.createTextNode("Website")
            websiteHeader.appendChild(textnode)
            headRow.appendChild(websiteHeader)
            textnode = document.createTextNode("Time")
            timeHeader.appendChild(textnode)
            headRow.appendChild(timeHeader)
            tableHead.appendChild(headRow)
            table.appendChild(tableHead)
            

            
                for (var i = 0; i < list.length; i++) {


                    var time = new Date(list[i].time)
                    var hours = time.getUTCHours();
                    var minutes = time.getUTCMinutes();
                    var seconds = time.getUTCSeconds();
                    var milliseconds = time.getUTCMilliseconds();
                    var timeString = hours + " Hours   " + minutes + " Minutes    " + seconds + " Seconds     " + milliseconds + " Milliseconds     ";



                    var row = document.createElement("tr")
                    var cell = document.createElement("td")
                    textNode = document.createTextNode(list[i].url)
                    cell.appendChild(textNode)
                    row.appendChild(cell)

                    cell = document.createElement("td")
                    textNode = document.createTextNode(timeString)
                    cell.appendChild(textNode)
                    row.appendChild(cell)
                    table.appendChild(row)

                }

                hello.appendChild(table)

                table.cellSpacing = "10px"
                table.cellPadding = "10px"
            
            }
            else {
                hello.innerHTML = "No Data to show right now"
        }
    })
});



