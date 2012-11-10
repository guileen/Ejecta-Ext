window.devicePixelRatio = window.devicePixelRatio || 1;
var Config = {
	width: window.screen.availWidth * window.devicePixelRatio,
	height: window.screen.availHeight * window.devicePixelRatio,
	FPS: 60
}



var canvas = document.getElementById("canvas");
canvas.width = Config.width;
canvas.height = Config.height;
var ctx = canvas.getContext("2d");


var test;

function init() {

	test = new Demo({
		canvas: "canvas",
		sprites: createSprites()
	});
	test.init();
}

function createSprites() {
	var list = [];
	var row = 30,
		col = 30;
	var w=10, h=10;
	var sw = Math.floor(Config.width / col),
		sh = Math.floor(Config.height / row);

	for(var r = 0; r < row; r++) {
		for(var c = 0; c < col; c++) {
			var b = new Block(sw * c + 5, sh * r-Config.height, w, h);
			list.push(b);
		}
	}

	return list;
}

function Block(x, y, w, h) {

	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.oy=y;

	this.color = "#ffffff";

	var img = document.createElement("canvas");
	img.width = this.w;
	img.height = this.h;
	var ctx = img.getContext("2d");
	ctx.fillStyle = this.color;
	ctx.globalAlpha = 0.8;
	ctx.fillRect(0, 0, img.width, img.height)
	this.img = img;

	this.init();
}


Block.prototype = {

	init: function() {
		this.x=this.x+random(-5, 5);
		this.y=this.oy;
		this.ax = 0;
		this.ay = 0.00005;
		this.vx = 0;
		this.vy = random(-0.5, 0.5);
	},


	update: function(timeStep) {
		if(this.y >Config.height+10) {
			this.init();
		}
		var vx = this.vx + this.ax * timeStep;
		var vy = this.vy + this.ay * timeStep;
		var dx = (this.vx + vx) / 2 * timeStep;
		var dy = (this.vy + vy) / 2 * timeStep;

		this.vx = vx;
		this.vy = vy;

		this.x += dx;
		this.y += dy;
	},

	render: function(context, timeStep) {
		context.drawImage(this.img,this.x, this.y);
	}
}


///////////////////

function Demo(cfg) {
	for(var key in cfg) {
		this[key] = cfg[key];
	}
}

Demo.prototype = {

	canvas: null,
	context: null,
	sprites: null,
	width: Config.width,
	height: Config.height,
	FPS: Config.FPS,
	init: function() {
		this.canvas = $id(this.canvas) || this.canvas;
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.context = this.canvas.getContext("2d");
		this.context.font = "24pt Verdana";
		this.context.fillStyle="#000000";

		this.timeStep = 1000 / this.FPS;

		var Me = this;
		this.callRun = function() {
			Me.run();
		}
		this.sprite = this.sprites || [];

	},

	start: function() {
		this.avgTime = 1000 / this.FPS;
		this.lastTime = Date.now() - this.avgTime;
		this._count = 10;
		this._fps = 0;
		this.last = Date.now();
		this.run();
	},

	blank: 0,
	last: 0,
	run: function() {
		this.mainLoop = setTimeout(this.callRun, this.timeStep);
		var now = Date.now();
		var timeStep = this.blank + now - this.last;
		this.last = now;

		while(timeStep >= this.timeStep) {
			this.update(this.timeStep);
			timeStep -= this.timeStep;
		}
		this.blank = timeStep;

		this.render(this.context, timeStep);

	},

	update: function(timeStep) {
		this.sprites.forEach(function(s) {
			s.update(timeStep);
		});
	},
	render: function(context, timeStep) {
		context.fillRect(0,0,this.width,this.height);
		this.sprites.forEach(function(s) {
			s.render(context);
		});
	}

}

//////// utils ////////////

function random(lower, higher) {
	return(higher - lower) * Math.random() + lower;
}

function $id(id) {
	return document.getElementById(id);
}


init();
test.start();


//////////////////////////

var webView = new Ejecta.WebView();
webView.src = "index.html";

function check() {
	if(webView.loaded) {
		var t = Date.now();
		for(var i = 0; i < 1000; i++) {
			var r = webView.eval("thisIsAWebViewFunction2();");
			console.log(r)
		}
		console.log("time : " + (Date.now() - t));
		return;
	}
	setTimeout(check, 10);
}
check();

function thisIsAEjectJSFunction() {
	console.log("thisIsAEjectJSFunction called by WebView");
}