<?php
/*
This will ba an object to contain all of the information in
a typical blog post. This file handles only the post, the blog
as a whole is handles through a different file

Right now this file only contains a class with a blog title 
and a blog post. This file will likely contain more metadata 
that will be stored within a database.
*/


class BlogPost
{
	var $title;
	var $post;
	
	function __construct($titleIn = null, $postIn = null)
	{
		$this->title = $titleIn;
		$this->post = addcslashes($postIn);
	}

	/*
	returns object as a string formatted as a post
	in the blog.cfg file.
	*/
	
	public function __toString()
	{
		return "[post]\ntitle = " . $this->title . "\nbody = " . $this->post . "\n";
	}
}