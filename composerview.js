function addComposerWindow(){
	cpsr = addWindow("Composer", 480)
	composercontents = ""
	composercontents += "<div class=toolbar>"
	composercontents += "<button class=tbutton id=save>"
	//composercontents += "<img class=stock src=saveicon.svg></img>"
	composercontents += "Save entry</button>"
	composercontents += "</div>"
	composercontents += "<div class=contentbody>"
	composercontents += "<textarea class=filltext></textarea>"
	composercontents += "</div>"
	setWindowContents(cpsr, composercontents);
}
