function makeBrowserWindow(){
	var toplevel = addWindow("Browse Blog Directory", 600);
	var wspace = makeWidgetSpace();
	setWidgetSpace(toplevel, wspace);
	var tbar = makeToolbar(wspace);
	var backbutton = makeButton(tbar, "tbutton", "Back???");
	var browsersection = makeSection(wspace);
	var message = makeLabel(browsersection, "This will contain stuff soon. The blog browser will eventually look&feel very close to a real file browser like GNOME Nautilus, KDE Dolphin, PCManFM, Xfce Thunar, Hackintosh Finder, or Windows Exploder");
	//TODO: We need icon support in WidgetTools.
}
