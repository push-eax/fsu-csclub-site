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
        $DB_USER = 'fsucs';
        $DB_PASS = 'computer_science';
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
        /*
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
		*/
		$ret = [];
		$ret["title"] = "You've been fooled, Son!";
		$ret["body"] = "You thought you'd get a blog, instead you got snark!<br>Guru meditation: 450-" . $argv[0] . "-*";
		return $ret;
    }

	/**
	  getpost() retrieves a post given a blog id and a post id and returns the post encoded as JSON.

	  Note: arguments are strict. Argument 1 is the blog id, argument 2 is the post id.

	  With argument "*" it will do truely evil things, like return multiple posts to one window
	  */
	protected function getpost($argv){
		//this function relies on more exact data than the others, bear in mind when using.
		if ($argv[0] == "*"){
			$ret["title"] = "ERROR! ERROR! ERROR!";
			$ret["body"] = "Invalid blog id! Some programmer probably thought they could get cheap.<br>Guru meditation: 500-*-*";
			return $ret;
		}
		if ($argv[1] == "*"){
			$res = $this->db->query("select * from posts where blogid = " . $argv[0]);
			$ret = $res->fetch_all();

			foreach($ret as &$arr){
				$bodypath = "blog/" . $arr["blogid"] . "/" . $arr["postid"] . ".post.txt";
				$body = fopen($bodypath, "r");
				$arr["body"] = fread($body, filesize($bodypath));
			}
			return $ret;
		}
		$res = $this->db->query("select * from posts where blogid = " . $argv[0] . " and postid = " . $argv[1]);
		$ret = $res->fetch_array(MYSQLI_ASSOC);
		$ret["body"] = "";
		//Now to construct the body, we have the header information, but we need to parse the fs to
		//get blog/post data.
		$bodypath="blog/" . $ret["blogid"] . "/" . $ret["postid"] . ".post.txt";
		$body = fopen($bodypath, "r");
		$ret["body"] = fread($body, filesize($bodypath)) or $ret["body"] = "Internal error 404<br>Guru meditation: 404-" . $ret["blogid"] . "-" . $ret["postid"];
		fclose($body);
		return $ret;
	}

	protected function makeblog($argv){
		return "Ask an admin, stupid. Guru meditation: 444-" . $argv[0];
	}

	protected function makepost($argv){
		return "We need an auth system first. Please do this manually or with the help of an admin for the moment. Guru meditation: 501-" . $argv[0];
	}
    
     /**
     * modblog() deletes, creates, and updates blog posts.
     * @return string
     */
    protected function modblog($args) {
        
        //$verb = $args[0];
        
        
        
        return $args;
    }

	/**
	  getAuthId() gets a randomly generated auth id from the server
	  in order to run a login session. It launches the password checking
	  system which then sends an id if OK or "NOLOGIN" if failed.
	*/
	protected function getAuthId($args){
		/*
		   getAuthId needs to query another process with the password hashed from the client. It then should
		   get a random ID. the random id will be stored in the database separate, so that it can act as a
		   temporary login token. These tokens should last about 15 minutes before they die.
		*/
	}

}
