/*
This script will be used for saving information written 
in the composer view and turning into a blog.cfg file. This
blog.cfg file will contain a title, post tile, and a post
body. 

*/

/*
TODO 
    parse string(s) passed from the composer view
    convert special whitespace chracters and markers
        (IE Bold Italics and Underline) into escape 
        sequences
    dump output into blog.cfg file
    (optional)
    think of a way to edit existing blogs
*/
<?php


$blog = $_POST['body'];
$file = "testblog.ini"
echo fwrite($file, $blog);
fclose($file);