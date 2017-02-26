<?php

/*
This class will handle individual blogposts and organize
them into a single blog. It does this by handling an array
of BlogPosts. This is useful for allowing us to easily edit, 
add, or remove blogpposts once everything is set up. 
*/

require 'BlogPost.php';

class Blog
{
	public $title
	public $blogPosts
	
	function __construct($titleIn)
	{
		$this->title = $titleIn;
		$this->blogPosts = array();
	}
	
	/*
	This adds a blogPost object to the array. 
	*/
	
	function addBlogPost($postTitle, $postBody)
	{
		$blogPosts[] = new BlogPost(postTitle, postBody);
	}
	
	/*
	Dumps info into ini file
	*/
	function writeToFile()
	{
		$filename = "../blog/" . $title . ".ini";
		$blogFile = fopen($filename);
		
		fwrite($blogFile, "[blog]\ntitle = " . $title . "\n";
		
		foreach ($blogPosts as $post)
		{
			fwrite($blogFile, $post);
		}
		
		fclose($blogFile);
	}
}