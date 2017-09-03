var mouseClickDownX;
var mouseClickDownY;
var mouseClickUpX;
var mouseClickUpY;
var clickedWindow;
var currentlyMovingWindow = false;
var currentlyResizingWindow = false;
var windowmovetransparancy=0.75;
var allWindowsList = [];
var panel;
var longestMinimizeTransitionTime = 250;
var minimizetransition =
    "top 0.25s, right 0.25s, left 0.25s, width 0.125s, opacity 0.25s";
var resetMinimizeTransition =
    "top 0s, right 0s, left 0s, width 0s, opacity 0.125s";
var windowMinimumWidth = 160;
var ismobile = false;
var onPageLoadFinished = [];
var colorScheme = {
    lowerpanelcolor: "#daa00d",
    activepanelcolor: "#febe10",
    lowerwindowborder: 'black',
    minipanelcolor: 'grey'
};
var maximizetransitiontime =
    "top 0.25s, right 0.25s, left 0.25s, bottom 0.125s, width 0.125s";
var maximizetransitionreset =
    "top 0s, right 0s, left 0s, width 0s, bottom 0s, opacity 0.125s";

function movewindow(
    currentwindow,
    increasex,
    increasey)
{
    var currentWindowBounds = currentwindow.toplevel.getBoundingClientRect();
    var screenBounds = document.body.getBoundingClientRect();
    var newx =
        currentWindowBounds.left +
        increasex;
    var newy =
        currentWindowBounds.top +
        increasey;
    if(
        newx>0 &&
            currentWindowBounds.right + increasex < screenBounds.right)
    {
        currentwindow.toplevel.style.left =
            newx +
            "px";
    }
    if(
        newy>0 &&
            currentWindowBounds.bottom + increasey < screenBounds.bottom)
    {
        currentwindow.toplevel.style.top =
            newy +
            "px";
    }
}

function changeWindowSize(
    currentwindow,
    increasex,
    increasey)
{
    var currentWindowBounds = currentwindow.toplevel.getBoundingClientRect();
    var currentWindowBodyBounds = currentwindow.body.getBoundingClientRect();
    var screenBounds = document.body.getBoundingClientRect();
    var newx =
        currentWindowBounds.right -
        currentWindowBounds.left;
    var newy =
        currentwindow.body.clientHeight -
        16;
    newx += increasex;
    newy += increasey;
    if(newx <= windowMinimumWidth)
        newx = windowMinimumWidth;
    currentwindow.toplevel.style.width =
        newx +
        "px";
    currentwindow.body.style.height =
        newy +
        "px";
}

function maximize(
    window)
{
    window.toplevel.style.transition = maximizetransitiontime;
    var windowBounds = window.toplevel.getBoundingClientRect();
    var windowBodyBounds = window.body.getBoundingClientRect();
    var screenBounds = document.body.getBoundingClientRect();
    var panelBounds = panel.getBoundingClientRect();
    var screenLeftBound = screenBounds.left;
    var screenRightBound = screenBounds.right;
    var screenTopBound = screenBounds.top;
    var panelTopBound = panelBounds.top;
    var screenHeight =
        panelTopBound -
        screenTopBound;
    var windowHeight =
        windowBodyBounds.bottom -
        windowBodyBounds.top;

    window.preMaximizeTop = windowBounds.top;
    window.preMaximizeRight = windowBounds.right;
    window.preMaximizeLeft = windowBounds.left;
    window.preMaximizeHeight = windowHeight;

    window.maximized = true;

    window.toplevel.style.left = screenLeftBound;
    window.toplevel.style.right = screenRightBound;
    window.toplevel.style.top = screenTopBound;
    window.body.style.height =
        screenHeight -
        48;
    window.toplevel.style.width =
        screenBounds.right -
        screenBounds.left;
    setTimeout(
        function()
        {
            window.toplevel.style.transition = maximizetransitionreset;
        },
        longestMinimizeTransitionTime);
}

function restore(
    window)
{
    window.toplevel.style.transition = maximizetransitiontime;

    window.maximized = false;

    window.toplevel.style.left = window.preMaximizeLeft;
    window.toplevel.style.right = window.preMaximizeRight;
    window.toplevel.style.top = window.preMaximizeTop;
    window.toplevel.style.width =
        window.preMaximizeRight -
        window.preMaximizeLeft;
    window.body.style.height = window.preMaximizeHeight;
    setTimeout(
        function()
        {
            window.toplevel.style.transition = maximizetransitionreset;
        },
        longestMinimizeTransitionTime);
}

function updatepos(
    jsEvent)
{
    var windowPositionDeltaX;
    var windowPositionDeltaY;

    if(currentlyMovingWindow == true){
        windowPositionDeltaX =
            jsEvent.pageX -
            mouseClickDownX;
        windowPositionDeltaY =
            jsEvent.pageY -
            mouseClickDownY;

        mouseClickDownX = jsEvent.pageX;
        mouseClickDownY = jsEvent.pageY;

        movewindow(
            clickedWindow,
            windowPositionDeltaX,
            windowPositionDeltaY);

        clickedWindow.toplevel.style.opacity = windowmovetransparancy;
    }
    if(currentlyResizingWindow == true){
        currentlyMovingWindow = false;

        windowPositionDeltaX =
            jsEvent.pageX -
            mouseClickDownX;
        windowPositionDeltaY =
            jsEvent.pageY -
            mouseClickDownY;

        mouseClickDownX = jsEvent.pageX;
        mouseClickDownY = jsEvent.pageY;

        clickedWindow.toplevel.style.opacity = windowmovetransparancy;
        for (
            var resizeEventIndex = 0;
            resizeEventIndex < clickedWindow.resizeEvent.length;
            resizeEventIndex++)
        {
            clickedWindow.resizeEvent[resizeEventIndex](
                clickedWindow,
                windowPositionDeltaX,
                windowPositionDeltaY);
        }
    }
}

function clickTitleBar(
    jsEvent,
    element)
{
    mouseClickDownX = jsEvent.pageX;
    mouseClickDownY = jsEvent.pageY;

    clickedWindow = element;
    currentlyMovingWindow = true;
}

function clickdown(
    element)
{
    raiseWindow(element)
}

function clickdialogdown(
    element)
{
    raiseDialogWindow(element)
}

function clickup(
    jsEvent)
{
    mouseClickUpX = jsEvent.pageX;
    mouseClickUpY = jsEvent.pageY;
    if(currentlyMovingWindow == true)
    {
        movewindow(
            clickedWindow,
            mouseClickUpX -
                mouseClickDownX,
            mouseClickUpY -
                mouseClickDownY);
        clickedWindow.toplevel.style.opacity = 1;
        currentlyMovingWindow = false;
    }
    if(currentlyResizingWindow == true)
    {
        changeWindowSize(
            clickedWindow,
            mouseClickUpX -
                mouseClickDownX,
            mouseClickUpY -
                mouseClickDownY);
        clickedWindow.toplevel.style.opacity = 1;
        currentlyResizingWindow = false;
    }
}

function dragResize(
    jsEvent,
    element)
{
    mouseClickDownX = jsEvent.pageX;
    mouseClickDownY = jsEvent.pageY;
    clickedWindow = element;
    currentlyMovingWindow = false;
    raiseWindow(element);
    currentlyResizingWindow = true;
}

function centerWindow(
    window)
{
    var screenBounds = document.body.getBoundingClientRect();
    var windowBounds = window.body.getBoundingClientRect();
    window.style.top = (
        (screenBounds.bottom/2) -
            (windowBounds.bottom+winrect.top)
    );
}

function closeWindow(
    window)
{
    window.toplevel.setAttribute(
        "class",
        "window_close");
    setTimeout(
        function()
        {
            for (
                var windowIndex = 0;
                windowIndex < allWindowsList.length;
                windowIndex++)
            {
                if(allWindowsList[windowIndex] == window)
                {
                    allWindowsList[windowIndex]={
                        type: "closed"
                    };
                    if(typeof allWindowsList[windowIndex+1] != 'undefined')
                    {
                        allWindowsList[windowIndex] =
                            allWindowsList[windowIndex+1]
                    }
                    if(typeof allWindowsList == 'undefined')
                    {
                        allWindowsList = []
                    }
                }
            }
            window.toplevel.removeChild(window.titleWidget);
            delete window.titleWidget;
            window.toplevel.removeChild(window.body);
            delete window.body;
            window.toplevel.removeChild(window.closebutton);
            delete window.closebutton;
            document.body.removeChild(window.toplevel);
            delete window.toplevel;
            panel.removeChild(window.panelButton)
            delete window.panelButton
        },
        256);
}

function closeDialogWindow(
    window)
{
    window.toplevel.setAttribute(
        "class",
        "window_close");
    setTimeout(
        function()
        {
            window.toplevel.removeChild(window.titleWidget);
            delete window.titleWidget;
            window.toplevel.removeChild(window.body);
            delete window.body;
            window.toplevel.removeChild(window.closebutton);
            delete window.closebutton;
            document.body.removeChild(window.toplevel);
            delete window.toplevel;
        },
        256);
}

function setWindowContents(
    window,
    contents)
{
    window.body.innerHTML=contents;
    window.body.appendChild(window.grabhandle);
}

function setWidgetSpace(
    window,
    widgetSpace)
{
    window.body.appendChild(widgetSpace);
}

function lowerAll()
{
    for(
        var windowIndex = 0;
        windowIndex < allWindowsList.length;
        windowIndex++)
    {
        if(typeof allWindowsList[windowIndex].toplevel !='undefined')
        {
            if(allWindowsList[windowIndex].type == 'active')
            {
                allWindowsList[windowIndex].toplevel.setAttribute(
                    "class",
                    "window_disabled");
                allWindowsList[windowIndex].toplevel.style.zIndex =
                    2;
                allWindowsList[windowIndex].toplevel.style.backgroundColor =
                    colorScheme.lowerwindowborder;
                allWindowsList[windowIndex].panelButton.style.background =
                    colorScheme.lowerpanelcolor;
                allWindowsList[windowIndex].type =
                    'inactive';
            }
        }
    }
}

function raiseWindow(
    window)
{
    lowerAll();
    window.toplevel.style.opacity=1;
    window.toplevel.setAttribute(
        "class",
        "window");
    window.toplevel.style.zIndex=3;
    window.type='active';
    window.panelButton.style.background =
        'linear-gradient(to top, ' +
        colorScheme.activepanelcolor +
        ', ' +
        colorScheme.lowerpanelcolor +
        ')';
}

function raiseDialogWindow(
    window)
{
    lowerAll();
    window.toplevel.style.opacity=1;
    window.toplevel.setAttribute(
        "class",
        "dialogwindow");
    window.toplevel.style.zIndex=3;
    window.type='active';
}

function clickPanelButton(
    window)
{
    if(window.type=='active')
    {
        minimize(window);
    }
    else
    {
        if(window.type == 'inactive')
        {
            raiseWindow(window);
        }
        else
        {
            if(window.type == 'minimized')
            {
                restoreSize(window);
            }
        }
    }
}

function addPanelButton(
    window)
{
    var newbutton = document.createElement("button");
    newbutton.innerHTML = window.titleText;
    newbutton.setAttribute(
        "class",
        "windowButton");
    newbutton.onclick = function()
    {
        clickPanelButton(window)
    };
    panel.appendChild(newbutton);
    return newbutton;
}

function minimize(
    window)
{
    var panelBoundaries = window.panelButton.getBoundingClientRect();
    var windowBoundaries = window.toplevel.getBoundingClientRect();
    window.toplevel.style.transition = minimizetransition;
    window.preMinimizeTop = windowBoundaries.top;
    window.preMinimizeRight = windowBoundaries.right;
    window.preMinimizeLeft = windowBoundaries.left;
    window.toplevel.style.left = panelBoundaries.left;
    window.toplevel.style.right = panelBoundaries.right;
    window.toplevel.style.top = panelBoundaries.top;
    window.preMinimizeWidth = window.toplevel.style.width;
    window.toplevel.style.width = 200;
    window.toplevel.style.opacity = 0;
    window.type = 'minimized'
    window.panelButton.style.background = colorScheme.minipanelcolor;
}

function restoreSize(
    window){
    window.toplevel.style.transition = minimizetransition;
    window.toplevel.style.top = window.preMinimizeTop;
    window.toplevel.style.right = window.preMinimizeRight;
    window.toplevel.style.left = window.preMinimizeLeft;
    window.toplevel.style.width = window.preMinimizeWidth;
    setTimeout(
        function()
        {
            window.toplevel.style.transition = resetMinimizeTransition;
        },
        longestMinimizeTransitionTime);
    raiseWindow(window)
}

function handlemax(
    window)
{
    if(window.maximized===false)
        maximize(window);
    else
        restore(window);
}

function addWindow(
    title,
    width,
    position)
{
    lowerAll();
    if(position == "")
    {
        position = "corner";
    }
    var newwindow = document.createElement("div");
    newwindow.setAttribute(
        "class",
        "window");
    newwindow.style.width = width;
    var screenBounds = document.body.getBoundingClientRect();
    if(position == "center")
    {
        newwindow.style.left =
            (screenBounds.right/2) -
            (width/2) -
            10;
    }
    else
    {
        newwindow.style.left = "10px";
        newwindow.style.right =
            (10 +
             width) +
            "px";
        newwindow.style.top = "10px";
    }
    newwindow.style.transition = resetMinimizeTransition;
    document.body.appendChild(newwindow);
    
    var windowtitle = document.createElement("div");
    windowtitle.setAttribute(
        "class",
        "windowtitle");
    windowtitle.setAttribute(
        "draggable",
        "false");
    windowtitle.setAttribute(
        "onmousedown",
        "return false");
    windowtitle.innerHTML=title;
    newwindow.appendChild(windowtitle);
    
    var windowbody = document.createElement("div");
    windowbody.setAttribute(
        "class",
        "windowbody");
    newwindow.appendChild(windowbody);
    
    var windowclose = document.createElement("button")
    windowclose.setAttribute(
        "class",
        "closebutton");
    windowclose.innerHTML =
        "<img class=closebutton_icon src=windowTools/CloseButton.png></img>";
    newwindow.appendChild(windowclose);

    var windowmax = document.createElement("button")
    windowmax.setAttribute(
        "class",
        "maximizebutton");
    windowmax.innerHTML =
        "<img class=maximizebutton_icon src=windowTools/MaximizeButton.png></img>";
    newwindow.appendChild(windowmax);
    
    var windowminimize = document.createElement("button");
    windowminimize.setAttribute(
        "class",
        "minimizebutton");
    windowminimize.innerHTML =
        "<img class=minimizebutton_icon src=windowTools/MinimizeButton.png></img>";
    newwindow.appendChild(windowminimize);
    
    var grabhandles = document.createElement("div")
    grabhandles.setAttribute(
        "class",
        "grabhandle");
    windowbody.appendChild(grabhandles);
    
    var grabhandleimage = document.createElement("img");
    grabhandleimage.setAttribute(
        "class",
        "ghimage");
    grabhandleimage.setAttribute(
        "src",
        "windowTools/Grabhandle2.png");
    grabhandleimage.setAttribute(
        "draggable",
        "false");
    grabhandleimage.setAttribute(
        "onmousedown",
        "return false");
    grabhandles.appendChild(grabhandleimage);
    
    var resizeActions = [changeWindowSize];
    var windowobject = {
        toplevel: newwindow,
        titleWidget: windowtitle,
        body: windowbody,
        closebutton: windowclose,
        minimizebutton: windowminimize,
        grabhandle: grabhandles,
        titleText: title,
        panelButton: null,
        type:"active",
        preMinimizeLeft:0,
        preMinimizeRight:0,
        preMinimizeTop:0,
        preMinimizeWidth:0,
        resizeEvent:resizeActions,
        preMaximizeLeft: 0,
        preMaximizeRight: 0,
        preMaximizeTop: 0,
        preMaximizeHeight: 0,
        maximized: false
    };
    windowclose.onclick=function()
    {
        closeWindow(windowobject)
    };
    windowmax.onclick=function()
    {
        handlemax(windowobject)
    };
    windowminimize.onclick=function()
    {
        minimize(windowobject)
    };
    windowobject.panelButton=addPanelButton(windowobject);
    windowobject.titleWidget.onmousedown = function(event)
    {
        clickTitleBar(
            event,
            windowobject)
    };
    windowobject.toplevel.onmousedown = function(event)
    {
        clickdown(windowobject)
    };
    windowobject.grabhandle.onmousedown = function(event)
    {
        dragResize(
            event,
            windowobject)
    };
    
    windowobject.toplevel.style.zIndex = 3;
    
    if(position == "center")
    {
        centerWindow(windowobject);
    }
    allWindowsList.push(windowobject);
    return windowobject;
}

function addDialogWindow(
    title,
    width,
    position)
{
    if(position == "")
    {
        position = "center";
    }
    var newwindow = document.createElement("div");
    newwindow.setAttribute(
        "class",
        "dialogwindow");
    newwindow.style.width = width;
    var screenBounds = document.body.getBoundingClientRect();
    if(position == "center")
    {
        newwindow.style.left =
            (screenBounds.right/2) -
            (width/2) -
            10;
    }
    else
    {
        newwindow.style.left = "10px";
        newwindow.style.right =
            (10 +
             width) +
            "px";
        newwindow.style.top = "10px";
    }
    newwindow.style.transition = resetMinimizeTransition;
    document.body.appendChild(newwindow);
    
    var windowtitle = document.createElement("div");
    windowtitle.setAttribute(
        "class",
        "windowtitle");
    windowtitle.setAttribute(
        "draggable",
        "false");
    windowtitle.setAttribute(
        "onmousedown",
        "return false");
    windowtitle.innerHTML=title;
    newwindow.appendChild(windowtitle);
    
    var windowbody = document.createElement("div");
    windowbody.setAttribute(
        "class",
        "windowbody");
    newwindow.appendChild(windowbody);
    
    var windowclose = document.createElement("button")
    windowclose.setAttribute(
        "class",
        "closebutton");
    windowclose.innerHTML =
        "<img class=closebutton_icon src=windowTools/CloseButton.png></img>";
    newwindow.appendChild(windowclose);
    
    //No minimize, we're a dialog.
    
    //No resize, we're a dialog.
    
    var windowobject = {
        toplevel: newwindow,
        titleWidget: windowtitle,
        body: windowbody,
        closebutton: windowclose,
        titleText: title,
        type:"active",
        preMinimizeLeft:0,
        preMinimizeRight:0,
        preMinimizeTop:0,
        preMinimizeWidth:0
    };
    windowclose.onclick=function()
    {
        closeDialogWindow(windowobject)
    };

    windowobject.titleWidget.onmousedown = function(event)
    {
        clickTitleBar(
            event,
            windowobject)
    };
    windowobject.toplevel.onmousedown = function(event)
    {
        clickdialogdown(windowobject)
    };
    
    windowobject.toplevel.style.zIndex = 3;
    var windowBodyBounds = windowbody.getBoundingClientRect();
    var windowToplevelRect = newwindow.getBoundingClientRect();
    if(position == "center"){
        newwindow.style.top = (
            (screenBounds.bottom /
             2) -
                (windowBodyBounds.bottom -
                 windowToplevelRect.top) -
                20);
    }
    return windowobject;
}

function addResizeEventHandler(
    window,
    resizeEventFunction)
{
    window.resizeEvent.push(resizeEventFunction);
}

document.onmouseup = function(
    event)
{
    clickup (event)
};
document.onmousemove = function(
    event)
{
    updatepos(event)
};

function addStartupHook(
    startupFunction)
{
    onPageLoadFinished.push(startupFunction);
}

document.onreadystatechange = function()
{
    if(document.readyState === "complete")
    {
        console.log("Startup complete, loading startup hooks, if any");
        panel = document.getElementById("panel");
        for(
            var i = 0;
            i<onPageLoadFinished.length;
            i++)
        {
            onPageLoadFinished[i]();
        }
    }
};
