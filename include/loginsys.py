#!/usr/bin/env python3
import cgi
import authbackend
print("Content-Type: text/plain\r\n\r\n");
form = cgi.FieldStorage();
if "login" in form:
    uname = form["login"];
    passwd = form["passwd"];
    rstring = check_password(passwd, uname);
    print("{Response:'"+str(rstring)+"'}");
if "suserperms" in form:
    uname = form["suserperms"];
    rstring = form["rstring"];
    umod = form["umod"];
    mode = form["mode"];
if "chpasswd" in form:
    uname = form["chpasswd"];
    print("{Response:'NOT_SUPPORTED'}");
