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
        
        /*
        // Prepare statements
        if (!($getblog_statement = $this->db->prepare("SELECT * FROM blog WHERE id = ?"))) {
            echo "Prepare failed: (" . $this->db->errno . ") " . $this->db->error;
        }*/
                
        
        // TODO: Implement user authentication
    }

    /**
     * searchblog() searches through all blogs' title and author for a given string.
     * @return string
     */
    protected function searchblog($args) {
        
        // TODO: use prepare() to fix SQLi
        /*
        $ret;
        
        if (!($query = $this->db->prepare("SELECT * FROM blog WHERE title LIKE '%TESTBLOG2%'"))) {
            echo "Prepare failed: (" . $this->db->errno . ") " . $this->db->error;
        }
        //$query->bind_param("s", &$args[0]);
        $query->execute();
        $query->bind_result($ret);
        $query->fetch();*/
        $res = $this->db->query("SELECT * FROM blog WHERE title LIKE '%" . $args[0] . "%' OR author LIKE '%" . $args[0] . "%'");
        $ret = $res->fetch_all(); //get_result();//->fetch_assoc();
        
        return $ret;
    }
    
    /**
     * getblog() retrieves a blog post given a blog ID and returns the post encoded as JSON.
     * With argument "*", it will return a list of all blogs.
     * @return string
     */
    protected function getblog($args) {
        // Query the database
        // TODO: fix SQLi vulnerability
        
        if ($args[0] == "*") {
            $res = $this->db->query("SELECT * FROM blog");
            $ret = $res->fetch_all();
            
            foreach ($ret as &$arr) {
                $bodypath = "blog/" . $arr[0];
                $body = fopen($bodypath, "r");
                array_push($arr, fread($body, filesize($bodypath)));
            }
            
            return $ret;
        } else {
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
    }
    
     /**
     * modblog() deletes, creates, and updates blog posts.
     * @return string
     */
    protected function modblog($args) {
        
        //$verb = $args[0];
        
        
        
        return $args;
    }
}
