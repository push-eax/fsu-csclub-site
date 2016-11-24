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

windowmovetransparancy
	opacity value of the windows as they are moved.

windowregister
	An array containing all active windows, added to every
	time windowAdd() is created. It is used to push all 
	windows back a z-index when one is selected.
*/
var positiondownx;
var positiondowny;
var positionupx;
var positionupy;
var wtomove;
var justmoved = false;
var windowmovetransparancy=0.75;
var windowregister = [];

/*
movewindow(currentwindow, increasex, increasy)

Used to move a window by a certain offset X and Y.

Arguments:
	currentwindow
		window object to move
	
	increasex
		X-increase. Number value, no text included.
		Though the function does directly modify CSS, the
		string parts are added as part of the function.
	
	increasey
		Y-increase. Number value, no text included.
		See increasex for more details.
*/
function movewindow(currentwindow, increasex, increasey){
	var cwbounds = currentwindow.toplevel.getBoundingClientRect();
	var scbounds = document.body.getBoundingClientRect();
	var newx = cwbounds.left + increasex;
	var newy = cwbounds.top + increasey;
	if(newx>0 && cwbounds.right+increasex < scbounds.right){
		currentwindow.toplevel.style.left = newx + "px";
	}
	if(newy>0 && cwbounds.bottom + increasey < scbounds.bottom){
		currentwindow.toplevel.style.top = newy + "px";
	}
}

/*
changeWindowSize(currentwindow, increasex, increasey)

Changes the size of a window by increments of increasex
and increasey.

Arguments:
	currentwindow
		window object to resize
	
	increasex
		amount of width to add
	
	increasey
		amount of height to add
*/
function changeWindowSize(currentwindow, increasex, increasey){
	var cwbounds = currentwindow.toplevel.getBoundingClientRect();
	var cobounds = currentwindow.body.getBoundingClientRect();
	var scbounds = document.body.getBoundingClientRect();
	var newx = cwbounds.right - cwbounds.left;
	var newy = cobounds.bottom - cobounds.top;
	newx += increasex;
	newy += increasey;
	if(newx>0 && cwbounds.right+increasex < scbounds.right){
		currentwindow.toplevel.style.width = newx + "px";
	}
	if(newy>0 && cwbounds.bottom + increasey < scbounds.bottom){
		currentwindow.body.style.height = newy + "px";
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
	//Variables to move in each direction
	var pmovex
	var pmovey
	//if we're actually moving a window
	if(justmoved == true){
		//Find out by how much
		pmovex = ev.pageX - positiondownx
		pmovey = ev.pageY - positiondowny
		//Then take new values for mousedown so we're not
		//flying off into space by constantly adding to
		//the increase amount
		positiondownx = ev.pageX
		positiondowny = ev.pageY
		//and move the window.
		movewindow(wtomove, pmovex, pmovey);
		//since the window has actually moved, make it translucent
		wtomove.toplevel.style.opacity=windowmovetransparancy;
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
	//record our pointer position for moving
	positiondownx = ev.pageX;
	positiondowny = ev.pageY;
	//and record the window element we are about to move
	wtomove = element;
	//and tell the program we might move a window here
	justmoved = true;
	//lower all the windows and raise just this one
	lowerAll()
	element.toplevel.style.zIndex=3;
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
	//records the mouseup position
	positionupx = ev.pageX;
	positionupy = ev.pageY;
	//does some stuff if we clicked a window.
	if(justmoved == true){
		//move the window by any difference in position
		movewindow(wtomove, positionupx - positiondownx, positionupy - positiondowny);
		//make the window opaque whether or not it already is
		wtomove.toplevel.style.opacity=1;
		//and tell the program no window is being moved.
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
	currentwindow.toplevel.onmousedown = function(event){clickdown(event, currentwindow)};
}

/*
closeWindow(window)

Closes the window based on its window object.

Arguments:
	window
		A window object as returned by addWindow()
*/
function closeWindow(window){
	for (var i = 0; i<windowregister.length; i++){
		if(windowregister[i] == window){
			windowregister[i]={type: "closed"};
			if(typeof windowregister[i+1] != 'undefined'){
				windowregister[i] = windowregister[i+1]
			}
			if(typeof windowregister == 'undefined'){
				windowregister = []
			}
		}
	}
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
	window.body.appendChild(window.grabhandle);
}

/*
lowerAll()

Lowers all windows to z-index 2 from 3.
*/
function lowerAll(){
	for(var i = 0; i<windowregister.length; i++){
		if(typeof windowregister[i].toplevel !='undefined'){
			windowregister[i].toplevel.style.zIndex=2;
		}
	}
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
function addWindow(title,width){
	//We define the toplevel element as newwindow
	var newwindow = document.createElement("div");
	//set its class to window
	newwindow.setAttribute("class", "window")
	//set its id to whatever the user entered.
	//newwindow.setAttribute("id", id)
	//And its width as well...
	newwindow.style.width = width;
	//and add it to the document body.
	document.body.appendChild(newwindow);
	
	//Similar deal for the title, only now we also set the contents
	//right away
	var windowtitle = document.createElement("div");
	windowtitle.setAttribute("class", "windowtitle");
	//windowtitle.setAttribute("id",    id+"_title");
	//here be content setting
	windowtitle.innerHTML=title;
	//and we append it to the window element instead of the body
	newwindow.appendChild(windowtitle);
	
	//Now we create the window body element
	//where all the user's stuff is
	var windowbody = document.createElement("div");
	windowbody.setAttribute("class", "windowbody");
	//windowbody.setAttribute("id", id+"_body");
	newwindow.appendChild(windowbody);
	
	//And add a close button. This is tricky, because the close
	//button needs to be aware of what window we want to close
	//ahead of time.
	var windowclose = document.createElement("button")
	windowclose.setAttribute("class", "closebutton");
	//windowclose.setAttribute("id", id+"_close");
	//For now we give it a stylish but uninspired X in lieu of a
	//fancier close button
	windowclose.innerHTML="<img class=closebutton_icon src=CloseButton.png></img>";
	newwindow.appendChild(windowclose);
	
	var grabhandles = document.createElement("div")
	grabhandles.setAttribute("class","grabhandle");
	windowbody.appendChild(grabhandles);
	
	var grabhandleimage = document.createElement("img");
	grabhandleimage.setAttribute("class", "ghimage");
	grabhandleimage.setAttribute("src", "Grabhandle.png");
	grabhandleimage.setAttribute("draggable", "false");
	grabhandleimage.setAttribute("onmousedown", "return false");
	grabhandles.appendChild(grabhandleimage);
	
	//And define a window object. This then gets used to connect
	//the close button's signal, so we know which elements to
	//destroy.
	var windowobject = {toplevel: newwindow, title: windowtitle, body: windowbody, closebutton: windowclose, grabhandle: grabhandles};
	windowclose.onclick=function(){closeWindow(windowobject)};
	windowregister.push(windowobject);
	//connect our listeners,
	addWindowListeners(windowobject)
	if(typeof windowregister != 'undefined'){
		lowerAll()
	}
	windowobject.toplevel.style.zIndex = 3;
	
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
