<?php
require_once '../model/db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $correo = $_POST['correo'] ?? '';
    $passw  = $_POST['contrasena'] ?? '';

    if ($correo && $passw) {
        $db = new Database();
        $conn = $db->connect();

        try {
            // Buscar al usuario por correo
            $stmt = $conn->prepare("SELECT * FROM usuarios WHERE correo = :correo LIMIT 1");
            $stmt->bindParam(':correo', $correo);
            $stmt->execute();

            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($usuario && password_verify($passw, $usuario['contrasena'])) {
                // Inicio de sesión exitoso, redirige
                header("Location: ../view/registrouser_ok.html");
                exit;
            } else {
                // Credenciales incorrectas
                header("Location: ../view/login_error.html");
                exit;
            }
        } catch (PDOException $e) {
            echo "Error en la consulta: " . $e->getMessage();
        }
    } else {
        echo "Correo y contraseña son obligatorios.";
    }
}
?>