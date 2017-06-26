#!/usr/bin/env python3
import cgi;
import cgitb;
print("Content-type: text/html\r\n\r\n");
cgitb.enable();
form = cgi.FieldStorage();
print("<html><head>");
print("<title>CGI Test Script</title>")
print("</head><body>");
if "test" in form:
    print("<h1>Test = "+form["test"].value+"</h1>");
else:
    print("<h1>set test= in query to make this say something else</h1>")
print("<p>If you see a nicely formatted web page, albeit without any CSS to speak of, this script works fine and you can rely on Python CGI scripting to work in the website.</p>");
"""
NOTICE: IF YOU SEE THIS TEXT IN A BROWSER THERE IS SOMETHING REALLY WRONG WITH YOUR SETUP.

Please revisit your server configuration and ensure that CGI script support is enabled for the directory the CS Club site resides in. If it is left off, all priviliged tasks will fail from within the interface.
"""
print("</body></html>")
#'Cave Johnson, We're Done Here.'
