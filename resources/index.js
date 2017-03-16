function onmenubover(){
	document.getElementById("menubutton").src="windowTools/beta-start-button-3-hover.png";
}
function onmenubout(){
	document.getElementById("menubutton").src="windowTools/beta-start-button-3.png";
}
var menuopen = false;
function openmenu(){
	dom_menu = document.getElementById("menu")
	dom_mbackground = document.getElementById("menubackground");
	dom_mbutton = document.getElementById("menubutton")
	if(menuopen == false){
		dom_mbackground.style.display='block';
		dom_menu.style.height='500px';
		dom_menu.style.padding='5px';
		menuopen = true
		dom_mbutton.style.transform='rotate(180deg)';
	}
	else{
		dom_mbackground.style.display='none';
		menuopen = false
		dom_menu.style.height='0px';
		dom_menu.style.padding='0px';
		dom_mbutton.style.transform='rotate(0deg)';
	}
}
function menuexec(funct){
	funct();
	openmenu();
}
function maketestwindow(){
	var testwindow  = addWindow("Test Window",400)
	var widgetSpace = makeWidgetSpace();
	setWidgetSpace(testwindow,widgetSpace);
	var button1     = makeButton(widgetSpace, "button", "Test Button");
}
function makeblankwindow(){
	addWindow('blank',200)
}
function settingswindow(){
	var toplevel = addWindow("User Settings", 400)
	var wsp      = makeWidgetSpace();
	var tabs     = makeNotebook(wsp);
	var theme    = addTab(tabs, "Theme");
	var site     = addTab(tabs, "Site preferences");
	themeTab(theme);
	siteTab(site);
	setWidgetSpace(toplevel, wsp);
}

function themeTab(tabObject){
	//Wallpaper buttons
	makeLabel(tabObject.widgetSpace, "<b>Wallpaper</b>");
	var oldwall = makeButton(tabObject.widgetSpace, "button", "Grey Logo");
	var lineDisk = makeButton(tabObject.widgetSpace, "button", "Line Disk");
	var bitcycle = makeButton(tabObject.widgetSpace, "button", "BitCycles");
	var orbitals = makeButton(tabObject.widgetSpace, "button", "Orbitals");
	
	//Wallpaper Click Actions
	setClickAction(oldwall.button, function(){swapwall(0)});
	setClickAction(lineDisk.button, function(){swapwall(2)});
	setClickAction(bitcycle.button, function(){swapwall(1)});
	setClickAction(orbitals.button, function(){swapwall(3)});
	
	//Widget Toolkit Buttons
	makeLabel(tabObject.widgetSpace, "<b>Widget Theme</b>");
	var oldGrey = makeButton(tabObject.widgetSpace, "button", "GoldenGrey");
	
	//Icon Theme Buttons
	makeLabel(tabObject.widgetSpace, "<b>Icon Theme</b>");
	var defaulticons = makeButton(tabObject.widgetSpace, "button", "Default Theme");
}
function setCookie(cname,cvalue,exdays) {
	document.cookie = cname + "=" + cvalue + ";path=index.html";
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = decodeURIComponent(document.cookie).split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
function swapwall(number){
	/*
	 * Wallpaper numbers:
	 * 
	 * 0: old grey wallpaper with the cs club logo in the middle
	 * 1: Original bitcycle wallpaper, updates forthcoming
	 */
	if(number == 0){
		document.body.style.backgroundSize = "initial";
		document.body.style.backgroundImage = "url('resources/fsulogo.png')"
		document.body.style.backgroundColor = "grey"
	} else {
		document.body.style.backgroundSize="contain"
		document.body.style.backgroundColor="black"
	}
	if(number == 1){
		document.body.style.backgroundImage = "url('resources/bitcycles.png')"
	}
	if(number == 2){
		document.body.style.backgroundImage = "url('resources/linedisk.png')"
	}
	if(number == 3){
		document.body.style.backgroundImage = "url('resources/orbitals.png')"
	}
	setCookie("wallpaper",number,"8000");
	console.log("Stored wallpaper "+number+";");
}

function getLastWall(){
	var value = getCookie("wallpaper");
	console.log("Found wallpaper "+value+", resetting.");
	if(value!= ""){
		swapwall(value);
	}
}

function siteTab(tab){
	var infolabel = makeLabel(tab.widgetSpace, "<b>Mobile Site</b>");
	var mobilebutton = makeButton(tab.widgetSpace, "button", "Switch to Mobile Site");
	setClickAction(mobilebutton.button, function(){window.location="m.html"});
}

function makeIconDialog(iconname){
	var dialogwindow = addDialogWindow(iconname + " icon", 300);
	var widgetSpace = makeWidgetSpace();
	makeLabel(widgetSpace, "Generic "+iconname+" icon, defined per the current icon theme.");
	setWidgetSpace(dialogwindow, widgetSpace);
}

function makeWidgetWindow(){
	var anotherwindow = addWindow('Widget Toolkit Test Window',400)
	var widgetSpace = makeWidgetSpace();
	var toolBar = makeToolbar(widgetSpace);
	var button = makeButton(toolBar, "tbutton", "Buttons");
	var button2 = makeButton(toolBar, "tbutton", "In a toolbar");
	var text = makeLabel(widgetSpace, "This dialog tests the supported features of the widget toolkit widgetTools. It requires the windowTools toolkit to also be present, but it does not exhaustively test it.");
	var table = makeTable(widgetSpace);
	var row1 = makeTableRow(table);
	makeTableData(row1,"table", true);
	makeTableData(row1,"headers");
	var row2 = makeTableRow(table);
	makeTableData(row2,"table");
	makeTableData(row2,"content", true);
	var rule = makeRule(widgetSpace);
	var notebook = makeNotebook(widgetSpace);
	var formtab = addTab(notebook, "Forms");
	var subtoolbar = makeSubToolbar(formtab.widgetSpace);
	var button_one = makeButton(subtoolbar, "tbutton", "Sub-Toolbar");
	var button_two = makeButton(subtoolbar, "tbutton", "Buttons");
	var form = makeForm(formtab.widgetSpace);
	var inputfield = makeInput(form, "text");
	var submitbutton = makeButton(form, "button", "form elements");
	var selectoptions = [["combobox", "GTK+ calls these comboboxes"], ["select", "HTML calls these \"selects\""]];
	var selectbox = makeSelect(form, selectoptions);
	var sectiontab = addTab(notebook, "Text Elements");
	var tabledata = [["Tables", "created", "quickly"],["using", "makeTableWithData","()"]];
	var tablewithdata = makeTableWithData(sectiontab.widgetSpace, true, tabledata);
	var label = makeLabel(sectiontab.widgetSpace, "<b>HTML</b> <i>formatted</i> <u>Labels</u>");
	var section = makeSection(sectiontab.widgetSpace);
	setWidgetText(section, "Sections, containing text. These should be display:block and left-aligned. They should usually also have a border.");
	var icontab = addTab(notebook, "Icons");
	var foldicon = makeIcon(icontab.widgetSpace, "Folder Icon", "folder");
	var blogicon = makeIcon(icontab.widgetSpace, "Blog post icon", "blogpost");
	var gameicon = makeIcon(icontab.widgetSpace, "Game Icon", "game");
	var laysicon = makeIcon(icontab.widgetSpace, "UI layers icon", "layers");
	var objticon = makeIcon(icontab.widgetSpace, "object icon", "object");
	var saveicon = makeIcon(icontab.widgetSpace, "save icon", "save");
	var cpsricon = makeIcon(icontab.widgetSpace, "Composer Icon", "composer");
	var muscicon = makeIcon(icontab.widgetSpace, "Music Icon", "music");
	setDblClickAction(foldicon, function(){makeIconDialog("folder")});
	setDblClickAction(blogicon, function(){makeIconDialog("blog post")});
	setDblClickAction(gameicon, function(){makeIconDialog("game")});
	setDblClickAction(laysicon, function(){makeIconDialog("UI layers")});
	setDblClickAction(objticon, function(){makeIconDialog("object")});
	setDblClickAction(saveicon, function(){makeIconDialog("file save")});
	setDblClickAction(cpsricon, function(){makeIconDialog("composer")});
	setDblClickAction(muscicon, function(){makeIconDialog("music player")});
	setWidgetSpace(anotherwindow, widgetSpace);
}
if(ismobile == false){
	getLastWall();
}
