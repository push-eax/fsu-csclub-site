<?php

/*
This class will handle individual blogposts and organize
them into a single blog. It does this by handling an array
of BlogPosts
*/

require 'blogger.php';

class Blog
{
	public $title
	public $blogPosts
	
	function __construct($titleIn)
	{
		$this->title = $titleIn;
		$this->blogPosts = array();
	}
	
	function addBlogPost($postTitle, $postBody)
	{
		$blogPosts[] = new BlogPost(postTitle, postBody);
	}
}