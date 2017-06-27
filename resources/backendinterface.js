var gotauth = false;
var rstring = "ENOAUTH";
var uname = "NOBODY";

/*
login()

The Standard Login Function

This function displays a window which allows the user to log in to the backend.
It has no returns, no arguments. The rstring variable should be set, and the
gotauth variable should be set upon success.
*/
function login(){
    //We add our login window
    var cpsrwin = addWindow("User Login", 480, "center");
    //make a widget space
    var widgets = makeWidgetSpace();
    //and then prompt the user for a username and password
    var message = "Please enter your username and password:";
    //Then we explain who has user access, and what it is for.
    var messagl = makeLabel(widgets, message);
    var descrbx = makeSection(widgets);
    var descrlb = makeLabel(descrbx, "Members of the CS Club who have requested a login can use this function to gain access to their blog(s), and other features of the site. Note that this is for members only, and public accounts are not available at this point in time.");
    //Then we make a greeter box
    var loginbx = makeSection(widgets);
    //Username label/field
    var userlbl = makeLabel(loginbx, "<b>Username:</b> ");
    var userbox = makeInput(loginbx, "text", "jonsmith", "user");
    //password label/field
    var passlbl = makeLabel(loginbx, "<b>Password:</b> ");
    var passbox = makeInput(loginbx, "password", "password", "pass");
    //and a button next to the password box.
    var loginbt = makeButton(loginbx, "button", "Log In");
    setClickAction(loginbt.button, function(){actlogin(userbox, passbox, cpsrwin);});
    //Set the widget space and it's off to the races!
    setWidgetSpace(cpsrwin, widgets);
}
 /*
actlogin()

The login actions function.

Login() is built to create a window, this is what happens when you click the log
in button. It will send the relevant information off to the server.

Arguments:
    userbox -- the makeinput result which contaians the username.
    passbox -- The password makeinput result
    cpsrwin -- the login window. The cpsrwin name is carry-over from when the compser was to be
               the only component which would use a sign-in.
*/
function actlogin(userbox, passbox, cpsrwin){
    //Create the XHTTP request
    var xhttp = new XMLHttpRequest();
    //And set our header information and query variables.
    xhttp.open("POST", "include/loginsys.cgi", true);
    xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhttp.send("login="+encodeURIComponent(userbox.value)+"&passwd="+encodeURIComponent(passbox.value));
    //And add a finish handler. The easier-to-read method of doing this is to have the request send synchronously,
    //but that is slated to be axed, so asynchronous is the way to go.
    xhttp.onreadystatechange = function(){
        //Assuming we get a correct response (which we should)
        if(this.readyState == 4 && this.status==200){
            //Parse the response.
            var loginresponse = JSON.parse(this.responseText);
            //And handle when things go wrong.
            if(loginresponse.Response == "ENOAUTH"){
	        var dialogwindow = addDialogWindow("Login Failed", 300, "center");
	        var widgetSpace  = makeWidgetSpace();
	        makeLabel(widgetSpace, "Login failed. Please check your username and password, then try again.");
                setWidgetSpace(dialogwindow, widgetSpace);
            }
            else if (loginresponse.Response == "ENOCONNECTION"){
                var dialogwindow = addDialogWindow("Login Failed", 300,"center");
                var widgetSpace  = makeWidgetSpace();
                makeLabel(widgetSpace, "Login failed due to a database error. Check the site installation or contact an administrator.");
                setWidgetSpace(dialogwindow, widgetSpace);
            }
            //But if we get no error code, we can assume things went right. From here, we set the uname and rstring
            //variables, and add more actions to the main menu. This will allow people to then 
            else {
                //Grab the rstring from the server
                rstring = loginresponse.response;
                //the username we sent was good, it should work
                uname = userbox.value;
                //close the login window
                cpsrwin.close();
                //add our menu items, first by grabbing the appropriate table, then by adding table row/data information.
                var menutable     = document.getElementById("menutable");
                var composerLine  = makeTableRow(menutable);
                var newpstbutton  = makeButton(makeTableData(composerLine), "menubutton", "New Post");
                var editpstbutton = makeButton(makeTableData(composerLine), "menubutton", "Edit Post");
                setClickAction(newpstbutton.button(),  function(){ addComposerWindow("compose"); });
                setClickAction(editpstbutton.button(), function(){ /*Not implemented*/});
            }
        }
    }
}

/*
addComposerWindow()

Adds a window for composing and editing a blog post.

The window is designed to act as a place where the user types blog details.

Upon completion, it should have a "new blog" and "existing blog" mode or similar mechanism
so that it does not clone blog posts every time an edit is made.
*/
function addComposerWindow(mode){
    if(mode != "compose" && mode != "edit"){
        var errorwindow = addDialogWindow("ERROR", 200, "center");
        setWindowContents(errorwindow, "The composer has no mode set!");
    }
    var title = "Untitled";
    var author = "Nobody"
    var composerwin = addWindow("Composer Tab Window", 500);
    var widgetSpace = makeWidgetSpace();
    //Toolbar
    var toolbar     = makeToolbar(widgetSpace);
    var saveButton  = makeButton(toolbar, "tbutton", "Save");
    var titleButton = makeButton(toolbar, "tbutton", "Metadata/Details");
    //Begin notebook tabs
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
    //To allow external dialogs, we bundle up all of the objects above...
    var cpsrdata    = {title: title, author: author, cpsrwin: composerwin, text: textSpace};
    //Second tab events
    setClickAction  ( boldButton.button, function() { clickBold( boldButton, composer ); textSpace.value = composer.innerHTML; } );
    setClickAction  ( italButton.button, function() { clickItal( italButton, composer ); textSpace.value = composer.innerHTML; } );
    setClickAction  ( udlnButton.button, function() { clickUdln( udlnButton, composer ); textSpace.value = composer.innerHTML; } );
    setClickAction  ( titleButton.button, function(){ composerDetails(composerwinobject); } );
    if( mode == "compose" ) setClickAction  ( saveButton.button, function() { makePstBd( textSpace.value ); mode = "edit" } );
    if( mode == "edit" )    setClickAction  ( saveButton.button, function() { setWindowContents(addDialogWindow("Not Implemented", 300, "center"), "Not implemented yet. See GitLab for status."); } )
    setWidgetSpace  (composerwin, widgetSpace);
    return composerwin;
}

/*
composerDetails

Opens a composer details view, allowing the user to set their author and title details.

Arguments:
    ExistingTitle -- Any title the post already has. Allows the user to edit the existing title.
    ExistingAuthor -- The author name field. This allows the field to populate the author name.

Returns:
    PostMeta object -- custom object with title and author fields.
*/
function composerDetails(ExistingTitle, ExistingAuthor, composerwinobject){
    var cdetailswin = addWindow("Metadata/Details", 400, "center");
    var wspace      = makeWidgetSpace();
    setWidgetSpace(cdetailswin, wspace);
    var description = makeLabel(wspace, "Edit Author and Title Details: ");
    var section     = makeSection(wspace);
    var titlelabel  = makeLabel(section, "Title");
    var titlefield  = makeInput(section, "text", ExistingTitle, "title");
    var authorlabel = makeLabel(section, "Author");
    var authorfield = makeInput(section, "text", ExistingAuthor, "author");
    var okbutton    = makeButton(section, "button", "OK");
    setClickAction  ( okbutton.button, function(){
        composerwinobject.title  = titlefield.value;
        composerwinobject.author = authorfield.value;
    } );
}

/*
clickBold()

Built to make the current text edit field show bold text. WYSIWYG editing mode only.
*/
function clickBold(button, composer){
    document.execCommand('bold', false, null);
}

/*
clickItal()

Built to make the current text edit field show italic text. WYSIWYG editing mode only.
*/
function clickItal(button, composer){
    document.execCommand('italic', false, null);
}

/*
clickUdln()

Built to make the current text edit field show underlined text. WYSIWYG editing mode only.
*/
function clickUdln(button, composer){
    document.execCommand('underline', false, null);
}

/*
makePstBd()

Creates a new blog post based on the information given.

Arguments:
    title -- The post title
    blogid -- the blog ID number
    aname -- the author name
    body -- the blog body
*/
function makePstBd(title, blogid, aname, body){
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "include/loginsys.cgi", true);
    xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhttp.send("makepost="+encodeURIComponent(title)+"&blogid="+encodeURIComponent(blogid)+"&author="+encodeURIComponent(aname)+"&body="+encodeURIComponent(body)+"&uname="+encodeURIComponent(uname)+"&rstring="+encodeURIComponent(rstring));
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status==200){
            var loginresponse = JSON.parse(this.responseText);
            if(loginresponse.Response == "ENOUSER"||loginresponse.Response == "DENIED"||loginresponse.Response == "ENOPERMISSION"){
	        var dialogwindow = addDialogWindow("Login Failed", 300, "center");
	        var widgetSpace = makeWidgetSpace();
	        makeLabel(widgetSpace, "Login failed. Please check your username and password, then try again. Guru Meditation: "+loginresponse.Response);
                setWidgetSpace(dialogwindow, widgetSpace);
            } else if (loginresponse.Response == "ENOUNAMEDBCON" || loginresponse.Response == "ENOPERMDBCON"){
                var dialogwindow = addDialogWindow("Login Failed", 300,"center");
                var widgetSpace = makeWidgetSpace();
                makeLabel(widgetSpace, "Login failed due to a database error. Check the site installation or contact an administrator. GURU MEDITATION: "+loginresponse.Response);
                setWidgetSpace(dialogwindow, widgetSpace);
            }
            else if (loginresponse.Response == "SUCCESS"){
                console.log("Saved post successfully")
            }
        }
    }
}
