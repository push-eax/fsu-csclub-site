#!/usr/bin/env python3
import cgi;
import sys;
import blogwrite;
sys.stdout.write("Content-Type: text/plain\r\n\r\n");
form = cgi.FieldStorage();
if "makepost" in form:
    title = form["makepost"].value;
    blogid = form["blogid"].value;
    aname = form["author"].value;
    body = form["body"].value;
    uname = form["uname"].value;
    rstring = form["rstring"].value;
    response = blogwrite.create_new_post(blogid, aname, title, body, uname, rstring);
    print('{"Response":"'+response+'"}')
else:
    print('{"Response":"ENOCOMMAND"}');
