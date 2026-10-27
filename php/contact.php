<?php

header("Content-Type: application/json; charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "POST requests only."]);
    exit;
}

require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid request data."]);
    exit;
}

$name = trim($data["name"] ?? "");
$email = trim($data["email"] ?? "");
$phone = trim($data["phone"] ?? "");
$message = trim($data["message"] ?? "");

if ($name === "" || $email === "" || $message === "") {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Name, email, and message are required."]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Please enter a valid email address."]);
    exit;
}

try {
    $stmt = $pdo->prepare(
        "INSERT INTO contact_messages (name, email, phone, message)
         VALUES (:name, :email, :phone, :message)"
    );

    $stmt->execute([
        ":name" => $name,
        ":email" => $email,
        ":phone" => $phone !== "" ? $phone : null,
        ":message" => $message
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Your message has been submitted successfully."
    ]);

} catch (PDOException $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Unable to save your message. Please try again."
    ]);
}
