<?php

$host = "127.0.0.1";
$dbname = "ferns_petals";
$username = "ferns_user";
$password = "ChangeThisPassword123!";

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password
    );

    $pdo->setAttribute(
        PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION
    );


} catch (PDOException $e) {
    die("Database error: " . $e->getMessage());
}