var bold = false;
function addComposerWindow(){
	cpsr = addWindow("Composer", 480)
	composercontents = ""
	composercontents += "<div class=toolbar>"
	composercontents += "<button class=tbutton id=save>"
	//composercontents += "<img class=stock src=saveicon.svg></img>"
	composercontents += "Save entry</button>"
	composercontents += "<button class=tbutton id=bold><b>B</b></button>"
	composercontents += "<button class=tbutton id=italic><i>i</i></button>"
	composercontents += "<button class=tbutton id=under><u>U</u></button>"
	composercontents += "</div>"
	composercontents += "<div class=contentbody>"
	composercontents += "<div contenteditable class=filltext></div>"
	composercontents += "</div>"
	setWindowContents(cpsr, composercontents);
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
