<?php
require_once '../model/db_connection.php';

header('Content-Type: application/json');

$token = $_GET['token'] ?? '';

if (!$token || strlen($token) !== 5) {
    echo json_encode(['valido' => false, 'mensaje' => 'Token inválido.']);
    exit;
}

try {
    $db = new Database();
    $conexion = $db->connect();

    $stmt = $conexion->prepare("
        SELECT * FROM tokens 
        WHERE token = :token 
        AND fecha_expiracion > NOW()
        ORDER BY fecha_expiracion DESC
        LIMIT 1
    ");
    $stmt->bindParam(':token', $token);
    $stmt->execute();

    $tokenData = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($tokenData) {
        echo json_encode(['valido' => true]);
    } else {
        echo json_encode(['valido' => false, 'mensaje' => 'Token inválido o expirado.']);
    }
} catch (Exception $e) {
    echo json_encode(['valido' => false, 'mensaje' => 'Error en el servidor.']);
}

