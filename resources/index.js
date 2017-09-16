var wallpaperRegistry = [
    {
        name: "bitCycles",
        url: "resources/wall/bitcycles.png",
        color: "black",
        fill: true
    },
    {
        name: "lineDisk",
        url: "resources/wall/linedisk.png",
        color: "black",
        fill: true
    },
    {
        name: "orbitals",
        url: "resources/wall/orbitals.png",
        color: "black",
        fill: true
    },
    {
        name: "logoTwo",
        url: "resources/wall/cssite-wall2.png",
        color: "black",
        fill: true
    },
    {
        name: "logo",
        url: "resources/wall/fsulogo.png",
        color: "grey",
        fill: false
    },
    {
        name: "textWall",
        url: "resources/wall/text.png",
        color: "grey",
        fill: false
    }
];

function menuButtonMouseHover()
{
    document.getElementById("menubutton").src =
        "windowTools/beta-start-button-3-hover.png";
}

function menuButtonMouseLeave()
{
    document.getElementById("menubutton").src =
        "windowTools/beta-start-button-3.png";
}

var menuopen = false;

function openmenu()
{
    dom_menu = document.getElementById("menu");
    dom_mbackground = document.getElementById("menubackground");
    dom_mbutton = document.getElementById("menubutton");
    if(menuopen == false)
    {
	dom_mbackground.style.display='block';
	dom_menu.style.height='500px';
	dom_menu.style.padding='5px';
	menuopen = true;
	dom_mbutton.style.transform='rotate(180deg)';
    }
    else
    {
	dom_mbackground.style.display='none';
	menuopen = false
	dom_menu.style.height='0px';
	dom_menu.style.padding='0px';
	dom_mbutton.style.transform='rotate(0deg)';
    }
}

// Created so that when a menu item is clicked the menu will close
function menuexec(funct)
{
    funct();
    openmenu();
}

function maketestwindow()
{
    var testwindow  = addWindow(
        "Test Window",
        400)
    var widgetSpace = makeWidgetSpace();
    setWidgetSpace(
        testwindow,
        widgetSpace);
    var button1 = makeButton(
        widgetSpace,
        "button",
        "Test Button");
}

function settingswindow()
{
    var toplevel = addWindow(
        "User Settings",
        400)
    var wsp = makeWidgetSpace();
    var tabs = makeNotebook(wsp);
    var theme = addTab(
        tabs,
        "Theme");
    var site = addTab(
        tabs,
        "Site preferences");
    themeSettingsTab(theme);
    siteSettingsTab(site);
    setWidgetSpace(
        toplevel,
        wsp);
}

function themeSettingsTab(tabObject)
{
    makeLabel(
        tabObject.widgetSpace,
        "<b>Wallpaper</b>");
    var wallbuttons = [];
    for(
        var wallpaperIndex = 0;
        wallpaperIndex < wallpaperRegistry.length;
        wallpaperIndex++)
    {
        (function(wallpaperIndex)
         {
             setClickAction(
                 makeButton(
                     tabObject.widgetSpace,
                     "button",
                     wallpaperRegistry[wallpaperIndex].name).button,
                 function()
                 {
                     setWallpaper(wallpaperRegistry[wallpaperIndex]);
                 });
         })(wallpaperIndex);
    }
    
    makeLabel(
        tabObject.widgetSpace,
        "<b>Widget Theme</b>");
    var oldGrey = makeButton(
        tabObject.widgetSpace,
        "button",
        "GoldenGrey");
    
    makeLabel(
        tabObject.widgetSpace,
        "<b>Icon Theme</b>");
    var defaulticons = makeButton(
        tabObject.widgetSpace,
        "button",
        "Default Theme");
}

function introWindow()
{
    var introwindow = addWindow(
        "Welcome!",
        400,
        "corner");
    var widgets = makeWidgetSpace();
    setWidgetSpace(
        introwindow,
        widgets);

    makeLabel(
        widgets,
        "<h2>Welcome to the FSU CS Club Site!</h2>");
    makeRule(widgets);
    makeLabel(
        widgets,
        "<b>Click the menu button at the bottom left of the page to get started!</b>");
    return introwindow;
}

function setWallpaper(wallpaperSpec)
{
    if(wallpaperSpec.fill == true)
    {
        document.body.style.backgroundSize = "contain";
    }
    else
    {
        document.body.style.backgroundSize = "initial";
    }
    document.body.style.backgroundImage =
        "url('" +
        wallpaperSpec.url +
        "')";
    document.body.style.backgroundColor = wallpaperSpec.color;
    storecookie(
        "wallpaper",
        wallpaperSpec.name,
        "8000");
}

function lastWallpaper()
{
    var value = readCookie("wallpaper");
    /*console.log(
        "Found wallpaper "+
            value+
            ", resetting.");*/
    if(value!= ""){
        for(
            var wallpaperIndex = 0;
            wallpaperIndex < wallpaperRegistry.length;
            wallpaperIndex++)
        {
            if(wallpaperRegistry[wallpaperIndex].name == value)
                setWallpaper(wallpaperRegistry[wallpaperIndex]);
	}
    }
}

function siteSettingsTab(tab)
{
    var infolabel = makeLabel(
        tab.widgetSpace,
        "<b>Mobile Site</b>");
    var mobilebutton = makeButton(
        tab.widgetSpace,
        "button",
        "Switch to Mobile Site");
    setClickAction(
        mobilebutton.button,
        function()
        {
            window.location="m.html"
        });
}

function makeIconDescriptionDialog(iconName)
{
    var dialogwindow = addDialogWindow(
        iconName +
            " icon",
        300,
        "center");
    var widgetSpace = makeWidgetSpace();
    makeLabel(
        widgetSpace,
        "Generic " +
            iconName +
            " icon, defined per the current icon theme.");
    setWidgetSpace(
        dialogwindow,
        widgetSpace);
}

function makeWidgetTestWindow()
{
    var anotherwindow = addWindow(
        'Widget Toolkit Test Window',
        600);
    var widgetSpace = makeWidgetSpace();


    var toolBar = makeToolbar(widgetSpace);
    var button = makeButton(
        toolBar,
        "tbutton",
        "Buttons");
    var button2 = makeButton(
        toolBar,
        "tbutton",
        "In a toolbar");

    var text = makeLabel(
        widgetSpace,
        "This dialog tests the supported features of the widget toolkit widgetTools. It requires the windowTools toolkit to also be present, but it does not exhaustively test it.");
    var table = makeTable(widgetSpace);
    var row1 = makeTableRow(table);
    makeTableData(
        row1,
        "table",
        true);
    makeTableData(
        row1,
        "headers");
    var row2 = makeTableRow(table);
    makeTableData(
        row2,
        "table");
    makeTableData(
        row2,
        "content",
        true);

    var rule = makeRule(widgetSpace);

    var notebook = makeNotebook(widgetSpace);
    var formtab = addTab(
        notebook,
        "Forms");

    var subtoolbar = makeSubToolbar(formtab.widgetSpace);
    var button_one = makeButton(
        subtoolbar,
        "tbutton",
        "Sub-Toolbar");
    var button_two = makeButton(
        subtoolbar,
        "tbutton",
        "Buttons");
    var form = makeForm(formtab.widgetSpace);
    var inputfield = makeInput(
        form,
        "text");
    var submitbutton = makeButton(
        form,
        "button",
        "form elements");
    var selectoptions =
        [
            ["combobox", "GTK+ calls these comboboxes"],
            ["select", "HTML calls these \"selects\""]
        ];
    var selectbox = makeSelect(
        form,
        selectoptions);
    var sectiontab = addTab(
        notebook,
        "Text Elements");

    var tabledata =
        [
            ["Tables", "created", "quickly"],
            ["using", "makeTableWithData","()"]
        ];
    var tablewithdata = makeTableWithData(
        sectiontab.widgetSpace,
        true,
        tabledata);
    var label = makeLabel(
        sectiontab.widgetSpace,
        "<b>HTML</b> <i>formatted</i> <u>Labels</u>");

    var section = makeSection(sectiontab.widgetSpace);
    setWidgetText(
        section,
        "Sections, containing text. These should be display:block and left-aligned. They should usually also have a border.");

    var icontab = addTab(
        notebook,
        "Icons");
    var foldicon = makeIcon(
        icontab.widgetSpace,
        "Folder Icon",
        "folder");
    var blogicon = makeIcon(
        icontab.widgetSpace,
        "Blog post icon",
        "blogpost");
    var gameicon = makeIcon(
        icontab.widgetSpace,
        "Game Icon",
        "game");
    var laysicon = makeIcon(
        icontab.widgetSpace,
        "UI layers icon",
        "layers");
    var objticon = makeIcon(
        icontab.widgetSpace,
        "object icon",
        "object");
    var saveicon = makeIcon(
        icontab.widgetSpace,
        "save icon",
        "save");
    var cpsricon = makeIcon(
        icontab.widgetSpace,
        "Composer Icon",
        "composer");
    var muscicon = makeIcon(
        icontab.widgetSpace,
        "Music Icon",
        "music");
    setDblClickAction(
        foldicon,
        function()
        {
            makeIconDescriptionDialog("folder")
        });
    setDblClickAction(
        blogicon,
        function()
        {
            makeIconDescriptionDialog("blog post")
        });
    setDblClickAction(
        gameicon,
        function()
        {
            makeIconDescriptionDialog("game")
        });
    setDblClickAction(
        laysicon,
        function()
        {
            makeIconDescriptionDialog("UI layers")
        });
    setDblClickAction(
        objticon,
        function()
        {
            makeIconDescriptionDialog("object")
        });
    setDblClickAction(
        saveicon,
        function()
        {
            makeIconDescriptionDialog("file save")
        });
    setDblClickAction(
        cpsricon,
        function()
        {
            makeIconDescriptionDialog("composer")
        });
    setDblClickAction(
        muscicon,
        function()
        {
            makeIconDescriptionDialog("music player")
        });
    setWidgetSpace(
        anotherwindow,
        widgetSpace);
}

if(ismobile == false)
{
    lastWallpaper();
}
addStartupHook(introWindow)
