<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "voice";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(array("status" => "error", "message" => "Connection failed: " . $conn->connect_error)));
}

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['text'])) {
    $text = $data['text'];

    $stmt = $conn->prepare("INSERT INTO texts (content) VALUES (?)");
    $stmt->bind_param("s", $text);

    if ($stmt->execute()) {
        echo json_encode(array("status" => "success"));
    } else {
        echo json_encode(array("status" => "error", "message" => "Failed to save text."));
    }

    $stmt->close();
} else {
    echo json_encode(array("status" => "error", "message" => "Invalid input."));
}

$conn->close();
?>
