var list = []
var start = new Date();
// Do things here
var finish = new Date();
var difference = new Date();
difference.setTime(finish.getTime() - start.getTime());




document.getElementById("button").onclick = function(){
    addURL(list);
    document.getElementById("hello").innerText= list
    var div = document.getElementById('hello');
    div.innerHTML = div.innerHTML + "<br> Difference: " + difference.getMilliseconds()
}

function addURL(urlList){
    urlList.push(window.location.toString())
}