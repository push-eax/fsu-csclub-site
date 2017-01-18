/*
widgetTools.js widget toolkit.

This widget toolkit was created with the express purpose of
making window instantiation smoother for programs which
require multiple windows of the same type. While by no means
perfect, widgetTools aims to create a seamless and integrated
environment which does not toy with higher-level objects in
the DOM, containing all items in one widget space.
*/

/*
makeWidgetSpace()

Creates the toplevel div which is used by default.

Returns:
	widgetSpace
		a div DOM object, used as the parent for other
		/make.+\(\)/ functions such as makeButton() in
		order to place themselves in one contained
		environment. Includes the correct class name
		and other data to fit properly into a window.
*/
function makeWidgetSpace(){
	var widgetSpace = document.createElement("div");
	widgetSpace.setAttribute("class", "widgetSpace");
	return widgetSpace;
}

/*
makeToolbar(widgetSpace)

Creates a toolbar. Designed to be placed at the top of a
window. Note that this toolkit intentionally does not mess
with the idea of a menubar since those actions would produce
too much unneccesary complexity, at the detriment of ease-
of-use and bandwidth

Arguments:
	widgetSpace
		the DOM element to place the toolbar in.
		This can conceptually be any DOM element, but
		it is reccommended that this be restricted
		to just a widgetSpace.
*/
function makeToolbar(widgetSpace){
	var newToolbar = document.createElement("div");
	newToolbar.setAttribute("class", "toolbar");
	widgetSpace.appendChild(newToolbar);
	return newToolbar;
}

/*
makeSection(widgetSpace)

Creates a new section area, which can be used to add other
widgets into a bordered area, so that parts of a ui page can
be separated cleanly.

Arguments:
	widgetSpace
		the DOM element to place the section in.
		This can conceptually be any DOM element, but
		it is reccommended that this be restricted
		to just a widgetSpace or other section.
*/
function makeSection(widgetSpace){
	var newSection = document.createElement("div");
	newSection.setAttribute("class", "section");
	widgetSpace.appendChild(newSection);
	return newSection;
}

/*
makeButton(parent, type, text)

Creates a button in the specified parent.

Arguments:
	parent
		The dom object or widget space to place the
		button in

	type
		the type of button to use
		Options are currently "button" and "tbutton"

	text
		the text label to place inside the button

Returns:
	buttonObject
		The new button object which was created
		upon completion of the function. In order to
		access the DOM object itself, use
		buttonObject.button
*/
function makeButton(parent, type, text){
	var newButton = document.createElement("button");
	newButton.setAttribute("class", type);
	newButton.innerHTML = text;
	parent.appendChild(newButton);
	var buttonObject = { button:newButton, type:type, parent:parent, state:"normal" };
	return buttonObject;
}

/*
makeTextArea(parent)

Makes a multi-line text editor field. Actually uses a div
with the contentediable bit turned on. This has the advantage
of allowing for rather complex formatting and a totally
WYSIWYG formatter. This is one area where a bona-fide textarea
falls a little bit short.

Arguments:
	parent
		Parent DOM object or widget space.

Returns:
	newTextArea
		The new text area div DOM object.
*/
function makeTextArea(parent){
	var newTextArea = document.createElement("div");
	newTextArea.setAttribute("class", "filltext");
	newTextArea.setAttribute("contenteditable", "true")
	parent.appendChild(newTextArea);
	return newTextArea;
}

/*
setWidgetText(parent, text)

sets the inner HTML content of an element. Could potentially
do more in the future, but for now just a basic placeholder.

Arguments:
	parent
		The parent DOM object or widget space

	text
		The text to insert into the HTML
*/
function setWidgetText(parent, text){
	parent.innerHTML = text;
}

/*
setButtonToggled(button)

Turns a button into a button that's toggled. In widgetTools
there is no distinction between a button and a toggle button,
so this allows the click action of a button to turn it into
a toggle button

Arguments
	button
		the button object to work with
*/
function setButtonToggled(button){
	button.button.setAttribute("class", "toggled");
	button.state="toggled";
}

/*
setButtonUntoggled(button)

Does the reverse of above

Arguments
	button
		the button object to work with
*/
function setButtonUntoggled(button){
	button.button.setAttribute("class", button.type);
	button.state="normal"
}

/*
setClickAction(widget, funct)

Sets the click action for an element. Essentially connects the
onclick property for whatever object you pass it.

Arguments:
	widget
		the DOM element to change

	funct
		the function to connect the click event to
*/
function setClickAction(widget, funct){
	widget.onmousedown = function(){funct()}
}

