<?php

/**
 * 
 *
 * @author kroche
 */

define('fsucs', '');

require_once 'config.php';
require_once 'api.php';

class FSUApi extends API {

    protected $User;

    public function __construct($request, $origin) {
        parent::__construct($request);
        
        // TODO: Implement authentication
    }

    /**
     * searchblogs() searches through all blogs' title and author for a given string.
     * With no argument, it will return a list of all blogs.
     * @return string
     */
    protected function searchblogs() {
        return "searchblogs()";
    }
    
    /**
     * getblog() retrieves a blog post given a blog ID.
     * @return string
     */
    protected function getblog() {
        return "getblog()";
    }
    
     /**
     * modblog() deletes, creates, and updates blog posts.
     * @return string
     */
    protected function modblog() {
        return "modblog()";
    }
}
