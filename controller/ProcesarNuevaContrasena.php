<?php
require_once '../model/db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = $_POST['token'] ?? '';
    $nuevaContrasena = $_POST['nueva_contrasena'] ?? '';
    $confirmarContrasena = $_POST['confirmar_contrasena'] ?? '';

    if (!$token || strlen($token) !== 5) {
        exit("Token inválido.");
    }

    if (!$nuevaContrasena || !$confirmarContrasena) {
        exit("Debes completar ambos campos de contraseña.");
    }

    if ($nuevaContrasena !== $confirmarContrasena) {
        exit("Las contraseñas no coinciden.");
    }

    try {
        $db = new Database();
        $conexion = $db->connect();

        // Buscar token válido
        $stmt = $conexion->prepare("
            SELECT usuario_id FROM tokens 
            WHERE token = :token AND fecha_expiracion > NOW()
            ORDER BY fecha_expiracion DESC
            LIMIT 1
        ");
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$resultado) {
            exit("Token inválido o expirado.");
        }

        $usuarioId = $resultado['usuario_id'];
        $hashedPassword = password_hash($nuevaContrasena, PASSWORD_DEFAULT);

        // Actualizar contraseña del usuario
        $stmt = $conexion->prepare("
            UPDATE usuarios SET contrasena = :contrasena WHERE id = :id
        ");
        $stmt->bindParam(':contrasena', $hashedPassword);
        $stmt->bindParam(':id', $usuarioId);
        $stmt->execute();

        // Eliminar token usado
        $stmt = $conexion->prepare("DELETE FROM tokens WHERE token = :token");
        $stmt->bindParam(':token', $token);
        $stmt->execute();

        echo '
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Contraseña Actualizada</title>
  <link rel="stylesheet" href="../assets/css/styles.css">
  <link rel="stylesheet" href="../assets/css/popUp.css">
  <script defer src="../assets/js/include.js"></script>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
</head>
<body>

<div id="header-placeholder"></div>

<!-- POPUP de éxito -->
<div id="popup-success" class="popup-overlay" style="display: none;">
  <div class="popup-box text-center">
    <h4 class="mb-3 text-success">¡Contraseña actualizada exitosamente!</h4>
    <p>Tu nueva contraseña ha sido registrada con éxito.<br>Ya puedes iniciar sesión en Habla Food.</p>
    <button class="btn btn-success mt-3" onclick="irAlLogin()">Iniciar sesión</button>
  </div>
</div>

<script>
  function mostrarPopupExito() {
    document.getElementById("popup-success").style.display = "flex";
  }

  function irAlLogin() {
    window.location.href = "../view/login.html";
  }

  window.onload = mostrarPopupExito;
</script>
<div id="footer-placeholder"></div>
</body>
</html>';


    } catch (Exception $e) {
        exit("Ocurrió un error: " . $e->getMessage());
    }
} else {
    exit("Acceso no autorizado.");
}

?>