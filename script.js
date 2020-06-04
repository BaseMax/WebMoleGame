// Max Base
// https://github.com/BaseMax/WebMoleGame
// var body=document.querySelector("body");
var score=0;
var win=document.querySelector("#win");
var container=document.querySelector("#container");
var worm=container.querySelector("#worm");
var holes=document.querySelectorAll(".hole");
const TIME=2000;
const TIME_OF_A_MOLE=5000;
const TIME_SHOW_GONE=500;
const TIME_SHOW_LEAVING=200;
const TIME_SHOW_SADLY=2000;
const TIME_SHOW_FED=1000;
const TIME_SHOW_WORM=2000;
var statusHoles=[];
if(!Element.prototype.triggerEvent) {
	Element.prototype.triggerEvent = function(eventName) {
		var event;
		if(document.createEvent) {
			// Ref: https://developer.mozilla.org/en-US/docs/Web/API/Document/createEvent
			// Note: Many methods used with createEvent, such as initCustomEvent, are deprecated. Use event constructors instead.
			event = document.createEvent("HTMLEvents");
			event.initEvent(eventName, true, true);
		}
		else {
			event = document.createEventObject();
			event.eventType = eventName;
		}
		event.eventName = eventName;
		if(document.createEvent) {
			this.dispatchEvent(event);
		}
		else {
			this.fireEvent("on" + event.eventType, event);
		}
	};
}
function showHole() {
	var random=Math.floor((Math.random() * 10) + 1)-1;
	var hole=holes[random];
	var image=hole.querySelector(".image");
	if(image.classList.contains("gone")) {
		image.classList.remove("gone");
		image.classList.remove("sad");
		image.classList.remove("fed");
		image.classList.add("hungry");
		if(Math.random() >= 0.8) { // ~ 20%
			image.classList.add("king");
		}
		statusHoles[random]["timer"]=setTimeout(function() {
			statusHoles[random]={};
			image.classList.add("sad");
			image.classList.remove("hungry");
			image.triggerEvent("mouseout");
			/*
			Other solutions:
				1: 	const mouseoutEvent = new Event('mouseout');
					image.dispatchEvent(mouseoutEvent);
				2:	image.dispatchEvent(new MouseEvent('mouseout', { 'bubbles': true }));
			*/
			setTimeout(function() {
				image.classList.add("gone");
			}, TIME_SHOW_SADLY);
		}, TIME_OF_A_MOLE);
	}
}
function updateScore(value) {
	score+=value;
	if(value > 0) {
		console.log("SUCCESS / Score: "+score);
	}
	else {
		console.log("FAIL / Score: "+score);
	}
	worm.style.width=(score*10)+"%";
	if(score >= 10) {
		setTimeout(function() {
			container.classList.add("gone");
			win.classList.remove("gone");
		}, TIME_SHOW_WORM);
	}
}
window.addEventListener("load", function() {
	holes.forEach(function(hole) {
		var id=parseInt(hole.getAttribute("data-id"));
		var image=hole.querySelector(".image");
		image.addEventListener("mouseover", function(e) {
			if(e.target.classList.contains("hungry") && !e.target.classList.contains("sad")) {
				container.style.cursor="url('images/cursor-worm.png'), auto";
			}
		});
		image.addEventListener("mouseout", function(e) {
			container.style.cursor="url('images/cursor.png'), auto";
		});
		image.addEventListener("click", function(e) {
			id=parseInt(this.parentNode.parentNode.getAttribute("data-id"));
			if(statusHoles[id-1] !== undefined) {
				id=id-1;
				if(statusHoles[id]["timer"]) {
					clearTimeout(statusHoles[id]["timer"]);
					statusHoles[id]={};
					updateScore(+1);
					image.classList.remove("hungry");
					image.classList.add("fed");
					setTimeout(function() {
						image.classList.add("gone");
						image.classList.remove("fed");
						image.classList.add("hungry");
					}, TIME_SHOW_FED);
				}
				else {
					// SKIP: your mole is not hungry, he is sad!
				}
			}
			else {
				// SKIP: game did not start yet!
			}
		});
		setTimeout(function() {
			image.classList.add("leaving");
			image.classList.remove("hungry");
			setTimeout(function() {
				image.classList.add("gone");
				image.classList.add("hungry");
				image.classList.remove("leaving");
				statusHoles.push({});
			}, TIME_SHOW_GONE);
		}, TIME_SHOW_LEAVING);
	});
});
setTimeout(function() {
	setInterval(showHole, 1+Math.random() * TIME);
}, TIME_SHOW_GONE+TIME_SHOW_LEAVING);
