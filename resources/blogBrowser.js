function makeBrowserWindow(){
    var blogxhttp = new XMLHttpRequest();
    blogxhttp.open("GET", "backend.php?request=searchblog//", true);
    blogxhttp.send();
	blogxhttp.onreadystatechange = function(){
		if(this.readyState == 4 && this.status==200){
			bloglist = JSON.parse(this.responseText);
			var toplevel = addWindow("Browse Blog Directory", 600);
			var wspace = makeWidgetSpace();
			setWidgetSpace(toplevel, wspace);
			var tbar = makeToolbar(wspace);
			var browsersection = makeSection(wspace);
			for(var i = 0; i<bloglist.length; i++){
				var icon = makeIcon(browsersection, bloglist[i][1], "folder");
				var blogid = bloglist[i][0];
				(function(_id){
					setDblClickAction(icon, function(){makePostBrowserWindow(_id, wspace); } );
				})(blogid);
			}
		}
	};
}

function makePostBrowserWindow(blogid, wspace){
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "backend.php?request=getpost//" + blogid + "/*", true);
	xhttp.send();
	xhttp.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			var postdata = JSON.parse(this.responseText);
			var restore = wspace.children;
			setWidgetText(wspace, "");
			var tbar = makeToolbar(wspace);
			var browsersection = makeSection(wspace);
			var backButton = makeButton(tbar, "tbutton", "Back");
			setClickAction(backButton.button, function(){ backButtonAction(wspace); });
			
			//document.getElementsByClassName("tbutton")[0].onclick = function( ) { console.log("itverks"); backButtonAction(wspace); };
			
			for(var i = 0; i<postdata.length; i++){
				var icon = makeIcon(browsersection, postdata[i][2], "folder");
				var postid = postdata[i][1];
				(function(_id){
					setDblClickAction(icon, function(){ viewBlog(blogid, _id); } );
				})(postid);
			}
			//setClickAction(backButton, function(){console.log("ing!!!!!");});
		}
	}; } 

function viewBlog(blogid, postid){
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "backend.php?request=getpost//" + blogid + "/" + postid, true);
	xhttp.send();
	xhttp.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			var blog =  JSON.parse(this.responseText);
			makeViewWindow(blog.title, blog.author, blog.date, blog.body);
		}
	};
	//makeViewWindow(blog[3], blog[4]);
}

function makeViewWindow(title, author, date, body){
	var view_window = addWindow(title, 500);
	var wsp = makeWidgetSpace();
	setWidgetSpace(view_window, wsp);
	var titleLabel = makeLabel(wsp, "<h2>"+title+"</h2>");
	var dateLabel = makeLabel(wsp, date);
	var bodySection = makeSection(wsp);
	setWidgetText(bodySection, body);
}

function backButtonAction(wspace){
	var blogxhttp = new XMLHttpRequest();
	blogxhttp.open("GET", "backend.php?request=searchblog//", true);
	blogxhttp.send();
	blogxhttp.onreadystatechange = function(){
		if(this.readyState == 4 && this.status==200){
			bloglist = JSON.parse(this.responseText);
			setWidgetText(wspace, "");
			var browsersection = makeSection(wspace);
			for(var i = 0; i<bloglist.length; i++){
				var icon = makeIcon(browsersection, bloglist[i][1], "folder");
				var blogid = bloglist[i][0];
				(function(_id){
					setDblClickAction(icon, function(){makePostBrowserWindow(_id, wspace); } );
				})(blogid);
			}
		}
	};	
}
