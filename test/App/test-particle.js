
var w=100, h=100;


window.devicePixelRatio = window.devicePixelRatio || 1;
var Config = {
	width: Math.min(640,window.screen.availWidth-4)*window.devicePixelRatio,
	height: Math.min(920,window.screen.availHeight-4)*window.devicePixelRatio,
	FPS: 62,//50,
}


var canvas=document.getElementById("canvas");
canvas.width=Config.width;
canvas.height=Config.height;

var ctx=canvas.getContext("2d");


var test;

function init() {

	test = new Demo({
		canvas: "canvas",
		sprites : createSprites()
	});
	test.init();
}

function createSprites(){
	var list=[];
	var row=5, col=4;
	var sw=Math.floor(Config.width/col),
		sh=Math.floor(Config.height/row);

	for (var r=0;r<row;r++){
		for (var c=0;c<col;c++){
			 var b=new Block(sw*c+10,sh*r+20,100,100);
			list.push(b);
		}
	}

	return list;
}

function Block(x,y,w,h){

	this.x=x;
	this.y=y;
	this.w=w||100;
	this.h=h||100;
	this.pieces=this.pieces||[];
    
    var colors=["#ffffff","#ff0000","#00ff00","#0000ff","#ffff00","#00ffff","#ff00ff"];
    this.color=colors[ Math.floor(random(0,colors.length)) ]

	var img=document.createElement("canvas");
	img.width=this.w;
	img.height=this.h;
	var ctx=img.getContext("2d");
	ctx.fillStyle=this.color;
	ctx.globalAlpha=0.7;
	ctx.fillRect(0,0,img.width,img.height)
	this.img=img;

	this.init();
}


Block.prototype={

	init : function(){
		var row=9, col=9;
		this.pieceCount=row*col;
		var sw=Math.floor(this.w/col), sh=Math.floor(this.h/row);

		var i=0;
		for (var r=0;r<row;r++){
			for (var c=0;c<col;c++){
				var p=this.pieces[i]=this.pieces[i]||{};
				p.d=false;
				p.x=this.x+c*sw;
				p.y=this.y+r*sh;
				p.w=sw ;
				p.h=sh ;
				p.ax=0;
				p.ay=0.0008;
				p.vx=c<col/2?random(-0.11,0.01):random(-0.01,0.11);
				p.vy=random(-0.5,-0.3);
				p.cx=c*sw;
				p.cy=r*sh;
				i++;
			}

		}
	},


	update : function(timeStep){
		if (this.pieceCount<=0){
			this.init();
		}
		var Me=this;
		this.pieces.forEach(function(p){
			if (p.d){
				return;
			}
			var vx=p.vx+p.ax * timeStep;     
			var vy=p.vy+p.ay * timeStep; 
			var dx=(p.vx + vx)/2 * timeStep;
			var dy=(p.vy + vy)/2 * timeStep;

			p.vx=vx;
			p.vy=vy;

			p.x+=dx;
			p.y+=dy;

			if (p.y>Config.height+10){
				p.d=true;
				Me.pieceCount--;
			}
		});
	},

	render : function(context, timeStep){
		var f=context.fillStyle;
		var Me=this;
		context.save();
		context.fillStyle=this.color||"black";
		context.globalAlpha=0.7;
		this.pieces.forEach(function(p){
			if (p.d){
				return;
			}
			
			context.fillRect(p.x,p.y,p.w,p.h);
 
 			// var r=p.w/2;
			// context.beginPath();
			// context.arc(p.x+r,p.y+r,r,0,Math.PI*2);
			// context.closePath();
			// context.fill();
 
			// context.beginPath();
			// context.moveTo(p.x,p.y);
			// context.lineTo(p.x+p.w,p.y);
			// context.lineTo(p.x+p.w,p.y+p.h);
			// context.lineTo(p.x,p.y+p.h);
			// context.closePath();
			// context.fill();
			
			// context.drawImage(Me.img,
			// 	p.cx,p.cy,p.w,p.h,
			// 	p.x,p.y,p.w,p.h);

		});
		context.restore();
	}
}


///////////////////

function Demo(cfg) {
	for (var key in cfg) {
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
		this.context.font="24pt Verdana";

		this.timeStep = 1000 / this.FPS;

		var Me = this;
		this.callRun = function() {
			Me.run();
		}
		this.sprite=this.sprites||[];

		this.bg=document.createElement("canvas");
		this.bg.width=this.width;
		this.bg.height=this.height;
		var ctx=this.bg.getContext("2d")
		this.renderBg(ctx);
		// var dataURL= this.bg.toDataURL();
		
		// this.canvas.style.backgroundImage="url(\""+dataURL+"\")"    
	},

	renderBg : function(ctx){
		var row=12;
		var h=this.height/row;
		// h=Math.floor(h);
		var colors=["#ffffff","#ff0000","#00ff00","#0000ff","#ffff00","#00ffff","#ff00ff"];
		ctx.save();
		//ctx.rotate(-0.2);
		for (var r=0;r<row;r++){
			ctx.fillStyle=colors[r%colors.length];
			ctx.fillRect(-200,r*h,this.width+300,h);
		}
		ctx.restore();
	},
	start : function(){
		this.avgTime=1000/this.FPS;
		this.lastTime=Date.now()-this.avgTime;
		this._count=10;
		this._fps=0;
		this.last=Date.now();
		this.run();
	},

	tickAvgFPS : function(){
		this._count--;
		var now=Date.now();
		this.avgTime=this.avgTime*0.9+(now-this.lastTime)*0.1;
		this.lastTime=now;
		if (this._count==0){
			this._count=10;
			this._fps=( 10000/this.avgTime>>0)/10;
		}
        this.context.fillStyle="#ffffff";
		this.context.fillRect(5,5,100,40);
         this.context.fillStyle="#000000";
		this.context.fillText(this._fps,10,40);
	},
	
	blank : 0,
	last : 0,
	run: function() {
		this.mainLoop = setTimeout(this.callRun, this.timeStep);
		var now=Date.now();
		var timeStep=this.blank+now-this.last;
		this.last=now;

		while (timeStep>=this.timeStep){
			this.update(this.timeStep);
			timeStep-=this.timeStep;
		}
		this.blank=timeStep;

		this.render(this.context, timeStep);

		this.tickAvgFPS();

	},

	update : function(timeStep){
		this.sprites.forEach(function(s){
			s.update(timeStep);
		});
	},
	render : function(context,timeStep){
		context.drawImage(this.bg,0,0)
		// context.clearRect(0,0,this.width,this.height);
//		context.clearRect(0,0,this.width,this.height);
		this.sprites.forEach(function(s){
			s.render(context);
		});
	}

}

//////// utils ////////////

function random(lower, higher) {
	return (higher - lower) * Math.random() + lower;
}

function $id(id) {
	return document.getElementById(id);
}


	init();
	test.start();


