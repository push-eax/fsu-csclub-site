<?php

/**
 * 
 *
 * @author kroche
 */

error_reporting(E_ERROR | E_PARSE);

require_once './include/fsuapi.php';

try {
    $API = new FSUApi($_REQUEST['request'], $_SERVER['HTTP_ORIGIN']);
    echo $API->processAPI();
} catch (Exception $e) {
    echo json_encode(Array('error' => $e->getMessage()));
}