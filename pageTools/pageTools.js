var page;
var topbar;
var ismobile = true;

/*
PageTools is designed with a JavaScript-first approach, much unlike windowTools. This
means it is built to initialize its own elements. If it is defined in the header, it
cannot do this since the body has not been created yet. initPageTools() creates the
default body layout.
*/
function initPageTools(){
	//The top bar is kind of hidden away so it does not get affected by rouge programs
	var realtopbar = document.createElement("div");
	realtopbar.setAttribute("class", "topbar");
	document.body.appendChild(realtopbar);
	
	//The top bar programs will see is actually a member div of the real topbar, so we
	//don't override the menu button and logo.
	topbar = document.createElement("div");
	topbar.setAttribute("class", "faketbar");
	realtopbar.appendChild(topbar);
	
	//Our site is clearly branded.
	var logo = document.createElement("img");
	logo.setAttribute("class", "logo");
	logo.setAttribute("src", "resources/fsulogo.png");
	realtopbar.appendChild(logo);
	
	//The menu button, which will open a side pane.
	var menu = document.createElement("img");
	menu.setAttribute("class", "menubutton");
	menu.setAttribute("id", "menubutton");
	menu.setAttribute("src", "pageTools/beta-start-button-3.png");
	realtopbar.appendChild(menu);
	
	//The page is where window elements will be created. This is what widgetSpaces should
	//be placed into.
	page = document.createElement("div");
	page.setAttribute("class", "page");
	document.body.appendChild(page);
}

/*
addWindow(title, width)

Replaces the page with a new one

Arguments:
	title
		Top bar title
	
	width
		kept for compatibility with windowTools

returns
	"page"
*/
function addWindow(title, width=0){
	page.innerHTML="";
	topbar.innerHTML=title;
	return "page"
}

/*
closeWindow(window)

Resets the page or closes the element.

Arguments:
	window
		"page" if it's the main page, otherwise deletes the object.
*/
function closeWindow(window){
	if(window == "page"){
		page.innerHTML="";
	}
	else{
		delete window;
	}
}

/*
addDialogWindow(title, width)

Adds a dialog bar to the bottom

Arguments:
	title
		Unused.
	
	width
		like title, kept for compatibility. See addWindow()

returns:
	a dialog div.
*/
function addDialogWindow(title="Blergh", width=0){
	var dialog = document.createElement("div");
	dialog.setAttribute("class", "dialog");
	setTimeout(function(){document.body.removeChild(dialog)}, 10000);
	document.body.appendChild(dialog);
	return dialog;
}

function setWidgetSpace(window, wspace){
	if(window == "page"){
		page.innerHTML="";
		page.appendChild(wspace);
	}
	else{
		window.appendChild(wspace);
	}
}
