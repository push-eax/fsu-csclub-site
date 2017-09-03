var icontheme = "default";

function makeWidgetSpace()
{
    var widgetSpace = document.createElement("div");
    widgetSpace.setAttribute(
        "class",
        "widgetSpace");
    return widgetSpace;
}

function makeToolbar(widgetSpace)
{
    var newToolbar = document.createElement("div");
    newToolbar.setAttribute(
        "class",
        "toolbar");
    widgetSpace.appendChild(newToolbar);
    return newToolbar;
}

function makeSubToolbar(widgetSpace)
{
    var newToolbar = document.createElement("div");
    newToolbar.setAttribute(
        "class",
        "subtoolbar");
    widgetSpace.appendChild(newToolbar);
    return newToolbar;
}

function makeSection(widgetSpace){
    var newSection = document.createElement("div");
    newSection.setAttribute(
        "class",
        "section");
    widgetSpace.appendChild(newSection);
    return newSection;
}

function makeButton(
    parent,
    type,
    text)
{
    var newButton = document.createElement("button");
    newButton.setAttribute(
        "class",
        type);
    newButton.innerHTML = text;
    parent.appendChild(newButton);
    var buttonObject = {
        button:newButton,
        type:type,
        state:"normal"
    };
    return buttonObject;
}

function makeTextArea(parent)
{
    var newTextArea = document.createElement("div");
    newTextArea.setAttribute(
        "class",
        "filltext");
    newTextArea.setAttribute(
        "contenteditable",
        "true")
    parent.appendChild(newTextArea);
    return newTextArea;
}

function makePlainTextArea(parent)
{
    var newTextArea = document.createElement("textarea");
    newTextArea.setAttribute(
        "class",
        "filltext");
    parent.appendChild(newTextArea);
    return newTextArea;
}

function syncTextAreas(
    plainTextArea,
    divTextArea)
{
    plainTextArea.onkeyup=function()
    {
        divTextArea.innerHTML=plainTextArea.value;
    }
    divTextArea.onkeyup=function()
    {
        plainTextArea.value=divTextArea.innerHTML;
    }
}

function makeNotebook(parent)
{
    var container = document.createElement("div");
    var newTabbar = document.createElement("div");
    newTabbar.setAttribute(
        "class",
        "tabbar");
    container.appendChild(newTabbar);
    parent.appendChild(container);
    var notebook = {
        tabbar: newTabbar,
        toplevel: container,
        tablist: [],
        currenttab: null
    };
    return notebook;
}

function selectTab(
    notebook,
    tab)
{
    for(
        var tabIndex = 0;
        tabIndex < notebook.tablist.length;
        tabIndex++)
    {
	notebook.tablist[tabIndex].widgetSpace.setAttribute(
            "class",
            "hidden");
	notebook.tablist[tabIndex].button.button.setAttribute(
            "class",
            "tabbutton");
    }
    tab.widgetSpace.setAttribute(
        "class",
        "tab");
    tab.button.button.setAttribute(
        "class",
        "tabbtnsel");
    tab.button.type="tabbtnsel";
    notebook.currenttab = tab;
}

function addTab(
    notebook,
    title)
{
    var newbutton = makeButton(
        notebook.tabbar,
        "tabbtnsel",
        title);
    var widgetSpace = makeWidgetSpace();
    widgetSpace.setAttribute(
        "class",
        "tab");
    if(notebook.currenttab != null)
    {
	widgetSpace.setAttribute(
            "class",
            "hidden");
	newbutton.button.setAttribute(
            "class",
            "tabbutton");
	newbutton.type = "tabbutton";
    }
    var newtab = {
        button: newbutton,
        widgetSpace: widgetSpace
    };
    newbutton.button.onclick = function()
    {
        selectTab(
            notebook,
            newtab);
    };
    notebook.toplevel.appendChild(widgetSpace);
    notebook.tablist.push(newtab);
    if(notebook.currenttab == null)
	notebook.currenttab = newtab;
    return newtab;
}

function makeLabel(
    parent,
    text)
{
    var newLabel = document.createElement("div");
    newLabel.setAttribute(
        "class",
        "labelText");
    newLabel.innerHTML=text;
    parent.appendChild(newLabel);
    return newLabel;
}

function makeTable(parent)
{
    var newtable = document.createElement("table");
    newtable.setAttribute(
        "class",
        "table");
    parent.appendChild(newtable);
    return newtable;
}

function makeTableWithData(
    parent,
    borders,
    values)
{
    var newtable = document.createElement("table");
    newtable.setAttribute(
        "class",
        "table");
    for(
        var tableRowIndex = 0;
        tableRowIndex < values.length;
        tableRowIndex++)
    {
	var newtr = document.createElement("tr");
	for(
            var tableDataIndex = 0;
            tableDataIndex < values[tableRowIndex].length;
            tableDataIndex++)
        {
	    var newtd = document.createElement("td");
	    newtd.innerHTML = values[tableRowIndex][tableDataIndex];
	    if(borders) newtd.setAttribute(
                "class",
                "tabledata");
	    newtr.appendChild(newtd);
	}
	newtr.setAttribute(
            "class",
            "tablerow");
	newtable.appendChild(newtr);
    }
    parent.appendChild(newtable);
    return newtable;
}

function makeTableRow(parent)
{
    var newtablerow = document.createElement("tr");
    newtablerow.setAttribute(
        "class",
        "tablerow");
    parent.appendChild(newtablerow);
    return newtablerow;
}

function makeTableData(
    parent,
    tdata,
    borderless=false)
{
    var newtabledata = document.createElement("td");
    newtabledata.innerHTML=tdata;
    if(borderless == false)
    {
	newtabledata.setAttribute(
            "class",
            "tabledata");
    }
    parent.appendChild(newtabledata);
    return newtabledata;
}

function makeRule(parent)
{
    var newrule = document.createElement("hr");
    parent.appendChild(newrule);
    return newrule;
}

function makeForm(
    parent,
    action = "")
{
    var newform = document.createElement("form");
    newform.setAttribute(
        "action",
        action);
    parent.appendChild(newform);
    return newform;
}

function makeInput(
    parent,
    type,
    value = "",
    name = "")
{
    var input = document.createElement("input");
    input.setAttribute(
        "type",
        type);
    if(type == "text")
        input.setAttribute(
            "class",
            "text");
    if(type == "password")
        input.setAttribute(
            "class",
            "text");
    if(value != "")
        input.setAttribute(
            "value",
            value);
    if(name != "")
        input.setAttribute(
            "name",
            name);
    parent.appendChild(input);
    return input;
}

function makeSelect(
    parent,
    options)
{
    var select = document.createElement("select");
    for(
        var optionIndex = 0;
        optionIndex < options.length;
        optionIndex++)
    {
	var newoption = document.createElement("option");
	newoption.setAttribute(
            "value",
            options[optionIndex][0]);
	newoption.innerHTML=options[optionIndex][1];
	select.appendChild(newoption);
    }
    select.setAttribute(
        "class",
        "combo");
    parent.appendChild(select);
    return select;
}

function makeIcon(
    parent,
    text,
    iconname)
{
    var icontoplevel = document.createElement("div");
    icontoplevel.setAttribute(
        "class",
        "icon");
    icontoplevel.setAttribute(
        "tabindex",
        "0");
    var iconimg = document.createElement("img");
    iconimg.setAttribute(
        "src",
        "resources/icons/" +
            icontheme +
            "/" +
            iconname +
            ".png");
    iconimg.setAttribute(
        "class",
        "icon");
    var icontext = document.createElement("p");
    icontext.setAttribute(
        "class",
        "icon");
    icontext.innerHTML=text;
    icontoplevel.appendChild(iconimg);
    icontoplevel.appendChild(icontext);
    parent.appendChild(icontoplevel);
    return icontoplevel;
}

function setWidgetText(
    parent,
    text)
{
    parent.innerHTML = text;
}

function setButtonToggled(button)
{
    button.button.setAttribute(
        "class",
        "toggled");
    button.state="toggled";
}

function setButtonUntoggled(button)
{
    button.button.setAttribute(
        "class",
        button.type);
    button.state="normal"
}

function setClickAction(
    widget,
    funct)
{
    widget.onmousedown = funct;
}

function setDblClickAction(
    widget,
    funct)
{
    widget.ondblclick = funct;
    widget.ontouchend = funct;
}

