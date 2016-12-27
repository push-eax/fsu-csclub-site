var bold = false;
function addComposerWindow(){
	var cpsr = addWindow("Composer", 480)
	var wsp  = makeWidgetSpace()
	var tbr  = makeToolbar(wsp)
	setWindowSpace(cpsr, wsp);
	var saveButton = makeButton(tbr, "tbutton", "Save");
	var boldButton = makeButton(tbr, "tbutton", "<b>B</b>");
	var italButton = makeButton(tbr, "tbutton", "<i>i</i>");
	var udlnButton = makeButton(tbr, "tbutton", "<u>U</u>");
	var composer   = makeTextArea(wsp);
	setClickAction(boldButton.button, function(){clickBold(boldButton, composer)})
	setClickAction(italButton.button, function(){clickItal(italButton, composer)})
	setClickAction(udlnButton.button, function(){clickUdln(udlnButton, composer)})
}

function clickBold(button, composer){
	document.execCommand('bold', false, null);
}

function clickItal(button, composer){
	document.execCommand('italic', false, null);
}

function clickUdln(button, composer){
	document.execCommand('underline', false, null);
}

