function makeBrowserWindow(){
	var blogxhttp = getBlogList();
	blogxhttp.onreadystatechange = function(){
		if(this.readyState == 4 && this.status==200){
			bloglist = JSON.parse(this.responseText);
			var toplevel = addWindow("Browse Blog Directory", 600);
			var wspace = makeWidgetSpace();
			setWidgetSpace(toplevel, wspace);
			var tbar = makeToolbar(wspace);
			var backbutton = makeButton(tbar, "tbutton", "Back");
			var browsersection = makeSection(wspace);
			for(var i = 0; i<bloglist.length; i++){
				makeIcon(browsersection, bloglist[i][1], "folder");
			}
		}
	};
}

function makeViewWindow(title, body){
	var view_window = addWindow(title, 500);
	var wsp = makeWidgetSpace();
	setWidgetSpace(view_window, wsp);
	var titleLabel = makeLabel(wsp, "<h2>"+title+"</h2>");
	var bodySection = makeSection(wsp);
	setWidgetText(bodySection, body);
}
