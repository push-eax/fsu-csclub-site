#!/usr/bin/env python3
import mysql.connector;
import authbackend;

"""
This file is built to act as a library to interface with a composer CGI script.
This CGI script will then be AJAX-requested by the frontend. From there, the
user sends auth details to the backend. The composer opens, allowing for edits.
When the user finishes, this script kicks in and populates the folder structure
with the blog/post information.
"""

def send_blog_info(post_title, post_body, blog_name, rstring, uname):
    pass; #TODO: Pass along the rstring to auth, then post title to database, body to disk if good

def create_new_blog(blog_name, author_full_name):
    pass; #TODO: Allow certain users to create blogs for others

def set_blog_owner(blog_name, user_name):
    pass; #TODO: interface with auth backend to let admins set blog permissions

def set_edit_permissions(blog_name, user_name):
    pass; #TODO: interface with auth backend to let admins set blog permissions
