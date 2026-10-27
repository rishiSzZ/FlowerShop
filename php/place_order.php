<?php

header("Content-Type: application/json");

require_once "db.php";

function sendResponse($success, $message, $extra = [], $status = 200)
{
    http_response_code($status);

    echo json_encode(array_merge([
        "success" => $success,
        "message" => $message
    ], $extra));

    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    sendResponse(false, "Invalid request method.", [], 405);
}

$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
    sendResponse(false, "Invalid JSON data.", [], 400);
}

// Read and validate customer details
$name = trim($data["customer_name"] ?? "");
$email = trim($data["email"] ?? "");
$phone = trim($data["phone"] ?? "");
$address = trim($data["address"] ?? "");
$city = trim($data["city"] ?? "");
$pincode = trim($data["pincode"] ?? "");
$payment = trim($data["payment_method"] ?? "");
$items = $data["items"] ?? [];

if (
    $name === "" ||
    !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    !preg_match('/^[0-9]{10}$/', $phone) ||
    $address === "" ||
    $city === "" ||
    !preg_match('/^[0-9]{6}$/', $pincode)
) {
    sendResponse(false, "Please enter valid delivery details.", [], 400);
}

$allowedPayments = [
    "Cash on Delivery",
    "UPI",
    "Credit / Debit Card"
];

if (!in_array($payment, $allowedPayments, true)) {
    sendResponse(false, "Invalid payment method.", [], 400);
}

if (!is_array($items) || count($items) === 0) {
    sendResponse(false, "Your cart is empty.", [], 400);
}

if (count($items) > 100) {
    sendResponse(false, "Too many items in the order.", [], 400);
}

try {
    $pdo->beginTransaction();

    $total = 0;
    $orderItems = [];

    // Retrieve the actual product names and prices from MariaDB.
    $productQuery = $pdo->prepare(
        "SELECT id, name, price
         FROM products
         WHERE id = ?
         FOR UPDATE"
    );

    foreach ($items as $item) {
        $productId = filter_var(
            $item["product_id"] ?? null,
            FILTER_VALIDATE_INT
        );

        $quantity = filter_var(
            $item["quantity"] ?? null,
            FILTER_VALIDATE_INT
        );

        if (
            $productId === false ||
            $productId === null ||
            $productId < 1 ||
            $quantity === false ||
            $quantity === null ||
            $quantity < 1 ||
            $quantity > 100
        ) {
            throw new Exception("Invalid product or quantity.");
        }

        $productQuery->execute([$productId]);
        $product = $productQuery->fetch(PDO::FETCH_ASSOC);

        if (!$product) {
            throw new Exception(
                "One of the products in your cart no longer exists."
            );
        }

        $price = (float) $product["price"];
        $subtotal = $price * $quantity;

        $total += $subtotal;

        $orderItems[] = [
            "product_id" => (int) $product["id"],
            "product_name" => $product["name"],
            "quantity" => $quantity,
            "price" => $price
        ];
    }

    // Save the main order.
    $orderQuery = $pdo->prepare(
        "INSERT INTO orders
        (
            customer_name,
            email,
            phone,
            address,
            city,
            pincode,
            payment_method,
            total_amount,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')"
    );

    $orderQuery->execute([
        $name,
        $email,
        $phone,
        $address,
        $city,
        $pincode,
        $payment,
        number_format($total, 2, ".", "")
    ]);

    $orderId = (int) $pdo->lastInsertId();

    // Save every item belonging to this order.
    $itemQuery = $pdo->prepare(
        "INSERT INTO order_items
        (
            order_id,
            product_id,
            product_name,
            quantity,
            price
        )
        VALUES (?, ?, ?, ?, ?)"
    );

    foreach ($orderItems as $item) {
        $itemQuery->execute([
            $orderId,
            $item["product_id"],
            $item["product_name"],
            $item["quantity"],
            $item["price"]
        ]);
    }

    $pdo->commit();

    sendResponse(true, "Order placed successfully.", [
        "order_id" => $orderId,
        "total_amount" => round($total, 2)
    ]);

} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log("Order placement error: " . $e->getMessage());

    if ($e instanceof PDOException) {
        sendResponse(
            false,
            "A database error occurred while placing your order. Please try again.",
            [],
            500
        );
    }

    sendResponse(false, $e->getMessage(), [], 400);
}