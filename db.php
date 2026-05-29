<?php
$host = "127.0.0.1";
$user = "root";
$pass = "password123"; // ← enter your password if you set one, otherwise leave blank
$db   = "business_license";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$conn->set_charset("utf8");
?>
