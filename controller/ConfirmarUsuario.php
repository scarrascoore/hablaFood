<?php
require_once '../model/db_connection.php';

if (!isset($_GET['token'])) {
    echo "Token no proporcionado.";
    exit;
}

$token = $_GET['token'];

$db = new Database();
$conn = $db->connect();

try {
    // Buscar token válido
    $stmt = $conn->prepare("SELECT usuario_id, fecha_expiracion FROM tokens WHERE token = :token AND tipo = 'confirmacion_usuario'");
    $stmt->bindParam(':token', $token);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        echo "Token inválido o ya fue usado.";
        exit;
    }

    if (strtotime($row['fecha_expiracion']) < time()) {
        echo "Token expirado.";
        exit;
    }

    // Confirmar email
    $usuario_id = $row['usuario_id'];
    $stmt = $conn->prepare("UPDATE usuarios SET confirmado_email = 1 WHERE id = :id");
    $stmt->bindParam(':id', $usuario_id);
    $stmt->execute();

    // Eliminar token
    $stmt = $conn->prepare("DELETE FROM tokens WHERE token = :token");
    $stmt->bindParam(':token', $token);
    $stmt->execute();

    echo "Tu cuenta ha sido confirmada correctamente. ¡Gracias por unirte a Habla Food!";
} catch (PDOException $e) {
    echo "Error al confirmar: " . $e->getMessage();
}
