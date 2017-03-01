var bold = false;

function addComposerWindow_nauth(){
	var cpsrwin = addWindow("Composer: Authentication Required", 480);
	var widgets = makeWidgetSpace();
	var toolbar = makeToolbar(widgets);
	var message = "Please enter your username and password:";
	var messagl = makeLabel(widgets, message);
	var loginbx = makeSection(widgets);
	var apology = makeLabel(loginbx, "We have no form element support yet in the widget toolkit, therefore this window is disabled. Sorry for the inconvienience!");
	setWidgetSpace(cpsrwin, widgets);
}

function addComposerWindow(){
	var composerwin = addWindow("Composer Tab Window", 500);
	var widgetSpace = makeWidgetSpace();
	var toolbar     = makeToolbar(widgetSpace);
	var saveButton  = makeButton(toolbar, "tbutton", "Save");
	var tabs        = makeNotebook(widgetSpace);
	var tab_one     = addTab(tabs, "HTML Editor");
	var tab_two     = addTab(tabs, "WYSIWYG Editor");
	var wsp         = tab_two.widgetSpace;
	var tbr         = makeSubToolbar(wsp)
	var boldButton  = makeButton(tbr, "tbutton", "<b>B</b>");
	var italButton  = makeButton(tbr, "tbutton", "<i>i</i>");
	var udlnButton  = makeButton(tbr, "tbutton", "<u>U</u>");
	var tabs        = makeNotebook(wsp);
	var composer    = makeTextArea(wsp);
	setClickAction  ( boldButton.button, function() { clickBold( boldButton, composer ) } );
	setClickAction  ( italButton.button, function() { clickItal( italButton, composer ) } );
	setClickAction  ( udlnButton.button, function() { clickUdln( udlnButton, composer ) } );
	setWidgetSpace  (composerwin, widgetSpace);
}
/*
function addComposerWindow_old(){
	var cpsr       = addWindow("Composer", 480)
	var wsp        = makeWidgetSpace()
	var tbr        = makeToolbar(wsp)
	var saveButton = makeButton(tbr, "tbutton", "Save");
	var boldButton = makeButton(tbr, "tbutton", "<b>B</b>");
	var italButton = makeButton(tbr, "tbutton", "<i>i</i>");
	var udlnButton = makeButton(tbr, "tbutton", "<u>U</u>");
	var tabs       = makeNotebook(wsp);
	var composer   = makePlainTextArea(wsp);
    setWidgetSpace ( cpsr, wsp );
	setClickAction ( boldButton.button, function() { clickBold( boldButton, composer ) } );
	setClickAction ( italButton.button, function() { clickItal( italButton, composer ) } );
	setClickAction ( udlnButton.button, function() { clickUdln( udlnButton, composer ) } );
}
*/
function clickBold(button, composer){
	document.execCommand('bold', false, null);
}

function clickItal(button, composer){
	document.execCommand('italic', false, null);
}

function clickUdln(button, composer){
	document.execCommand('underline', false, null);
}

