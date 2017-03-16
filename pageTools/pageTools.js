var page;
var topbar;

function initPageTools(){
	var realtopbar = document.createElement("div");
	realtopbar.setAttribute("class", "topbar");
	document.body.appendChild(realtopbar);
	topbar = document.createElement("div");
	realtopbar.appendChild(topbar);
	var logo = document.createElement("img");
	logo.setAttribute("class", "logo");
	logo.setAttribute("src", "resources/fsulogo.png");
	realtopbar.appendChild(logo);
	var menu = document.createElement("img");
	menu.setAttribute("class", "menubutton");
	menu.setAttribute("src", "pageTools/beta-start-button-3.png");
	realtopbar.appendChild(menu);
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
	nothing, yet.
*/
function addWindow(title, width){
	page.innerHTML="";
	topbar.innerHTML=title;
}
