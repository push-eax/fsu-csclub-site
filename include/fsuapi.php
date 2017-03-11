<?php

/**
 * 
 *
 * @author kroche
 */

require_once 'api.php';

class FSUApi extends API {

    protected $User;
    private $db;

    public function __construct($request, $origin) {
        parent::__construct($request);
        
        // Database auth information
        $DB_HOST = 'localhost';
        $DB_USER = 'root';
        $DB_PASS = 'root';
        $DB_NAME = 'fsucs';

        // Initialize database object
        $this->db = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);
        if ($this->db->connect_errno) {
            echo "Failed to connect to MySQL: (" . $this->db->connect_errno . ") " . $this->db->connect_error;
        }
        
        // TODO: Implement user authentication
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
     * getblog() retrieves a blog post given a blog ID and returns the post encoded as JSON.
     * @return string
     */
    protected function getblog($args) {
        // Query the database
        // TODO: fix SQLi vulnerability
        $res = $this->db->query("SELECT * FROM blog WHERE id = " . $args[0]);
        
        $ret = $res->fetch_array(MYSQLI_ASSOC); // return associative array
        $ret["body"] = "";
        
        // Blog body files are named by id in blog/
        $bodypath = "blog/" . $ret["id"];
        $body = fopen($bodypath, "r");
        $ret["body"] = fread($body, filesize($bodypath)) or $ret["body"] = "Blog not found.";
        fclose($body);
        
        return $ret;
    }
    
     /**
     * modblog() deletes, creates, and updates blog posts.
     * @return string
     */
    protected function modblog() {
        return "modblog()";
    }
}
