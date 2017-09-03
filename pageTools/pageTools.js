var page;
var topbar;
var ismobile = true;

function initPageTools()
{
    var realtopbar = document.createElement("div");
    realtopbar.setAttribute(
        "class",
        "topbar");
    document.body.appendChild(realtopbar);
    
    topbar = document.createElement("div");
    topbar.setAttribute(
        "class",
        "faketbar");
    realtopbar.appendChild(topbar);
    
    var logo = document.createElement("img");
    logo.setAttribute(
        "class",
        "logo");
    logo.setAttribute(
        "src",
        "resources/fsulogo.png");
    realtopbar.appendChild(logo);
    
    var menu = document.createElement("img");
    menu.setAttribute(
        "class",
        "menubutton");
    menu.setAttribute(
        "id",
        "menubutton");
    menu.setAttribute(
        "src",
        "pageTools/beta-start-button-3.png");
    realtopbar.appendChild(menu);
    
    page = document.createElement("div");
    page.setAttribute(
        "class",
        "page");
    document.body.appendChild(page);
}

function addWindow(
    title,
    width=0)
{
    page.innerHTML="";
    topbar.innerHTML=title;
    return "page"
}

function closeWindow(window)
{
    if(window == "page")
    {
	page.innerHTML="";
    }
    else
    {
	delete window;
    }
}

function addDialogWindow(
    title="Blergh",
    width=0)
{
    var dialog = document.createElement("div");
    dialog.setAttribute(
        "class",
        "dialog");
    setTimeout(
        function()
        {
            document.body.removeChild(dialog)
        },
        10000);
    document.body.appendChild(dialog);
    return dialog;
}

function setWidgetSpace(
    window,
    wspace)
{
    if(window == "page")
    {
	page.innerHTML="";
	page.appendChild(wspace);
    }
    else
    {
	window.appendChild(wspace);
    }
}
