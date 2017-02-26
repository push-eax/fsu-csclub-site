var bold = false;

function addComposerWindow_authenticated(){
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
	var cpsr       = addWindow("Composer", 480)
	var wsp        = makeWidgetSpace()
	var tbr        = makeToolbar(wsp)
	var saveButton = makeButton(tbr, "tbutton", "Save");
	var boldButton = makeButton(tbr, "tbutton", "<b>B</b>");
	var italButton = makeButton(tbr, "tbutton", "<i>i</i>");
	var udlnButton = makeButton(tbr, "tbutton", "<u>U</u>");
	var composer   = makeTextArea(wsp);
    setWidgetSpace ( cpsr, wsp );
	setClickAction ( boldButton.button, function() { clickBold( boldButton, composer ) } );
	setClickAction ( italButton.button, function() { clickItal( italButton, composer ) } );
	setClickAction ( udlnButton.button, function() { clickUdln( udlnButton, composer ) } );
	//setClickAction ( saveButton.button, function() { post( "resources/blogger.php", composer ) } );
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

function post(path, params) {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'blogger.php');
        var blog = new FormData();
        blog.append('body', params.textContent);
	xhr.send(blog);
}