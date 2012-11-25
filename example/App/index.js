var height = window.screen.availHeight * window.devicePixelRatio;
var width = window.screen.availWidth * window.devicePixelRatio;
var canvas = document.getElementById("canvas");
canvas.width = width;
canvas.height = height;

var ctx = canvas.getContext("2d");
ctx.fillStyle = "#ffffff";
ctx.fillRect(0, height / 2 - 2, width, 4);
ctx.font = "30px Arial bold";
ctx.fillText("Pure WebView", 50, 200);
ctx.fillText("Ejecta + WebView", 50, height / 2 + 200);

var started = false;
document.addEventListener('touchend', function(ev) {
    console.log("touchend")
    if(started) {
        return;
    }
    started = true;
    ctx.clearRect(0, 0, width, height);
    if(ev.touches[0].pageY < height / 2) {
        runCase(true);
    } else {
        runCase(false);
    }
}, true);


function runCase(pureWebView) {
    if(pureWebView) {
        console.log("run : Pure WebView");
        var webView = new Ejecta.WebView();
        webView.src = "index.html";
    } else {
        console.log("run : Ejecta + WebView");
        ejecta.require("pic-rain.js");
        ejecta.require("webview-hud.js");

    }
}