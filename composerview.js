function addComposerWindow(){
	cpsr = addWindow("Composer", 480)
	composercontents = ""
	composercontents += "<div class=toolbar>"
	composercontents += "<button class=tbutton id=save>Save entry</button>"
	composercontents += "</div>"
	composercontents += "<div class=contentbody>"
	composercontents += "</div>"
	setWindowContents(cpsr, composercontents);
}
