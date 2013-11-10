window.onload = init;

var winW, winH;
var ball, hole;
var mouseDownInsideball;
var touchDownInsideball;
var movementTimer;
var lastMouse, lastOrientation, lastTouch;
var startbutton, pausebutton, stopbutton;
var starttime = 0;

// Initialisation on opening of the window
function init() {
	lastOrientation = {};
	window.addEventListener('resize', doLayout, false);
    startbutton = document.getElementById('start');
    pausebutton = document.getElementById('pause');
    stopbutton = document.getElementById('stop');
    startbutton.addEventListener('click', start, false);
    pausebutton.addEventListener('click', pause, false);
    stopbutton.addEventListener('click', reset, false);
	document.body.addEventListener('mousemove', onMouseMove, false);
	document.body.addEventListener('mousedown', onMouseDown, false);
	document.body.addEventListener('mouseup', onMouseUp, false);
	document.body.addEventListener('touchmove', onTouchMove, false);
	document.body.addEventListener('touchstart', onTouchDown, false);
	document.body.addEventListener('touchend', onTouchUp, false);
	window.addEventListener('deviceorientation', deviceOrientationTest, false);
	lastMouse = {x:0, y:0};
	lastTouch = {x:0, y:0};
	mouseDownInsideball = false;
	touchDownInsideball = false;
	doLayout(document);
}

function addListeners() {

    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('mousedown', onMouseDown, false);
    document.addEventListener('mouseup', onMouseUp, false);
    document.addEventListener('touchmove', onTouchMove, false);
    document.addEventListener('touchstart', onTouchDown, false);
    document.addEventListener('touchend', onTouchUp, false);
    window.addEventListener('deviceorientation', deviceOrientationTest, false);

}

function removeListeners() {
    document.removeEventListener('mousemove', onMouseMove, false);
    document.removeEventListener('mousedown', onMouseDown, false);
    document.removeEventListener('mouseup', onMouseUp, false);
    document.removeEventListener('touchmove', onTouchMove, false);
    document.removeEventListener('touchstart', onTouchDown, false);
    document.removeEventListener('touchend', onTouchUp, false);
    window.removeEventListener('deviceorientation', onDeviceOrientationChange, false);
    clearInterval(movementTimer);
}

// Does the gyroscope or accelerometer actually work?
function deviceOrientationTest(event) {
	window.removeEventListener('deviceorientation', deviceOrientationTest);
	if (event.beta != null && event.gamma != null) {
		window.addEventListener('deviceorientation', onDeviceOrientationChange, false);
		movementTimer = setInterval(onRenderUpdate, 10); 
	}
}


function doLayout(event) {
	winW = window.innerWidth;
	winH = window.innerHeight-(window.innerHeight*10/100);
    var maxheight = window.innerHeight*5/100;
	var surface = document.getElementById('surface');
	surface.width = winW;
	surface.height = winH;
	var radius = 7;
	ball = {	radius:radius,
				x:Math.round(winW/2),
				y:Math.round(winH/2),
				color:'rgba(255, 0, 0, 255)'};
    var xrand = Math.floor((Math.random()*(winW-15))+15);
    var yrand = Math.floor((Math.random()*(winH-maxheight-15))+maxheight);
    hole = {    radius:radius+12,
                x:xrand,
                y:yrand,
                color:'rgba(255,255,255,255)'};

    renderHole();
	renderBall();

}
	
function renderBall() {

    var surface = document.getElementById('surface');
    var context = surface.getContext('2d');

    context.beginPath();
	context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
	context.fillStyle = ball.color;
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = ball.color;
	context.stroke();		
}

function renderHole() {
    var surface = document.getElementById('surface');
    var context = surface.getContext('2d');
    context.clearRect(0, 0, surface.width, surface.height);

    context.beginPath();
    context.arc(hole.x, hole.y, hole.radius, 0, 2 * Math.PI, false);
    context.fillStyle = hole.color;
    context.fill();
    context.lineWidth = 3;
    context.strokeStyle = 'black';
    context.stroke();
}

function detectWonState(){
    if(ball.x + ball.radius < hole.x + hole.radius
        && ball.x - ball.radius > hole.x - hole.radius){
        if(ball.y + ball.radius < hole.y + hole.radius
            && ball.y - ball.radius > hole.y - hole.radius){
            alert("Congratulations, you won the game in " + document.getElementById('chrono').innerHTML + " minutes!");
            init();
            reset();
        }
    }
}

function onRenderUpdate(event) {
	var xDelta, yDelta;
	switch (window.orientation) {
		case 0: // portrait - normal
			xDelta = lastOrientation.gamma;
			yDelta = lastOrientation.beta;
			break;
		case 180: // portrait - upside down
			xDelta = lastOrientation.gamma * -1;
			yDelta = lastOrientation.beta * -1;
			break;
		case 90: // landscape - bottom right
			xDelta = lastOrientation.beta;
			yDelta = lastOrientation.gamma * -1;
			break;
		case -90: // landscape - bottom left
			xDelta = lastOrientation.beta * -1;
			yDelta = lastOrientation.gamma;
			break;
		default:
			xDelta = lastOrientation.gamma;
			yDelta = lastOrientation.beta;
	}
	moveBall(xDelta, yDelta);
}

function moveBall(xDelta, yDelta) {
    if(starttime == 1){
        var xtemp = ball.x +xDelta;
        var ytemp = ball.y +yDelta;
        if(xtemp > ball.radius && xtemp < (winW - ball.radius)) {
            ball.x+= xDelta;
        }
        else if(xtemp <= ball.radius){
            ball.x = ball.radius;
        }
        else if(xtemp >= winW - ball.radius){
            ball.x = winW - ball.radius;
        }

        if(ytemp > ball.radius && ytemp < (winH - ball.radius)) {
            ball.y+= yDelta;
        }
        else if(ytemp <= ball.radius){
            ball.y = ball.radius;
        }
        else if(ytemp >= winH - ball.radius){
            ball.y = winH - ball.radius;
        }

        renderHole();
	renderBall();

    detectWonState();
    }
}

function onMouseMove(event) {
	if(mouseDownInsideball){
		var xDelta, yDelta;
		xDelta = event.clientX - lastMouse.x;
		yDelta = event.clientY - lastMouse.y;
		moveBall(xDelta, yDelta);
		lastMouse.x = event.clientX;
		lastMouse.y = event.clientY;
	}
}

function onMouseDown(event) {
	var x = event.clientX;
	var y = event.clientY;
	if(	x > ball.x - ball.radius &&
		x < ball.x + ball.radius &&
		y > ball.y - ball.radius &&
		y < ball.y + ball.radius){
		mouseDownInsideball = true;
		lastMouse.x = x;
		lastMouse.y = y;
	} else {
		mouseDownInsideball = false;
	}
} 

function onMouseUp(event) {
	mouseDownInsideball = false;
}

function onTouchMove(event) {
	event.preventDefault();	
	if(touchDownInsideball){
		var touches = event.changedTouches;
		var xav = 0;
		var yav = 0;
		for (var i=0; i < touches.length; i++) {
			var x = touches[i].pageX;
			var y =	touches[i].pageY;
			xav += x;
			yav += y;
		}
		xav /= touches.length;
		yav /= touches.length;
		var xDelta, yDelta;

		xDelta = xav - lastTouch.x;
		yDelta = yav - lastTouch.y;
		moveBall(xDelta, yDelta);
		lastTouch.x = xav;
		lastTouch.y = yav;
	}
}

function onTouchDown(event) {
	event.preventDefault();
	touchDownInsideball = false;
	var touches = event.changedTouches;
	for (var i=0; i < touches.length && !touchDownInsideball; i++) {
		var x = touches[i].pageX;
		var y = touches[i].pageY;
		if(	x > ball.x - ball.radius &&
			x < ball.x + ball.radius &&
			y > ball.y - ball.radius &&
			y < ball.y + ball.radius){
			touchDownInsideball = true;		
			lastTouch.x = x;
			lastTouch.y = y;			
		}
	}
} 

function onTouchUp(event) {
	touchDownInsideball = false;
}

function onDeviceOrientationChange(event) {
	lastOrientation.gamma = event.gamma;
	lastOrientation.beta = event.beta;
}

function start() {
    if(starttime == 0){
        addListeners();
        starttime = 1;
        chrono();
    }

}
function pause() {
    if(starttime == 1){
        removeListeners();
        starttime = 0;
    }
}
function reset()
{
    removeListeners();
    seconds = 0;
    minutes = 0;
    starttime = 0;
    document.getElementById('chrono').innerHTML = '0' + minutes + ':0'+ seconds;
    init();
}