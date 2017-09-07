<h1>Framingham State University Computer Science Club Wobsite</h1>

## Introduction

Hello, interweb user! You have found the source repository for the Framingham State University Computer Science club website. This site is undergoing heavy development still, but includes most of the basic intended features at this point.

The site revolves around a desktop-in-a-browser. This means the site has a start menu, it has windows you can drag, open and close, and create multiple of. It also includes maxmize and minimize. The end goal is to have a site that allows a user to post and view blog posts written by students who are members of the club.

<h2>Technical information</h2>

This site is currently a massive custom JavaScript windowing library with some skinning and example windows. For now, it includes custom art and an index page which sets it apart (mildly) from just the bare toolkit.

Implemented features include:

- windowing model
- two-layer stacking
- start-like menu (Kickoff may be a better parallel, but no search)
- taskbar with window buttons which can raise, minimize, and restore
- window move opacity
- window resize with opacity
- minimize/restore animations, menu animations
- window maximize/restore
- basic touch events
- basic database interactions
- basic CGI setup
- Blog browsing
- (untested!) blog creation (not editing)

While this is not a complete feature set, it is most of the superficial ones which are easy to spot. Being as lightweight as it is, it executes very fast, even on older hardware.

Our next step is polishing the mobile site, as it works but is not fabulous in the form it's in at the time of writing.

<h2>Internal Information</h2>

On a more internal level, the widget toolkit operates in the following way:
- HTML code contains start menu, panel, background
- CSS defines all stlying through central widgetTools.css file. This can be extended through other stylesheets loaded later, but the widgetTools.css page defines the basics. windoTools.js includes defaults for window placement, animations, etc. This is where the lightweight and performence-centric side of the site comes from.
- widgetTools.js handles all windowing logic.
- windowTools.js handles windowing stuff.
- Windows are NOT DOM nodes, but in fact they are their own object, containing all the elements the program needs to work with.
- These objects are manipulated using functions that are built in and designed to allow some purpose-built HTML code to be a part of a window.
- Each window initilizes itself with a single command (addWindow(title, width, position)) which returns such a window object.

There are many more features and niceities, but they are more dry implementation things. As an example, the wallpapering system.

Note that the code for this site does use cookies to store wallpaper info

<a href="https://binbashworks.blogspot.com/2017/02/web-programming-desktop-with-javascript.html">Post on CannonContraption's Blag about Creating the site</a>