var gotauth = false;
var rstring = "ENOAUTH";

/*
login()

The Standard Login Function

This function displays a window which allows the user to log in to the backend.
It has no returns, no arguments. The rstring variable should be set, and the
gotauth variable should be set upon success.
*/
function login(){
    var cpsrwin = addWindow("User Login", 480, "center");
    var widgets = makeWidgetSpace();
    var toolbar = makeToolbar(widgets);
    var message = "Please enter your username and password:";
    var messagl = makeLabel(widgets, message);
    var descrbx = makeSection(widgets);
    var descrlb = makeLabel(descrbx, "Members of the CS Club who have requested a login can use this function to gain access to their blog(s), and other features of the site. Note that this is for members only, and public accounts are not available at this point in time.");
    var loginbx = makeSection(widgets);
    var userlbl = makeLabel(loginbx, "<b>Username:</b> ");
    var userbox = makeInput(loginbx, "text", "jonsmith", "user");
    var passlbl = makeLabel(loginbx, "<b>Password:</b> ");
    var passbox = makeInput(loginbx, "password", "password", "pass");
    var loginbt = makeButton(loginbx, "button", "Log In");
    setClickAction(loginbt.button, function(){composerLogin(userbox.value, passbox.value, cpsrwin);});
    setWidgetSpace(cpsrwin, widgets);
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "include/loginsys.cgi", true);
    xhttp.send("login="+encodeURIComponent(userbox.value)+"&passwd="+encodeURIComponent(passbox.value));
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status==200){
            var loginresponse = JSON.parse(this.responseText);
            if(loginresponse.response == "ENOAUTH"){
	        var dialogwindow = addDialogWindow("Login Failed", 300);
	        var widgetSpace = makeWidgetSpace();
	        makeLabel(widgetSpace, "Login failed. Please check your username and password, then try again.");
            } else if (loginresponse.response == "ENOCONNECTION"){
                var dialogwindow = addDialogWindow("Login Failed", 300);
                var widgetSpace = makeWidgetSpace();
                makeLabel(widgetSpace, "Login failed due to a database error. Check the site installation or contact an administrator.");
            } else {
                rstring = loginresponse.response;
                cpsrwin.close();
            }
        }
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
