<?php

header("Content-Type: application/json; charset=utf-8");

require_once "db.php";

try {
    $stmt = $pdo->query(
        "SELECT id, name, description, price, image
         FROM products
         ORDER BY id"
    );

    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($products);

} catch (PDOException $e) {
    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        "error" => "Unable to retrieve products."
    ]);
}
