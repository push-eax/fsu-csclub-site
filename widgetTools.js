function makeWidgetSpace(){
	var widgetSpace = document.createElement("div");
	widgetSpace.setAttribute("class", "widgetSpace");
	return widgetSpace;
}

function makeToolbar(widgetSpace){
	var newToolbar = document.createElement("div");
	newToolbar.setAttribute("class", "toolbar");
	widgetSpace.appendChild(newToolbar);
	return newToolbar;
}

function makeButton(parent, type, text){
	var newButton = document.createElement("button");
	newButton.setAttribute("class", type);
	newButton.innerHTML = text;
	parent.appendChild(newButton);
	var buttonObject = { button:newButton, type:type, parent:parent, state:"normal" };
}

function makeTextArea(parent){
	var newTextArea = document.createElement("div");
	newTextArea.setAttribute("class", "filltext");
	newTextArea.setAttribute("contenteditable", "")
	parent.appendChild(newTextArea);
}

function setWidgetText(parent, text){
	parent.innerHTML = text;
}

function setButtonToggled(button){
	button.button.setAttribute("class", "toggled");
	button.state="toggled";
}

function setButtonUntoggled(button){
	button.button.setAttribute("class", button.type);
	button.state="normal"
}

