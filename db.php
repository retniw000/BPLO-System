<?php
$host = "sql308.infinityfree.com";
$user = "if0_42163601";
$pass = "89g1fV7LX8MB"; 
$db   = "if0_42163601_business_license";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$conn->set_charset("utf8");
?>