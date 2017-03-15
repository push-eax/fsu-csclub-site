function addComposerWindow_nauth(){
	var cpsrwin = addWindow("Composer: Authentication Required", 480);
	var widgets = makeWidgetSpace();
	var toolbar = makeToolbar(widgets);
	var message = "Please enter your username and password:";
	var messagl = makeLabel(widgets, message);
	var loginbx = makeSection(widgets);
	var userlbl = makeLabel(loginbx, "<b>Username:</b> ");
	var userbox = makeInput(loginbx, "text", "jonsmith", "user");
	var passlbl = makeLabel(loginbx, "<b>Password:</b> ");
	var passbox = makeInput(loginbx, "password", "password", "pass");
	var loginbt = makeButton(loginbx, "button", "Log In");
	setClickAction(loginbt.button, function(){composerLogin(userbox.value, passbox.value, cpsrwin);});
	setWidgetSpace(cpsrwin, widgets);
}

function composerLogin(user, pass, window){
	//Backend code to log in to the system
	//User and pass are plain-text variables.
	var gotauth = true;
	//If gotauth is true, a composer window shows up.
	if(gotauth == true){
		closeWindow(window);
		var cpsrwin = addComposerWindow();
	}
}

function addComposerWindow(){
	var composerwin = addWindow("Composer Tab Window", 500);
	var widgetSpace = makeWidgetSpace();
	var toolbar     = makeToolbar(widgetSpace);
	var saveButton  = makeButton(toolbar, "tbutton", "Save");
	//var titlelabel  = makeLabel(toolbar, "Title: ");
	var titleInput  = makeInput(toolbar, "text", "Untitled", "title");
	var tabs        = makeNotebook(widgetSpace);
	var tab_one     = addTab(tabs, "HTML Editor");
	var tab_two     = addTab(tabs, "WYSIWYG Editor");
	//Second tab
	var wsp         = tab_two.widgetSpace;
	var tbr         = makeSubToolbar(wsp)
	var boldButton  = makeButton(tbr, "tbutton", "<b>B</b>");
	var italButton  = makeButton(tbr, "tbutton", "<i>i</i>");
	var udlnButton  = makeButton(tbr, "tbutton", "<u>U</u>");
	var tabs        = makeNotebook(wsp);
	var composer    = makeTextArea(wsp);
	//First tab
	var textSpace   = makePlainTextArea(tab_one.widgetSpace);
	syncTextAreas(textSpace, composer);
	//Second tab events
	setClickAction  ( boldButton.button, function() { clickBold( boldButton, composer ); textSpace.value = composer.innerHTML; } );
	setClickAction  ( italButton.button, function() { clickItal( italButton, composer ); textSpace.value = composer.innerHTML; } );
	setClickAction  ( udlnButton.button, function() { clickUdln( udlnButton, composer ); textSpace.value = composer.innerHTML; } );
	setWidgetSpace  (composerwin, widgetSpace);
	return composerwin;
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

