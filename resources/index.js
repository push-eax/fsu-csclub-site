function onmenubover(){
	document.getElementById("menubutton").src="windowTools/beta-start-button-hover.png";
}
function onmenubout(){
	document.getElementById("menubutton").src="windowTools/beta-start-button.png";
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
	var toplevel = addWindow("User Settings", 600)
	var wsp      = makeWidgetSpace();
	var tabs     = makeNotebook(wsp);
	var theme    = addTab(tabs, "Theme");
	themeTab(theme);
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

function makeWidgetWindow(){
	var anotherwindow = addWindow('Widget Toolkit Test Window',400)
	var widgetSpace = makeWidgetSpace();
	var toolBar = makeToolbar(widgetSpace);
	var button = makeButton(toolBar, "tbutton", "Buttons");
	var button2 = makeButton(toolBar, "tbutton", "In a toolbar");
	var table = makeTable(widgetSpace);
	var row1 = makeTableRow(table);
	makeTableData(row1,"table", true);
	makeTableData(row1,"headers");
	var row2 = makeTableRow(table);
	makeTableData(row2,"table");
	makeTableData(row2,"content", true);
	var rule = makeRule(widgetSpace);
	var tabledata = [["Tables", "created", "quickly"],["using", "makeTableWithData","()"]];
	var tablewithdata = makeTableWithData(widgetSpace, true, tabledata);
	var form = makeForm(widgetSpace);
	var inputfield = makeInput(form, "text");
	var submitbutton = makeButton(form, "button", "form elements");
	var selectoptions = [["combobox", "GTK+ calls these comboboxes"], ["select", "HTML calls these \"selects\""]];
	var selectbox = makeSelect(form, selectoptions);
	var section = makeSection(widgetSpace);
	setWidgetText(section, "Sections, containing text. These should be display:block and left-aligned. They should usually also have a border.");
	setWidgetSpace(anotherwindow, widgetSpace);
}
getLastWall();
