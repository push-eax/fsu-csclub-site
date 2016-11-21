/*
Global variables

positiondownx
	position of the mouse (x-coord) on window move click
	
positiondowny
	position of the mouse (y-coord) on window move click

positionupx
	position of the mouse (x-coord) on mouseup

positionupy
	position of the mouse (y-coord) on mouseup

wtomove
	global variable representing a window object
	used to define which window should be moved when a window
	needs moving. Otherwise, not really used (right now)

justmoved
	true on mousedown before mouseup when moving a window.
	A more accurate name might be currentlymovingwindow, but
	that's pretty verbose and I'm too lazy to either come up 
	with a better name or change this one now that it works.
*/
var positiondownx;
var positiondowny;
var positionupx;
var positionupy;
var wtomove;
var justmoved = false;
var moveinterval;

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

function updatepos(ev){
	if(justmoved == true){
		positionupx = ev.pageX;
		positionupy = ev.pageY;
		movewindow(wtomove, positionupx - positiondownx, positionupy - positiondowny);
	}
}

/*
clickdown(ev, element)

Used as an event handling function for when someone clicks
the title bar of a window expecting to be able to move it.

Arguments:
	ev
		event object.
		Supplied by the event itself, should not be manual.
		Assumes mouse event.
	
	element
		element object, usually a div but not picky
		Supplied by the addWindowListeners(element) function,
		this defines what should be moved. It is currently
		designed around the assumption that the left and top
		style parameters work, meaning a position mode is set
		other than the default. Works with class=window.
*/
function clickdown(ev,element){
	positiondownx = ev.pageX;
	positiondowny = ev.pageY;
	wtomove = element;
	justmoved = true;
	//moveinterval = setInterval(function(){updatepos(ev)}, 150);
	console.log ("Click registered with coords: ", positiondownx, positiondowny);
}

/*
clickup(ev)

Used as another event handler, for when someone releases the
mouse. It picks up whether or not there are any drawn windows,
and should be used for window management tasks. At the time of
writing it checks to see if the window should be moved, and
if so, it moves the window. Otherwise, it does nothing substantial.

Arguments:
	ev
		event object.
		Supplied by the event itself, should not be manual.
		Assumes mouse event.
*/
function clickup(ev){
	positionupx = ev.pageX;
	positionupy = ev.pageY;
	if(justmoved == true){
		//clearInterval(moveinterval);
		movewindow(wtomove, positionupx - positiondownx, positionupy - positiondowny);
		justmoved = false;
	}
	console.log("mouseup at ", positionupx, positionupy, positiondownx, positiondowny);
}

/*
addWindowListeners(currentwindow)

Adds event handlers to the current window object.

Arguments:
	currentwindow
		current window element. Used to identify the window
		later, should be a JS DOM element. When in doubt, this
		can be gotten with document.getElementById()
*/
function addWindowListeners(currentwindow){
	currentwindow.onmousedown = function(event){clickdown(event, currentwindow)};
}

/*
addwindow(id)

Nice, fluffy way to get basic window creation macros out of the way.

Arguments:
	id
		Text string for the id of the window.
*/
function addwindow(id){
	newwindow = document.createElement("div");
	newwindow.setAttribute("class", "window")
	newwindow.setAttribute("id", id)
	addWindowListeners(newwindow)
	document.body.appendChild(newwindow);
	return newwindow;
}

/*
Final event handlers

onmouseup
	handles when the mouse is lifted, calling clickup() and
	allowing any ongoing move operations to finish.
*/
document.onmouseup   = function(event){clickup  (event)};
document.onmousemove = function(e)    {updatepos(e)    };

