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
makeLabel(parent)

Makes a label widget similar to Gtk::Label or QLabel

Arguments:
	parent
		Parent DOM object or widget space.

Returns:
	newLabel
		The new label div DOM object.
*/
function makeLabel(parent,text){
	var newLabel = document.createElement("div");
	newLabel.setAttribute("class", "labelText");
	newLabel.innerHTML=text;
	parent.appendChild(newLabel);
	return newLabel;
}

/*
makeTable(parent)

Makes an HTML table.

Returns:
	newtable
		new HTML DOM table
*/
function makeTable(parent){
	var newtable = document.createElement("table");
	newtable.setAttribute("class", "table");
	parent.appendChild(newtable);
	return newtable;
}

/*
makeTableWithData(parent, borders, values)

Makes an HTML table, complete with contents

Arguments:
	parent
		Object to add table do
	
	borders
		Whether table data elements should have borders
	
	content
		Two-dimensional array representing table rows, and
		the second dimension for table datas

Returns:
	newtable
		new HTML DOM table
*/
function makeTableWithData(parent, borders, values){
	var newtable = document.createElement("table");
	newtable.setAttribute("class", "table");
	for(var i = 0; i<values.length; i++){
		var newtr = document.createElement("tr");
		for(var j = 0; j<values[i].length; j++){
			var newtd = document.createElement("td");
			newtd.innerHTML = values[i][j];
			if(borders) newtd.setAttribute("class", "tabledata");
			newtr.appendChild(newtd);
		}
		newtr.setAttribute("class", "tablerow");
		newtable.appendChild(newtr);
	}
	parent.appendChild(newtable);
	return newtable;
}

/*
makeTableRow(parent)

Makes an HTML table row

Returns:
	newtablerow
		new HTML DOM tr
*/
function makeTableRow(parent){
	var newtablerow = document.createElement("tr");
	newtablerow.setAttribute("class", "tablerow");
	parent.appendChild(newtablerow);
	return newtablerow;
}

/*
makeTableData(parent, tdata[, borderless])

makes an HTML table data element

Arguments:
	parent
		object to add td to
	
	tdata
		Contents of the cell
	
	borderless
		whether the cell should have borders

returns:
	newtabledata
		new HTML DOM td
*/
function makeTableData(parent, tdata, borderless=false){
	var newtabledata = document.createElement("td");
	newtabledata.innerHTML=tdata;
	if(borderless == false){
		newtabledata.setAttribute("class", "tabledata");
	}
	parent.appendChild(newtabledata);
	return newtabledata;
}

/*
makeForm(parent [, action])

makes an HTML form

Arguments:
	parent
		object to add the form to
	
	action
		submit action

Returns:
	new HTML DOM form object
*/
function makeForm(parent, action = ""){
	var newform = document.createElement("form");
	newform.setAttribute("action", action);
	parent.appendChild(newform);
	return newform;
}

/*
makeInput(parent, type[, value[, name]])

Creates an input object, such as a text field or submit button

Arguments:
	parent
		object to add the input to
	
	type
		type of input (text, number, date, etc..)
	
	value
		the value of the input
	
	name
		name of the input

Returns:
	HTML DOM input object
*/
function makeInput(parent, type, value = "", name = ""){
	var input = document.createElement("input");
	input.setAttribute("type", type);
	if(value != "") input.setAttribute("value", value);
	if(name != "") input.setAttribute("name", name);
	parent.appendChild(input);
	return input;
}

/*
makeSelect(parent, options)

Creates a select object, similar to a GTK+ combobox

Arguments:
	parent
		Parent object to add the combobox to
	
	options
		Select value/text pairs, stored in a two-dimensional
		array. The first is the value= tag, the second is the
		text displayed on the option. (example:
		[["keyboard", "Desktop Keyboards"], ["mc", "Desktop Mice"]]
		...value="keyboard">Desktop Keyboards</option>...

Returns:
	HTML DOM select object
*/
function makeSelect(parent, options){
	var select = document.createElement("select");
	for(var i = 0; i < options.length; i++){
		var newoption = document.createElement("option");
		newoption.setAttribute("value", options[i][0]);
		newoption.innerHTML=options[i][1];
		select.appendChild(newoption);
	}
	select.setAttribute("class", "combo");
	parent.appendChild(select);
	return select;
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

