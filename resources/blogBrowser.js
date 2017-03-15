function makeBrowserWindow(){
	var toplevel = addWindow("Browse Blog Directory", 600);
	var wspace = makeWidgetSpace();
	setWidgetSpace(toplevel, wspace);
	var tbar = makeToolbar(wspace);
	var backbutton = makeButton(tbar, "tbutton", "Back");
	var browsersection = makeSection(wspace);
	var testicon = makeIcon(browsersection, "Object Icon", "object");
	var saveicon = makeIcon(browsersection, "Save Icon", "save");
	var bpsticon = makeIcon(browsersection, "Blog Icon", "blogpost");
	var gameicon = makeIcon(browsersection, "Game Icon", "game");
	var layricon = makeIcon(browsersection, "Layers Icon", "layers");
	//TODO: We need icon support in WidgetTools.
}
