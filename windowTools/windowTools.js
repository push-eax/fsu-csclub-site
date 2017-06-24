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

justresize
	tells the program we are looking to resize a window, so
	all events should send their diffrences of position to 
	adjust the size and not the position of a window.

windowmovetransparancy
	opacity value of the windows as they are moved.

windowregister
	An array containing all active windows, added to every
	time windowAdd() is created. It is used to push all 
	windows back a z-index when one is selected.

panel
	Variable which will represent our panel when we're done,
	allowing us to add to and manipulate it without re-
	fetching its DOM node.

minimizetime
	The longest amount of time the minimize or unminimze
	transition would take. Should never be any longer, since
	these animatiions interfere with moving windows.

minimizetransitiontime
	variable to define the minimize animation. When the minimize
	request is sent this becomes the value of window.toplevel.
	style.transition

minimizetransitionreset
	variable containing all the transition rules modified by the
	minimize transition, except with time set to 0 so as not to
	break window moving
	
winminwidth
	Minimum window width

ismobile
	Forwards compat with pageTools, tells the site we are not working in a mobile
	environment and therefore should execute wallpaper setting, etc.

onfinished
	A list of functions to start when the page finishes loading

wintoolscolors
	Colors that the script uses, for tasks like focus/unfocus and panel button management.
	Used as a way to make porting windowTools easier.
*/
var positiondownx;
var positiondowny;
var positionupx;
var positionupy;
var wtomove;
var justmoved = false;
var justresize = false;
var windowmovetransparancy=0.75;
var windowregister = [];
var panel;
var minimizetime = 250;
var minimizetransitiontime = "top 0.25s, right 0.25s, left 0.25s, width 0.125s, opacity 0.25s";
var minimizetransitionreset = "top 0s, right 0s, left 0s, width 0s, opacity 0.125s";
var winminwidth = 160;
var ismobile = false;
var onfinished = [];
var wintoolscolors = {lowerpanelcolor: "#daa00d", activepanelcolor: "#febe10", lowerwindowborder: 'black', minipanelcolor: 'grey'};
var maximizetransitiontime = "top 0.25s, right 0.25s, left 0.25s, width 0.125s";
var maximizetransitionreset = "top 0s, right 0s, left 0s, width 0s, opacity 0.125s";

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
	//client window bounaries: get the current dimensions of a window
	var cwbounds = currentwindow.toplevel.getBoundingClientRect();
	//screen boundaries: get the current dimensions of the screen
	var scbounds = document.body.getBoundingClientRect();
	//new X position (from top left corner)
	var newx = cwbounds.left + increasex;
	//new Y position (from top left corner)
	var newy = cwbounds.top + increasey;
	//now we make sure we're not running off the screen in the horizontal direction
	if(newx>0 && cwbounds.right+increasex < scbounds.right){
		currentwindow.toplevel.style.left = newx + "px";
	}
	//and try to make sure we don't run off the screen in the vertical direction
	//though the code for the bottom doesn't work right, not sure why.
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
	//client window bounaries: get the current dimensions of a window
	var cwbounds = currentwindow.toplevel.getBoundingClientRect();
	//but the body defines vertical, not the toplevel so get that too
	var cobounds = currentwindow.body.getBoundingClientRect();
	//screen boundaries: get the current dimensions of the screen
	var scbounds = document.body.getBoundingClientRect();
	//then get our actual width and height
	var newx = cwbounds.right - cwbounds.left;
	var newy = currentwindow.body.clientHeight-16; //Vertical padding *2, no clean way to do this automatically yet
	//add our increment
	newx += increasex;
	newy += increasey;
	if(newx <= winminwidth) newx = winminwidth;
	//then set this in the stylesheet.
	currentwindow.toplevel.style.width = newx + "px";
	currentwindow.body.style.height = newy + "px";
}

/*
 * maximize(window)
 *
 * Takes the window, sets its bounds to an approximation of the screen size
 *
 * Arguments:
 * 	window
 * 		The window to be maximized
 */
function maximize(window){
	window.toplevel.style.transition = maximizetransitiontime;
	//Window boundaries
	var winbounds    = window.toplevel.getBoundingClientRect();
	//Window body boundaries
	var winbodbounds = window.body.getBoundingClientRect();
	//Screen boundaries
	var scbounds     = document.body.getBoundingClientRect();
	//panel boundaries
	var panbounds    = panel.getBoundingClientRect();
	//Actual bounds
	var scleft       = scbounds.left;
	var scright      = scbounds.right;
	var sctop        = scbounds.top;
	var pantop       = panbounds.top;
	var scheight     = pantop - sctop;
	var winheight    = winbodbounds.bottom-winbodbounds.top;
	//Start saving the initial values
	window.maxtop    = winbounds.top;
	window.maxright  = winbounds.right;
	window.maxleft   = winbounds.left;
	window.maxheight = winheight;
	//set the maximized param to true
	window.maximized = true;
	//then start actually resizing things
	window.toplevel.style.left  = scleft;
	window.toplevel.style.right = scright;
	window.toplevel.style.top   = sctop;
	window.body.style.height    = scheight-48;
	window.toplevel.style.width = scbounds.right-scbounds.left;
	setTimeout(function(){window.toplevel.style.transition = maximizetransitionreset;}, minimizetime);
}

/*
 * restore(window)
 *
 * Takes a maximized window and restores it.
 *
 * Arguments:
 * 	window
 * 		window to be restore
 */
function restore(window){
	window.toplevel.style.transition = maximizetransitiontime;
	//Set the window.maximized property to false
	window.maximized = false;
	//Set our window size again
	window.toplevel.style.left = window.maxleft;
	window.toplevel.style.right = window.maxright;
	window.toplevel.style.top = window.maxtop;
	window.toplevel.style.width = window.maxright-window.maxleft;
	window.body.style.height = window.maxheight;
	setTimeout(function(){window.toplevel.style.transition = maximizetransitionreset;}, minimizetime);
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
	if(justresize == true){
		justmoved = false;
		//Find out by how much
		pmovex = ev.pageX - positiondownx
		pmovey = ev.pageY - positiondowny
		//Then take new values for mousedown so we're not
		//flying off into space by constantly adding to
		//the increase amount
		positiondownx = ev.pageX
		positiondowny = ev.pageY
		//since the window has actually moved, make it translucent
		wtomove.toplevel.style.opacity=windowmovetransparancy;
		for (var iii = 0; iii < wtomove.resizeEvent.length; iii++){
			wtomove.resizeEvent[iii](wtomove, pmovex, pmovey);
		}
	}
}

/*
clicktbar(ev, element)

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
function clicktbar(ev,element){
	//record our pointer position for moving
	positiondownx = ev.pageX;
	positiondowny = ev.pageY;
	//and record the window element we are about to move
	wtomove = element;
	//and tell the program we might move a window here
	justmoved = true;
}

/*
clickdown(ev, element)

Used as an event handling function for when someone clicks
a window for any reason. This does nothing but raise that
window.

Arguments:
	element
		element object, usually a div but not picky
		Supplied by the addWindowListeners(element) function,
		this defines what should be moved. It is currently
		designed around the assumption that the left and top
		style parameters work, meaning a position mode is set
		other than the default. Works with class=window.
*/
function clickdown(element){
	//lower all the windows and raise just this one
	raiseWindow(element)
}

/*
clickdialogdown(ev, element)

Used as an event handling function for when someone clicks
a window for any reason. This does nothing but raise that
window.

Arguments:
	element
		element object, usually a div but not picky
		Supplied by the addWindowListeners(element) function,
		this defines what should be moved. It is currently
		designed around the assumption that the left and top
		style parameters work, meaning a position mode is set
		other than the default. Works with class=window.
*/
function clickdialogdown(element){
	//lower all the windows and raise just this one
	raiseDialogWindow(element)
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
	if(justresize == true){
		//move the window by any difference in position
		changeWindowSize(wtomove, positionupx - positiondownx, positionupy - positiondowny);
		//make the window opaque whether or not it already is
		wtomove.toplevel.style.opacity=1;
		//and tell the program no window is being moved.
		justresize = false;
	}
}

/*
dragResize(ev, element)

function run when dragging an element on mouse move

Arguments:
	ev
		Event used to trigger the function
	
	element
		the window object we're moving
*/
function dragResize(ev, element){
	//record our pointer position for moving
	positiondownx = ev.pageX;
	positiondowny = ev.pageY;
	//and record the window element we are about to move
	wtomove = element;
	//and tell the program we might move a window here
	justmoved = false;
	//lower all the windows and raise just this one
	raiseWindow(element);
	justresize = true;
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
	//we need to handle when the window is clicked to move it
	//what's more important here is defning which window is clicked
	currentwindow.titleWidget.onmousedown = function(event){clicktbar(event, currentwindow)};
	currentwindow.toplevel.onmousedown    = function(event){clickdown(currentwindow)}
	//and when the grabhandle is clicked so we can resize the window
	currentwindow.grabhandle.onmousedown = function(event){dragResize(event, currentwindow)};
}

/*
addDialogWindowListeners(currentwindow)

Adds event handlers to the current dialog window object.

Arguments:
	currentwindow
		current window element. Used to identify the window
		later, should be a JS DOM element. When in doubt, this
		can be gotten with document.getElementById()
*/
function addDialogWindowListeners(currentwindow){
	//we need to handle when the window is clicked to move it
	//what's more important here is defning which window is clicked
	currentwindow.titleWidget.onmousedown = function(event){clicktbar(event, currentwindow)};
	currentwindow.toplevel.onmousedown    = function(event){clickdialogdown(currentwindow)}
}

/*
closeWindow(window)

Closes the window based on its window object.

Arguments:
	window
		A window object as returned by addWindow()
*/
function closeWindow(window){
	window.toplevel.setAttribute("class", "window_close");
	setTimeout(function(){
	//We need to search the window register for this window to
	//tell it that we've closed it.
	for (var i = 0; i<windowregister.length; i++){
		if(windowregister[i] == window){
			windowregister[i]={type: "closed"};
			if(typeof windowregister[i+1] != 'undefined'){
				windowregister[i] = windowregister[i+1]
			}
			//in old variants, this would break the window register.
			//now that we're not dealing with deleting the object
			//directly, it's unlikely to happen, but it's still good
			//to make sure the windowregister is still an array
			//instead of something stupid like a nullptr
			if(typeof windowregister == 'undefined'){
				windowregister = []
			}
		}
	}
	//remove the title
	window.toplevel.removeChild(window.titleWidget);
	delete window.titleWidget;
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
	//Last step:
	//remove the panel button
	panel.removeChild(window.panelButton)
	delete window.panelButton
	//delete window;
	}, 256);
}

/*
closeWindow(window)

Closes the window based on its window object.

Arguments:
	window
		A window object as returned by addWindow()
*/
function closeDialogWindow(window){
	window.toplevel.setAttribute("class", "window_close");
	setTimeout(function(){
	//remove the title
	window.toplevel.removeChild(window.titleWidget);
	delete window.titleWidget;
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
	//delete window;
	}, 256);
}

/*
setWindowContents(window, stuff)

Sets the window's body contents.

Arguments:
	window
		a window object
	
	stuff
		what to put in the body

This is a required step because setting innerHTML directly causes
problems with window resizing. If you try to set it on its own, the
grabhandle for corner resizing disappears making it impossible to
resize the window.
*/
function setWindowContents(window, stuff){
	window.body.innerHTML=stuff;
	window.body.appendChild(window.grabhandle);
}

/*
setWidgetSpace(window, wspace)

Adds a child object to the window's body space. Built primarily
to accomodate JS-based widget toolkits. The widgetTools.js toolkit
uses an object called the widget space which acts as the parent for
all widgets in an area. They then add themselves to the widget
space. This encapsulation works because it runs in a contained
space that doesn't actually need access to any higher-level tag,
and therefore can't screw with things it shouldn't like the window
body object.

Arguments:
	window
		the current window object.

	wspace
		the object to add to the window
*/
function setWidgetSpace(window, wspace){
	window.body.appendChild(wspace);
}

/*
lowerAll()

Lowers all windows to z-index 2.
*/
function lowerAll(){
	for(var i = 0; i<windowregister.length; i++){
		if(typeof windowregister[i].toplevel !='undefined'){
			if(windowregister[i].type == 'active'){
				windowregister[i].toplevel.setAttribute("class", "window_disabled");
				windowregister[i].toplevel.style.zIndex=2;
				windowregister[i].toplevel.style.backgroundColor=wintoolscolors.lowerwindowborder;
				windowregister[i].panelButton.style.background=wintoolscolors.lowerpanelcolor;
				windowregister[i].type='inactive';
			}
		}
	}
}

/*
raiseWindow(window)

lowers all windows and raises the one selected

Arguments:
	window
		which window should be raised
*/
function raiseWindow(window){
	lowerAll();
	window.toplevel.style.opacity=1;
	window.toplevel.setAttribute("class", "window");
	window.toplevel.style.zIndex=3;
	window.type='active';
	window.panelButton.style.background='linear-gradient(to top, '+wintoolscolors.activepanelcolor+', '+wintoolscolors.lowerpanelcolor+')';
}

/*
raiseDialogWindow(window)

lowers all windows and raises the one selected

Arguments:
	window
		which window should be raised
*/
function raiseDialogWindow(window){
	lowerAll();
	window.toplevel.style.opacity=1;
	window.toplevel.setAttribute("class", "dialogwindow");
	window.toplevel.style.zIndex=3;
	window.type='active';
}

/*
clickpanelbutton(window)

helper function to determine what to do when the panel button
is clicked for a window. Checks the window state and executes
the appropriate action.

Arguments:
	window
		window object to manipulate
*/
function clickPanelButton(window){
	if(window.type=='active'){
		minimize(window);
	} else {
		if(window.type == 'inactive'){
			raiseWindow(window);
		} else {
			if(window.type == 'minimized'){
				restoreSize(window);
			}
		}
	}
}

/*
addPanelButton(window)

Adds a button to the panel corresponding to the window.

Arguments:
	window
		the window object we are adding
*/
function addPanelButton(window){
	var newbutton = document.createElement("button");
	newbutton.innerHTML = window.titleText;
	newbutton.setAttribute("class", "windowButton");
	newbutton.onclick=function(){clickPanelButton(window)};
	panel.appendChild(newbutton);
	return newbutton;
}

/*
minimize(window)

hides a window by moving it to the bottom of the screen and
storing its coordinates so we can restore it later

Arguments:
	window
		window object to minimize
*/
function minimize(window){
	var panbounds                       = window.panelButton.getBoundingClientRect();
	var winbounds                       = window.toplevel.getBoundingClientRect();
	window.toplevel.style.transition    = minimizetransitiontime;
	window.mintop                       = winbounds.top;
	window.minright                     = winbounds.right;
	window.minleft                      = winbounds.left;
	window.toplevel.style.left          = panbounds.left;
	window.toplevel.style.right         = panbounds.right;
	window.toplevel.style.top           = panbounds.top;
	window.minwidth                     = window.toplevel.style.width;
 	window.toplevel.style.width         = 200;
 	window.toplevel.style.opacity       = 0;
	window.type                         = 'minimized'
	window.panelButton.style.background = wintoolscolors.minipanelcolor;
}

/*
restoreSize(window)

restores a minimized window to its original coordinates

Arguments:
	window
		window object to restore
*/
function restoreSize(window){
	window.toplevel.style.transition = minimizetransitiontime;
	window.toplevel.style.top        = window.mintop;
	window.toplevel.style.right      = window.minright;
	window.toplevel.style.left       = window.minleft;
	window.toplevel.style.width      = window.minwidth;
	setTimeout(function(){window.toplevel.style.transition = minimizetransitionreset;}, minimizetime);
	raiseWindow(window)
}

function handlemax(window){
	if(window.maximized===false)
		maximize(window);
	else
		restore(window);
}

/*
addWindow(title, width)

Nice, fluffy way to get basic window creation macros out of the way. Creates a full window
with resize, minimize, close, move, widgetspace and HTML functions.

Arguments:
	id
		Text string for the id of the window.

Returns:
	window
		Special window object. If you scroll down, you can see what is currently placed in
		a window. There are quite a few things, and some of them are needed only once or
		twice.
*/
function addWindow(title,width){
	//Our window is the only window we care about now
	lowerAll();
	//We define the toplevel element as newwindow
	var newwindow = document.createElement("div");
	//set its class to window
	newwindow.setAttribute("class", "window")
	//set its id to whatever the user entered.
	//newwindow.setAttribute("id", id)
	//And its width as well...
	newwindow.style.width = width;
	newwindow.style.left = "10px";
	newwindow.style.right = (10+width)+"px";
	newwindow.style.top = "10px";
	//Minimize only works if we have a transition property ready to go
	newwindow.style.transition = minimizetransitionreset;
	//and add it to the document body.
	document.body.appendChild(newwindow);
	
	//Similar deal for the title, only now we also set the contents
	//right away
	var windowtitle = document.createElement("div");
	windowtitle.setAttribute("class", "windowtitle");
	windowtitle.setAttribute("draggable", "false");
	windowtitle.setAttribute("onmousedown", "return false");
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
	//For now we give it a stylish but uninspired X in lieu of a
	//fancier close button
	windowclose.innerHTML="<img class=closebutton_icon src=windowTools/CloseButton.png></img>";
	newwindow.appendChild(windowclose);

	//And a maximize button, since that's been added
	//Basically copy close again and mod it
	var windowmax = document.createElement("button")
	windowmax.setAttribute("class", "maximizebutton");
	//For now we give it a stylish but uninspired box in lieu of a
	//fancier max button
	windowmax.innerHTML="<img class=maximizebutton_icon src=windowTools/MaximizeButton.png></img>";
	newwindow.appendChild(windowmax);
	
	//And now that minimization works, we may as well add a minimize button.
	//The button needs to be aware of the same stuff as close
	var windowminimize = document.createElement("button");
	windowminimize.setAttribute("class", "minimizebutton");
	//And this one uses an uninspired - in lieu of a fancier
	//icon to take its place
	windowminimize.innerHTML="<img class=minimizebutton_icon src=windowTools/MinimizeButton.png></img>";
	newwindow.appendChild(windowminimize);
	
	//grabhandles are the little corner buttons used to resize a
	//window cleanly.
	var grabhandles = document.createElement("div")
	grabhandles.setAttribute("class","grabhandle");
	windowbody.appendChild(grabhandles);
	
	//but they're useless if there's no image to show that.
	var grabhandleimage = document.createElement("img");
	grabhandleimage.setAttribute("class", "ghimage");
	grabhandleimage.setAttribute("src", "windowTools/Grabhandle2.png");
	//There have been some problems with the program thinking
	//that we want to drag-and-drop so add a few lines of code
	//to prevent that from happening.
	grabhandleimage.setAttribute("draggable", "false");
	grabhandleimage.setAttribute("onmousedown", "return false");
	grabhandles.appendChild(grabhandleimage);
	
	//And define a window object. This then gets used to connect
	//the close button's signal, so we know which elements to
	//destroy.
	var resizeActions = [changeWindowSize];
	var windowobject = {toplevel: newwindow, titleWidget: windowtitle, body: windowbody, closebutton: windowclose, minimizebutton: windowminimize, grabhandle: grabhandles, titleText: title, panelButton: null, type:"active", minleft:0, minright:0, mintop:0, minwidth:0, resizeEvent:resizeActions, maxleft: 0, maxright: 0, maxtop: 0, maxheight: 0, maximized: false};
	windowclose.onclick=function(){closeWindow(windowobject)};
	windowmax.onclick=function(){handlemax(windowobject)};
	windowminimize.onclick=function(){minimize(windowobject)};
	//Then add a panel button to the window object
	windowobject.panelButton=addPanelButton(windowobject);
	//connect our listeners,
	addWindowListeners(windowobject)
	windowobject.toplevel.style.zIndex = 3;
	
	//Then return our windowobject to the user, like they requested.
	//While we're at it, register the window with the program so we
	//can get to it randomly later in a list.
	windowregister.push(windowobject);
	return windowobject;
	//We are now rendering a functional window.
}

/*
addDialogWindow(title, width)

Nice, fluffy way to get basic window creation macros out of the way. This one is built for
dialog windows, which are meant to not hit the taskbar, not be something to minimize or
resize, and easily used to quickly inform the user of things without alert()

Arguments:
	title
		the title of the dialog
	
	width
		How wide to make the dialog.

Returns:
	window
		A special dialog window object similar to the window object from above.
*/
function addDialogWindow(title,width){
	//We define the toplevel element as newwindow
	var newwindow = document.createElement("div");
	//set its class to window
	newwindow.setAttribute("class", "dialogwindow")
	//set its id to whatever the user entered.
	//newwindow.setAttribute("id", id)
	//And its width as well...
	newwindow.style.width = width;
	newwindow.style.left = "10px";
	newwindow.style.right = (10+width)+"px";
	newwindow.style.top = "10px";
	//Minimize only works if we have a transition property ready to go
	newwindow.style.transition = minimizetransitionreset;
	//and add it to the document body.
	document.body.appendChild(newwindow);
	
	//Similar deal for the title, only now we also set the contents
	//right away
	var windowtitle = document.createElement("div");
	windowtitle.setAttribute("class", "windowtitle");
	windowtitle.setAttribute("draggable", "false");
	windowtitle.setAttribute("onmousedown", "return false");
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
	windowclose.innerHTML="<img class=closebutton_icon src=windowTools/CloseButton.png></img>";
	newwindow.appendChild(windowclose);
	
	//No minimize, we're a dialog.
	
	//No resize, we're a dialog.
	
	//And define a window object. This then gets used to connect
	//the close button's signal, so we know which elements to
	//destroy.
	var windowobject = {toplevel: newwindow, titleWidget: windowtitle, body: windowbody, closebutton: windowclose, titleText: title, type:"active", minleft:0, minright:0, mintop:0, minwidth:0};
	windowclose.onclick=function(){closeDialogWindow(windowobject)};
	//connect our listeners,
	addDialogWindowListeners(windowobject)
	windowobject.toplevel.style.zIndex = 3;
	
	//Then return our windowobject to the user, like they requested.
	return windowobject;
	//We are now rendering a functional window.
}

/*
addResizeEventHandler(window, revhandle)

As part of making the window toolkit work with a widget toolkit, the
code required to make a window resize needs to allow for subfunctions.
This is the result of CSS's 100% property not taking other elements
into account and simply filling the window on resize. This causes odd
behavior when a window is resized. To combat this, a function needed
to be inserted into the resize function. Instead of making one function
which would work only with widgetTools.js, however, it made more sense
to add an interface to insert random code into the resize event.

Arguments:
	window
		The window to attach the resize event handler to.

	revhandle
		The resize event handling function. This function
		needs to accept two arguments: the current window, the
		delta X, and the delta Y in that order.
*/
function addResizeEventHandler(window, revhandle){
	window.resizeEvent.push(revhandle);
}

/*
Final event handlers

onmouseup
	handles when the mouse is lifted, calling clickup() and
	allowing any ongoing move operations to finish.
*/
document.onmouseup   = function(event){clickup  (event)};
document.onmousemove = function(e)    {updatepos(e)    };

/*
In order to allow things to start up with the page, we need a way to insert startup hooks.
This function will allow for that.
*/
function addStartupHook(functionreference){
	onfinished.push(functionreference);
}

/*
 * to initialize variables, we should have a function dedicated
 * to stuff that happens when the window has finished loading,
 * similar to $("document").ready(...) in JQuery. The difference
 * is we're not using any libraries to do this stuff, so it's JS
 * only.
 * This also handles startup hooks.
 */
document.onreadystatechange = function(){
	if(document.readyState === "complete"){
		console.log("Startup complete, loading startup hooks, if any");
		panel = document.getElementById("panel");
		for(var i = 0; i<onfinished.length; i++){
			onfinished[i]();
		}
	}
};
