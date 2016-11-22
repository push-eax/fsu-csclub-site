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
var windowmovetransparancy=0.75;

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
	cwbounds = currentwindow.getBoundingClientRect();
	scbounds = document.body.getBoundingClientRect();
	newx = cwbounds.left + increasex;
	newy = cwbounds.top + increasey;
	if(newx>0 && cwbounds.right+increasex < scbounds.right){
		currentwindow.style.left = newx + "px";
	}
	if(newy>0 && cwbounds.bottom + increasey < scbounds.bottom){
		currentwindow.style.top = newy + "px";
	}
}

/*
updatepos(ev)

Used to update a window position as it's being dragged

Arguments:
	ev
		Event which triggered this state update
		note this is not meant to be invoked, only used as
		an event handler.
*/
function updatepos(ev){
	var pmovex
	var pmovey
	if(justmoved == true){
		pmovex = ev.pageX - positiondownx
		pmovey = ev.pageY - positiondowny
		positiondownx = ev.pageX
		positiondowny = ev.pageY
		movewindow(wtomove, pmovex, pmovey);
		wtomove.style.opacity=windowmovetransparancy;
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
		wtomove.style.opacity=1;
		justmoved = false;
	}
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
closeWindow(window)

Closes the window based on its window object.

Arguments:
	window
		A window object as returned by addWindow()
*/
function closeWindow(window){
	//remove the title
	window.toplevel.removeChild(window.title);
	delete window.title;
	//then the body
	window.toplevel.removeChild(window.body);
	delete window.body;
	//then the close button
	window.toplevel.removeChild(window.closebutton);
	delete window.closebutton;
	//then the toplevel parent which they were rendered under.
	//May only need to do this, but I'm thorough.
	document.body.removeChild(window.toplevel);
	delete window.toplevel;
	delete window;
}

/*
setWindowContents(window, stuff)

Sets the window's body contents.

Arguments:
	window
		a window object
	
	stuff
		what to put in the body

Note that for now this is a convienience class. It may be more important
if an issue with just throwing stuff inside arises.
*/
function setWindowContents(window, stuff){
	window.body.innerHTML=stuff;
}

/*
addWindow(id)

Nice, fluffy way to get basic window creation macros out of the way.

Arguments:
	id
		Text string for the id of the window.

Returns:
	window
		Array of three objects:
		[0] = the toplevel window element, including the titlebar
		[1] = the titlebar text
		[2] = the body of the window. This is the only one that should be used directly.
		      it still should not be if possible.
		[3] = the close button
*/
function addWindow(id,title,width){
	//We define the toplevel element as newwindow
	var newwindow = document.createElement("div");
	//set its class to window
	newwindow.setAttribute("class", "window")
	//set its id to whatever the user entered.
	newwindow.setAttribute("id", id)
	//And its width as well...
	newwindow.style.width = width;
	//connect our listeners,
	addWindowListeners(newwindow)
	//and add it to the document body.
	document.body.appendChild(newwindow);
	
	//Similar deal for the title, only now we also set the contents
	//right away
	var windowtitle = document.createElement("div");
	windowtitle.setAttribute("class", "windowtitle");
	windowtitle.setAttribute("id",    id+"_title");
	//here be content setting
	windowtitle.innerHTML=title;
	//and we append it to the window element instead of the body
	newwindow.appendChild(windowtitle);
	
	//Now we create the window body element
	//where all the user's stuff is
	var windowbody = document.createElement("div");
	windowbody.setAttribute("class", "windowbody");
	windowbody.setAttribute("id", id+"_body");
	newwindow.appendChild(windowbody);
	
	//And add a close button. This is tricky, because the close
	//button needs to be aware of what window we want to close
	//ahead of time.
	var windowclose = document.createElement("button")
	windowclose.setAttribute("class", "closebutton");
	windowclose.setAttribute("id", id+"_close");
	//For now we give it a stylish but uninspired X in lieu of a
	//fancier close button
	windowclose.innerHTML="X";
	newwindow.appendChild(windowclose);
	
	//And define a window object. This then gets used to connect
	//the close button's signal, so we know which elements to
	//destroy.
	var windowobject = {toplevel: newwindow, title: windowtitle, body: windowbody, closebutton: windowclose};
	windowclose.onclick=function(){closeWindow(windowobject)};
	
	//Then return our windowobject to the user, like they requested.
	return windowobject;
	//We are now rendering a functional window.
}

/*
Final event handlers

onmouseup
	handles when the mouse is lifted, calling clickup() and
	allowing any ongoing move operations to finish.
*/
document.onmouseup   = function(event){clickup  (event)};
document.onmousemove = function(e)    {updatepos(e)    };
