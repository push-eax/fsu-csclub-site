function initPage(){
    addWindow("Main Menu");
    var widgetSpace = makeWidgetSpace();
    var widgetTest = makeButton(widgetSpace, "button", "WidgetTools Test Page");
    setClickAction(widgetTest.button, makeWidgetWindow);
    var composer = makeButton(widgetSpace, "button", "Composer View");
    setClickAction(composer.button, addComposerWindow_nauth);
    var browser = makeButton(widgetSpace, "button", "Browser");
    setClickAction(browser.button, makeBrowserWindow);
    setWidgetSpace("page", widgetSpace);
}

function signalConnect(){
    setClickAction(document.getElementById("menubutton"), function(){
	initPage();
    });
}
