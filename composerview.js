var bold = false;
function addComposerWindow(){
	cpsr = addWindow("Composer", 480)
	wsp  = makeWidgetSpace()
	setWindowSpace(cpsr, wsp);
	saveButton = makeButton(wsp, "button", "Save");
}


function makebold(){
	if(bold == false){
		document.getElementById("bold").setAttribute("class", "toggled");
		bold = true;
	}
	else {
		document.getElementById("bold").setAttribute("class", "tbutton");
		bold = false;
	}
}
