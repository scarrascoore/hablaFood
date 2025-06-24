<?php
require_once '../model/db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = $_POST['token'] ?? '';
    $nuevaContrasena = $_POST['nueva_contrasena'] ?? '';
    $confirmarContrasena = $_POST['confirmar_contrasena'] ?? '';

    if (empty($token) || empty($nuevaContrasena) || empty($confirmarContrasena)) {
        exit('Todos los campos son obligatorios.');
    }

    if ($nuevaContrasena !== $confirmarContrasena) {
        exit('Las contraseñas no coinciden.');
    }

    $db = new Database();
    $conn = $db->connect();

    // Verificar que el token exista y no haya expirado
    $stmt = $conn->prepare("SELECT usuario_id, fecha_expiracion FROM tokens WHERE token = :token");
    $stmt->bindParam(':token', $token);
    $stmt->execute();
    $registro = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$registro) {
        exit('Token inválido.');
    }

    if (strtotime($registro['fecha_expiracion']) < time()) {
        exit('El token ha expirado.');
    }

    $usuarioId = $registro['usuario_id'];

    // Actualizar la contraseña (encriptada)
    $hash = password_hash($nuevaContrasena, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("UPDATE usuarios SET contrasena = :contrasena WHERE id = :id");
    $stmt->bindParam(':contrasena', $hash);
    $stmt->bindParam(':id', $usuarioId);
    $stmt->execute();

    // Eliminar el token para que no se pueda reutilizar
    $stmt = $conn->prepare("DELETE FROM tokens WHERE token = :token");
    $stmt->bindParam(':token', $token);
    $stmt->execute();

    echo 'Contraseña actualizada correctamente. Puedes iniciar sesión ahora.';
}
?>
