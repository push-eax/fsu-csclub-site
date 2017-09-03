var gotAuth = false;
var randomAuthString = "ENOAUTH";
var userName = "NOBODY";

function login(){
    var loginWindow = addWindow(
        "User Login",
        480,
        "center");
    var widgets = makeWidgetSpace();
    var message = "Please enter your username and password:";
    var messageLabel = makeLabel(
        widgets,
        message);
    var descriptionBox = makeSection(widgets);
    var descriptionLabel = makeLabel(
        descriptionBox,
        "Members of the CS Club who have requested a login can use this function to gain access to their blog(s), and other features of the site. Note that this is for members only, and public accounts are not available at this point in time.");

    var loginBox = makeSection(widgets);

    var userLabel = makeLabel(
        loginBox,
        "<b>Username:</b> ");
    var userBox = makeInput(
        loginBox,
        "text",
        "jonsmith",
        "user");

    var passwordLabel = makeLabel(
        loginBox,
        "<b>Password:</b> ");
    var passwordBox = makeInput(
        loginBox,
        "password",
        "password",
        "pass");

    var loginButton = makeButton(
        loginBox,
        "button",
        "Log In");
    setClickAction(
        loginButton.button,
        function()
        {
            performLogin(
                userBox,
                passwordBox,
                loginWindow);
        });

    setWidgetSpace(
        loginWindow,
        widgets);
//    centerWindow(loginWindow);
}

function performLogin(
    usernameBox,
    passwordBox,
    loginWindow)
{
    var xhttp = new XMLHttpRequest();
    xhttp.open(
        "POST",
        "include/loginsys.cgi",
        true);
    xhttp.setRequestHeader(
        'Content-Type',
        'application/x-www-form-urlencoded')
    xhttp.send(
        "login="+encodeURIComponent(usernameBox.value) +
            "&passwd=" +
            encodeURIComponent(passwordBox.value));
    xhttp.onreadystatechange =
        function(){
            if(
                this.readyState == 4 &&
                    this.status==200)
            {
                var loginresponse = JSON.parse(this.responseText);
                if(loginresponse.Response == "ENOAUTH"){
	            var dialogwindow = addDialogWindow(
                        "Login Failed",
                        300,
                        "center");
	            var widgetSpace  = makeWidgetSpace();
	            makeLabel(
                        widgetSpace,
                        "Login failed. Please check your username and password, then try again.");
                    setWidgetSpace(
                        dialogwindow,
                        widgetSpace);
                }
                else if (loginresponse.Response == "ENOCONNECTION"){
                    var dialogwindow = addDialogWindow(
                        "Login Failed",
                        300,
                        "center");
                    var widgetSpace  = makeWidgetSpace();
                    makeLabel(
                        widgetSpace,
                        "Login failed due to a database error. Check the site installation or contact an administrator.");
                    setWidgetSpace(
                        dialogwindow,
                        widgetSpace);
                }

                else {
                    responseString = loginresponse.response;
                    userName = usernameBox.value;
                    loginWindow.close();

                    var menutable = document.getElementById("menutable");
                    var composerLine = makeTableRow(menutable);
                    var newPostButton = makeButton(
                        makeTableData(composerLine),
                        "menubutton",
                        "New Post");
                    var editPostButton = makeButton(
                        makeTableData(composerLine),
                        "menubutton",
                        "Edit Post");
                    setClickAction(
                        newPostButton.button(),
                        function()
                        {
                            addComposerWindow("compose");
                        });
                    setClickAction(
                        editpstbutton.button(),
                        function()
                        {
                            /*Not implemented*/
                        });
                }
            }
        }
}

function addComposerWindow(mode){
    if(
        mode != "compose" &&
            mode != "edit"){
        var errorwindow = addDialogWindow(
            "ERROR",
            200,
            "center");
        setWindowContents(
            errorwindow,
            "The composer has no mode set!");
    }
    var title = "Untitled";
    var author = "Nobody"
    var composerWindow = addWindow(
        "Composer Tab Window",
        500);
    var widgetSpace = makeWidgetSpace();

    var toolbar = makeToolbar(widgetSpace);
    var saveButton = makeButton(
        toolbar,
        "tbutton",
        "Save");
    var titleButton = makeButton(
        toolbar,
        "tbutton",
        "Metadata/Details");

    var tabs = makeNotebook(widgetSpace);
    var htmlTab = addTab(
        tabs,
        "HTML Editor");
    var wysiwygTab = addTab(
        tabs,
        "WYSIWYG Editor");

    var wysiwygTabWidgetSpace = wysiwygTab.widgetSpace;
    var wysiwygTabToolbar = makeSubToolbar(wysiwygTabWidgetSpace)
    var boldButton = makeButton(
        wysiwygTabToolbar,
        "tbutton",
        "<b>B</b>");
    var italButton = makeButton(
        wysiwygTabToolbar,
        "tbutton",
        "<i>i</i>");
    var udlnButton = makeButton(
        wysiwygTabToolbar,
        "tbutton",
        "<u>U</u>");
    var composer = makeTextArea(wysiwygTabWidgetSpace);

    var textSpace = makePlainTextArea(htmlTab.widgetSpace);
    syncTextAreas(
        textSpace,
        composer);

    var composerData = {
        title: title,
        author: author,
        cpsrwin: composerwin,
        text: textSpace};

    setClickAction(
        boldButton.button,
        function()
        {
            clickBold(
                boldButton,
                composer );
            textSpace.value = composer.innerHTML;
        } );
    setClickAction(
        italButton.button,
        function()
        {
            clickItal(
                italButton,
                composer );
            textSpace.value = composer.innerHTML;
        } );
    setClickAction(
        udlnButton.button,
        function()
        {
            clickUdln(
                udlnButton,
                composer );
            textSpace.value = composer.innerHTML;
        } );
    setClickAction(
        titleButton.button,
        function()
        {
            composerDetails(composerwinobject);
        } );
    if( mode == "compose" )
        setClickAction(
            saveButton.button,
            function()
            {
                makePstBd( textSpace.value );
                mode = "edit"
            } );
    if( mode == "edit" )
        setClickAction(
            saveButton.button,
            function()
            {
                setWindowContents(
                    addDialogWindow(
                        "Not Implemented",
                        300,
                        "center"),
                    "Not implemented yet. See GitLab for status.");
            } )
    
    setWidgetSpace(
        composerWindow,
        widgetSpace);
    return composerWindow;
}

function composerDetails(
    ExistingTitle,
    ExistingAuthor,
    composerWindow)
{
    var composerDetailsWindow = addWindow(
        "Metadata/Details",
        400,
        "center");
    var widgetSpace = makeWidgetSpace();
    setWidgetSpace(
        composerDetailsWindow,
        widgetSpace);
    var description = makeLabel(
        widgetSpace,
        "Edit Author and Title Details: ");
    var entrySection = makeSection(widgetSpace);
    var titlelabel = makeLabel(
        entrySection,
        "Title");
    var titlefield = makeInput(
        entrySection,
        "text",
        ExistingTitle,
        "title");
    var authorlabel = makeLabel(
        entrySection,
        "Author");
    var authorfield = makeInput(
        entrySection,
        "text",
        ExistingAuthor,
        "author");
    var okbutton = makeButton(
        entrySection,
        "button",
        "OK");
    setClickAction(
        okbutton.button,
        function()
        {
            composerWindow.title = titlefield.value;
            composerWindow.author = authorfield.value;
        } );
}

function clickBold(
    button,
    composer)
{
    document.execCommand(
        'bold',
        false,
        null);
}

function clickItal(
    button,
    composer)
{
    document.execCommand(
        'italic',
        false,
        null);
}

function clickUdln(
    button,
    composer)
{
    document.execCommand(
        'underline',
        false,
        null);
}

function makePstBd(
    title,
    blogid,
    authorName,
    body)
{
    var xhttp = new XMLHttpRequest();
    xhttp.open(
        "POST",
        "include/loginsys.cgi",
        true);
    xhttp.setRequestHeader(
        'Content-Type',
        'application/x-www-form-urlencoded')
    xhttp.send(
        "makepost=" +
            encodeURIComponent(title) +
            "&blogid=" +
            encodeURIComponent(blogid) +
            "&author=" +
            encodeURIComponent(authorName) +
            "&body=" +
            encodeURIComponent(body) +
            "&uname=" +
            encodeURIComponent(userName) +
            "&rstring=" +
            encodeURIComponent(randomAuthString));
    xhttp.onreadystatechange = function()
    {
        if(
            this.readyState == 4 &&
                this.status==200)
        {
            var loginresponse = JSON.parse(this.responseText);
            if(
                loginresponse.Response == "ENOUSER" ||
                    loginresponse.Response == "DENIED" ||
                    loginresponse.Response == "ENOPERMISSION")
            {
	        var dialogwindow = addDialogWindow(
                    "Login Failed",
                    300,
                    "center");
	        var widgetSpace = makeWidgetSpace();
	        makeLabel(
                    widgetSpace,
                    "Login failed. Please check your username and password, then try again. Guru Meditation: " +
                        loginresponse.Response);
                setWidgetSpace(
                    dialogwindow,
                    widgetSpace);
            }
            else if (
                loginresponse.Response == "ENOUNAMEDBCON" ||
                    loginresponse.Response == "ENOPERMDBCON")
            {
                var dialogwindow = addDialogWindow(
                    "Login Failed",
                    300,
                    "center");
                var widgetSpace = makeWidgetSpace();
                makeLabel(
                    widgetSpace,
                    "Login failed due to a database error. Check the site installation or contact an administrator. GURU MEDITATION: " +
                        loginresponse.Response);
                setWidgetSpace(
                    dialogwindow,
                    widgetSpace);
            }
            else if (loginresponse.Response == "SUCCESS"){
                console.log("Saved post successfully")
            }
        }
    }
}
