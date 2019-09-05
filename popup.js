var start = new Date();
// Do things here
var finish = new Date();
var difference = new Date();
difference.setTime(finish.getTime() - start.getTime());




document.getElementById("button").onclick = function(){
    document.getElementById("hello").innerText= window.location.href
    var div = document.getElementById('hello');
    div.innerHTML = div.innerHTML + "<br> Difference: " + difference.getMilliseconds()
}