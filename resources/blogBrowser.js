function makeBrowserWindow()
{
    var blogxhttp = new XMLHttpRequest();
    blogxhttp.open(
        "GET",
        "backend.php?request=searchblog//",
        true);
    blogxhttp.send();
    blogxhttp.onreadystatechange = function()
    {
        if(
            this.readyState == 4 &&
                this.status == 200)
        {
            bloglist = JSON.parse(this.responseText);
            var toplevelWindow = addWindow(
                "Browse Blog Directory",
                600);
            var widgetSpace = makeWidgetSpace();
            setWidgetSpace(
                toplevelWindow,
                widgetSpace);
            var tbar = makeToolbar(widgetSpace);
            var browsersection = makeSection(widgetSpace);
            for(
                var blogIndex = 0;
                blogIndex < bloglist.length;
                blogIndex++){
                var blogIcon = makeIcon(
                    browsersection,
                    bloglist[blogIndex][1],
                    "folder");
                var blogid = bloglist[blogIndex][0];
                (function(_id)
                 {
                     setDblClickAction(
                         blogIcon,
                         function()
                         {
                             makePostBrowserWindow(
                                 _id,
                                 widgetSpace);
                         } );
                })(blogid);
            }
        }
    };
}

function makePostBrowserWindow(
    blogid,
    widgetSpace)
{
    var xhttp = new XMLHttpRequest();
    xhttp.open(
        "GET",
        "backend.php?request=getpost//" +
            blogid +
            "/*",
        true);
    xhttp.send();
    xhttp.onreadystatechange = function()
    {
        if(
            this.readyState == 4 &&
                this.status == 200)
        {
            var postdata = JSON.parse(this.responseText);
            var restore = widgetSpace.children;
            setWidgetText(
                widgetSpace,
                "");
            var toolBar = makeToolbar(widgetSpace);
            var browsersection = makeSection(widgetSpace);
            var backButton = makeButton(
                toolBar,
                "tbutton",
                "Back");
            setClickAction(
                backButton.button,
                function()
                {
                    backButtonAction(widgetSpace);
                });
            for(
                var i = 0;
                i<postdata.length;
                i++)
            {
                var postIcon = makeIcon(
                    browsersection,
                    postdata[i][2],
                    "folder");
                var postid = postdata[i][1];
                (function(_id)
                 {
                     setDblClickAction(
                         postIcon,
                         function()
                         {
                             viewBlog(blogid, _id);
                         } );
                })(postid);
            }
        }
    };
} 

function viewBlog(
    blogid,
    postid)
{
    var xhttp = new XMLHttpRequest();
    xhttp.open(
        "GET",
        "backend.php?request=getpost//" +
            blogid +
            "/" +
            postid,
        true);
    xhttp.send();
    xhttp.onreadystatechange = function()
    {
        if(
            this.readyState == 4 &&
                this.status == 200){
            var blog = JSON.parse(this.responseText);
            makeViewWindow(
                blog.title,
                blog.author,
                blog.date,
                blog.body);
        }
    };
}

function makeViewWindow(
    title,
    author,
    date,
    body)
{
    var viewWindow = addWindow(
        title,
        500);
    var widgetSpace = makeWidgetSpace();
    setWidgetSpace(
        viewWindow,
        widgetSpace);
    var titleLabel = makeLabel(
        widgetSpace,
        "<h2>" +
            title +
            "</h2>");
    var dateLabel = makeLabel(
        widgetSpace,
        date);
    var bodySection = makeSection(widgetSpace);
    setWidgetText(
        bodySection,
        body);
}

function backButtonAction(widgetSpace)
{
    var blogxhttp = new XMLHttpRequest();
    blogxhttp.open(
        "GET",
        "backend.php?request=searchblog//",
        true);
    blogxhttp.send();
    blogxhttp.onreadystatechange = function()
    {
        if(
            this.readyState == 4 &&
                this.status==200)
        {
            bloglist = JSON.parse(this.responseText);
            setWidgetText(widgetSpace, "");
            var browsersection = makeSection(widgetSpace);
            for(
                var blogIndex = 0;
                blogIndex<bloglist.length;
                blogIndex++)
            {
                var icon = makeIcon(
                    browsersection,
                    bloglist[blogIndex][1],
                    "folder");
                var blogid = bloglist[blogIndex][0];
                (function(_id)
                 {
                     setDblClickAction(
                         icon,
                         function(){
                             makePostBrowserWindow(
                                 _id,
                                 widgetSpace);
                         } );
                })(blogid);
            }
        }
    };    
}
