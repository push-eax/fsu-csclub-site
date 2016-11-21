/*
movewindow(currentwindow, increasex, increasy)

Used to move a window by a certain offset X and Y.

Arguments:
	currentwindow
		Document object of the current window.
		Use document.getElement... to get this object.
	
	increasex
		X-increase. Number value, no text included.
		Though the function does directly modify CSS, the
		string parts are added as part of the function.
	
	increasey
		Y-increase. Number value, no text included.
		See increasex for more details.
*/
function movewindow(currentwindow, increasex, increasey){
	//currentwindow = document.getElementById(windowid);
	cwbounds = currentwindow.getBoundingClientRect();
	newx = cwbounds.left + increasex;
	newy = cwbounds.top + increasey;
	console.log(newx, newy, cwbounds.left, cwbounds.top);
	currentwindow.style.left = newx + "px";
	currentwindow.style.top = newy + "px";
}

var positiondownx;
var positiondowny;
var positionupx;
var positionupy;

function clickdown(ev){
	positiondownx = ev.pageX;
	positiondowny = ev.pageY;
	console.log ("Click registered with coords: ", positiondownx, positiondowny);
}
function clickup(ev,element){
	positionupx = ev.pageX;
	positionupy = ev.pageY;
	movewindow(element, positionupx - positiondownx, positionupy - positiondowny);
	console.log("mouseup at ", positionupx, positionupy, positiondownx, positiondowny);
}

function addWindowListeners(currentwindow){
	currentwindow.onmousedown = function(event){clickdown(event)};
	currentwindow.onmouseup   = function(event){clickup  (event, currentwindow)};
}
