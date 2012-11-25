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
        sprites: createSprites() || []
    });
    test.init();
}

function createStar(x, y) {
    var w = 42,
        h = 42
    return new Block(x, y, w, h);
}

function createSprites() {
    return;
    
    var list = [];
    var row = 40,
        col = 40;
    var sw = Math.floor(Config.width / col),
        sh = Math.floor(Config.height / row);

    for(var r = 0; r < row; r++) {
        for(var c = 0; c < col; c++) {
            var b = createStar(sw * c, sh * r);
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
    this.oy = y;

    this.init();
}


Block.prototype = {

    init: function() {
        this.x = this.x + random(-10, 10);
        this.y = this.oy;
        this.ax = 0;
        this.ay = 0.00005;
        this.vx = 0;
        this.vy = random(0, 0.5);
    },

    reset: function() {
        this.x = this.x + random(-10, 10);
        this.y = -100;
        this.ax = 0;
        this.ay = 0.00005;
        this.vx = 0;
        this.vy = random(0.2, 0.5);
    },
    update: function(timeStep) {

        if(this.y > Config.height + 10) {
            this.reset();
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
        context.drawImage(pic, this.x, this.y, this.w, this.h);
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
        this.context.fillStyle = "#000000";

        this.timeStep = 1000 / this.FPS;
        this.maxTimeStep = this.timeStep * 3;
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
    pause: function() {
        this.paused = true;
    },
    resume: function() {
        this.paused = false;
    },
    paused: false,
    blank: 0,
    last: 0,
    run: function() {
        this.mainLoop = setTimeout(this.callRun, this.timeStep);
        var now = Date.now();
        var timeStep = this.blank + now - this.last;
        this.last = now;

        if(!this.paused) {
            this.update(this.timeStep);

            //            if (timeStep> this.maxTimeStep){
            //                timeStep= this.maxTimeStep;
            //            }
            //            while(timeStep >= this.timeStep) {
            //                this.update(this.timeStep);
            //                timeStep -= this.timeStep;
            //            }
            //            this.blank = timeStep;
        }

        this.render(this.context, timeStep);

    },

    update: function(timeStep) {
        this.sprites.forEach(function(s) {
            s.update(timeStep);
        });
    },
    render: function(context, timeStep) {
        context.fillRect(0, 0, this.width, this.height);
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

function playSnow() {
    test.resume();
}

function pauseSnow() {
    console.log("pppp")
    test.pause();

}

function addStar(x, y) {
    test.sprites.push( createStar(x,y) );
    //test.context.drawImage(pic, x, y);
}

var pic = new Image();


function loadResource() {
    pic.src = "pic.png";
    pic.onload = function() {
        init();
        test.start();
    }
}