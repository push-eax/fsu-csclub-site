#!/usr/bin/env python3
import authbackend;

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
set_blog_info()

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
"""
def set_blog_info(post_id, post_title, post_body, blog_id, rstring, uname):
    uid = authbackend.get_uid_from_name(uname);
    if(uid == "ENODBCONNECT"): return "ENOUNAMEDBCON";
    if(uid == None): return "ENOUSER";
    acheck = check_auth_string(uid, rstring);
    if(acheck == False): return "ENOAUTH";
    pcheck = get_permission(uid, 4);
    if(pcheck == "DENIED"): return "DENIED";
    if(pcheck != "GRANTED"): return "EPERMCHECKFAIL";
    query = "update posts set title = %(title)s where blogid = %(blogid) and postid = %(postid)s"
    authbackend.cursor.execute(query, {'title':post_title, 'blogid':blog_id, 'postid':post_id})
    authbackend.connection.commit();
    blogfile = open("blog/"+str(blogid)+"/"+str(postid), "r");
    backupfile = open("blog/"+str(blogid)+"/"+str(postid)+"~", "w");
    for line in blogfile:
        backupfile.write(line+"\n")
    blogfile.close();
    backupfile.close();
    blogfile = open("blog/"+str(blogid)+"/"+str(postid), "w");
    blogfile.write(post_body);
    blogfile.close();
    return "SUCCESS";

def create_new_blog(blog_name, author_full_name, uname, rstring):
    uid = authbackend.get_uid_from_name(uname);
    if(uid == "ENODBCONNECT"): return "ENOUNAMEDBCON";
    if(uid == None): return "ENOUSER";
    pass; #TODO: Allow certain users to create blogs for others

def set_blog_owner(blog_name, user_name):
    pass; #TODO: interface with auth backend to let admins set blog permissions

def set_edit_permissions(blog_name, user_name):
    pass; #TODO: interface with auth backend to let admins set blog permissions
