#!/usr/bin/env python3
import cgi;
import authbackend;
from urllib.parse import parse_qsl;
print("Content-Type: text/plain\r\n\r\n");
form = cgi.FieldStorage();
if "login" in form:
    uname = parse_qsl(form["login"]);
    passwd = parse_qsl(form["passwd"]);
    rstring = authbackend.check_password(passwd, uname);
    print("{Response:'"+str(rstring)+"'}");
if "suserperms" in form:
    uname = form["suserperms"];
    rstring = form["rstring"];
    umod = form["umod"];
    mode = form["mode"];
    response = authbackend.set_permissions(uname, rstring, umod, mode);
    print("{Response:'"+response+"'}");
if "chpasswd" in form:
    uname = form["chpasswd"];
    oldpass = form["old"];
    newpass = form["new"];
    print("{Response:'NOT_SUPPORTED'}");
