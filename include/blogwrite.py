#!/usr/bin/env python3
import authbackend;
import datetime;

"""
This file is built to act as a library to interface with a composer CGI script.
This CGI script will then be AJAX-requested by the frontend. From there, the
user sends auth details to the backend. The composer opens, allowing for edits.
When the user finishes, this script kicks in and populates the folder structure
with the blog/post information.

Please note any to-do comments in the function, as they need to be fixed before
this function can be called "complete"
"""

"""
edit_post()

Updates an existing blog post with new title and body information.
The date and author fields are static.

Arguments:
    post_id - the blog post id. How the post is identified.
    post_title - the NEW post title, will replace whatever was there before
    post_body - the NEW post body, will replace whatever was there before.
                This should also create a backup of the old one in case of
                trolling.
    blog_id - the blog id. How the blog is identified.
    rstring - the authentication random string. Needed to prove login.
    uname - the username the rstring belongs to.

Returns an error code or "SUCCESS"
Table of errors:
    ENOUNAMEDBCON -- When checking the username to get a UID, the database connection
                     farted. This is usually an installation issue.
    ENOUSER -- The username isn't in the database. That means that someone is probably
               either using really bizarre browser settings or they're doing something
               disingenuous.
    DENIED -- The user managed to log in, but their account doesn't have the right
              permissions to edit blog posts. That's when they should contact an admin
              to do it for them or grant them permission to do so.
    EPERMCHECKFAIL -- Something else happened whilst trying to check permissions. Also
                      generally an install error, but nothing here has been tested yet
                      so this one may indicate a real bug.
"""
def edit_post(post_id, post_title, post_body, blog_id, rstring, uname):
    #The user knows their username, but shouldn't know UID. It's on us to grab it...
    uid = authbackend.get_uid_from_name(uname);
    #and process errors as they occur in that process.
    if(uid == "ENODBCONNECT"): return "ENOUNAMEDBCON";
    if(uid == None): return "ENOUSER";
    #Next we check for sign-in authentication. Return ENOAUTH if they aren't signed in correctly
    acheck = check_auth_string(uid, rstring);
    if(acheck == False): return "ENOAUTH";
    #If they're signed in, make sure they can set metadata on blogs.
    pcheck = get_permission(uid, 4);
    if(pcheck == "DENIED"): return "DENIED";
    #There may be a case where the permissions aren't denied but the lookup failed anyhow
    if(pcheck != "GRANTED"): return "EPERMCHECKFAIL";
    #The SQL metadata of course needs a query, it's escaped in the standard way to avoid injection
    query = "update posts set title = %(title)s where blogid = %(blogid) and postid = %(postid)s"
    #and execute is where the data is added
    authbackend.cursor.execute(query, {'title':post_title, 'blogid':blog_id, 'postid':post_id})
    #connection.commit is something that is painful to forget... Don't make that mistake
    #like I did! Virtually impossible to track since there's not much documentation on it
    authbackend.connection.commit();
    #We need to move our existing blog body to a backup location. Once that is done, we then
    #read the existing one and transpose it into the backup.
    blogfile = open("blog/"+str(blogid)+"/"+str(postid), "r");
    backupfile = open("blog/"+str(blogid)+"/"+str(postid)+"~", "w");
    for line in blogfile:
        backupfile.write(line+"\n")
    #With the backup transposed, close the files.
    blogfile.close();
    backupfile.close();
    #Reopen blogfile as write only. From there, write the new contents of the body
    blogfile = open("blog/"+str(blogid)+"/"+str(postid), "w");
    blogfile.write(post_body);
    #close and inform the user things worked. There could be more error checking here, but
    #that got really tedious. TODO: give this a thorough vetting for places errors could happen
    blogfile.close();
    return "SUCCESS";

"""
create_new_blog()

Takes a blog name, author name, and credentials and makes shiny new blogs a reality!
Arugments:
    blog_name -- the propsoed new blog name
    author_full_name -- the screen name of the author
    uname -- the user making the request
    rstring -- that user's random ID
Returns: "SUCCESS" on success
    "ENOUNAMEDBCON" -- While checking for a username, the database connection failed.
    "ENOUSER" -- There is no UID associated with the username that was tried. See edit_post()'s
                 return code information section for more details
    "DENIED" -- The user has insufficient permissions to create a blog.
    "ENOPERMDBCON" -- While looking up permissions the database connection failed.
    "ENOPERMISSON" -- the user has insufficient permissions to create a new blog.
"""
def create_new_blog(blog_name, author_full_name, uname, rstring):
    uid = authbackend.get_uid_from_name(uname);
    if(uid == "ENODBCONNECT"): return "ENOUNAMEDBCON";
    if(uid == None): return "ENOUSER";
    ascheck = authbackend.check_auth_string(uid,rstring);
    if(ascheck == False): return "DENIED";
    apcheck = authbackend.get_permission(uid, 8);
    if(apcheck == "ENODBCONNECT"): return "ENOPERMDBCON";
    if(apcheck == "DENIED"): return "ENOPERMISSION";
    query = "insert into blog (title, author) values (%s, %s)";
    authbackend.cursor.execute(query, (blog_name, author_full_name));
    authbackend.connection.commit();
    query = "select id from blog where title = %(title)s and author = %(author)s"
    authbackend.curosr.execute(query, {'title':blog_name, 'author':author_full_name});
    lastid = 0;
    for (idnum) in authbackend.cursor:
        lastid=idnum;
    os.makedirs("blog/"+str(lastid));
    return "SUCCESS";

"""
create_new_post()

Creates a new post on a blog.

Arguments:
    blog_id -- which blog to add it to
    author_name -- the author's name as they want it to appear on the post
    uname -- the author's user name
    rstring -- the random auth string
Returns: Nothing right now, it's not done.
    "ENOUNAMEDBCON" -- The username database connection failed
    "ENOUSER" -- The authentication process rejected the user's rstring/uname combination.
    "DENIED" -- the user/rstring combination was rejected, whoever it is let their session time out
                or is trying to trick the system.
"""
def create_new_post(blog_id, author_name, title, body, uname, rstring):
    #Check for a UID
    uid = authbackend.get_uid_from_name(uname);
    if(uid == "ENODBCONNECT"): return "ENOUNAMEDBCON";
    if(uid == None): return "ENOUSER";
    #then check their auth tokens and make sure they're fo'real and have a login.
    ascheck = authbackend.check_auth_string(uid, rstring);
    if(ascheck == False): return "DENIED";
    #Now check the user's permissions and rights for that blog...
    apcheck = autbackend.get_permission(uid, 32, blog=blog_id);
    if(apcheck == "ENODBCONNECT"): return "ENOPERMDBCON"; #Error: no permed bacon.. or permissions db connection...
    if(apcheck == "DENIED"): return "ENOPERMISSION";
    query = "insert into posts(blogid, title, date) values (%(blog)s, %(title)s, %(date)s)";
    cdate = str(datetime.date.year)+"-"+str(datetime.date.month)+"-"+str(datetime.date.day)
    authbackend.cursor.execute(query, {'blog':blog_id, 'title':title, 'date': cdate});
    authbackend.connection.commit();
    query = "select postid from posts where blogid = %(blog)s and title = %(title)s and date = %(date)s";
    authbackend.cursor.execute(query, {'blog':blog_id, 'title':title, 'date': cdate});
    posts = 0;
    for (postid) in authbackend.cursor:
        posts = postid;
    newpostbody = open("blog/"+blog_id+"/"+posts+".post.txt", "w");
    newpostbody.write(body);
