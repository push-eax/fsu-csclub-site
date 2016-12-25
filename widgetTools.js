function makeWidgetSpace(parent){
	var widgetSpace = document.createElement("div");
	widgetSpace.setAttribute("class", "widgetSpace");
	parent.appendChild(widgetSpace);
	return widgetSpace;
}

function makeButton(parent, type, text){
	var newButton = document.createElement("button");
	newButton.setAttribute("class", type);
	newButton.innerHTML = text;
	parent.appendChild(newButton);
	var buttonObject = { button:newButton, type:type, parent:parent, state:"normal" };
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

