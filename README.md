#Framingham State University Computer Science Club Wobsite
##Introduction

The CS club at Framingham State had no webiste, and now we are making one.
If you've followed what I'm saying this far, you understand what this project is.

##Technical information
This site is currently a massive custom JavaScript windowing library with some skinning and example windows. For now, it includes custom art and an index page which sets it apart (mildly) from just the bare toolkit.

Implemented features include:

- windowing model
- two-layer stacking
- start-like menu (Kickoff may be a better parallel, but no search)
- taskbar with single-function buttons (raise that window)
- window move opacity
- window resize
- basic animations (in some paces)

While this is not a complete feature set, it is most of the superficial ones which are easy to spot. Being as lightweight as it is, it executes very fast, even on older hardware.

All that being said, there's no mobile site yet so please use a desktop browser for the time being.

##Internal Information
On a more internal level, the widget toolkit operates in the following way:
- HTML code contains start menu, panel, background
- CSS defines all stlying through central widgetTools.css file. This can be extended through other stylesheets loaded later, but the widgetTools.css page defines the basics.
- widgetTools.js handles all windowing logic. A good name for this toolkit, following the example of the two major files, might be widget tools.
- Windows are NOT DOM nodes, but in fact they are their own object, containing all the elements the program needs to work with.
- These objects are manipulated using functions that are built in and designed to allow some purpose-built HTML code to be a part of a window.
- Each window initilizes itself with a single command (addWindow(title, width)) which returns such a window object.
