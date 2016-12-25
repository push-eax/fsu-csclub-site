var bold = false;
function addComposerWindow(){
	cpsr = addWindow("Composer", 480)
	wsp  = makeWidgetSpace()
	tbr  = makeToolbar(wsp)
	setWindowSpace(cpsr, wsp);
	saveButton = makeButton(tbr, "tbutton", "Save");
	boldButton = makeButton(tbr, "tbutton", "<b>B</b>");
	italButton = makeButton(tbr, "tbutton", "<i>i</i>");
	udlnButton = makeButton(tbr, "tbutton", "<u>U</u>");
	composer   = makeTextArea(wsp);
}

