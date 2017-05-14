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
			var icon;
			var blogid;
			for(var i = 0; i<bloglist.length; i++){
				icon = makeIcon(browsersection, bloglist[i][1], "folder");
				blogid = bloglist[i][0];
				(function(_id){
					icon.onmousedown =  function(){ viewBlog(_id); } ;
				})(blogid);
			}
		}
	};
}

function viewBlog(blogid){
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "backend.php?request=getblog//"+blogid, true);
	xhttp.send();
	xhttp.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			var blog =  JSON.parse(this.responseText);
			makeViewWindow(blog.title, blog.body);
		}
	};
	//makeViewWindow(blog[3], blog[4]);
}

function makeViewWindow(title, body){
	var view_window = addWindow(title, 500);
	var wsp = makeWidgetSpace();
	setWidgetSpace(view_window, wsp);
	var titleLabel = makeLabel(wsp, "<h2>"+title+"</h2>");
	var bodySection = makeSection(wsp);
	setWidgetText(bodySection, body);
}
