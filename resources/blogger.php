/*
This object will be used for saving information written 
in the composer view and turning into a blog.cfg file. This
blog.cfg file will contain a title, post tile, and a post
body. 

Right now this file only contains a class with a blog title 
and a blog post. This file will likely contain more metadata 
that will be stored within a database.
*/

<?php
//Global variables



class BlogPost
{
	var $title;
	var $post;
	
	function __construct($titleIn, $postIn)
	{
		$this->title = $titleIn;
		$this->post = $postIn;
	}
	
	function saveBlog()
	{
		
	}
	
	function makeForm()//TODO implement to generate a readable form from an object
	{
		
	}
}