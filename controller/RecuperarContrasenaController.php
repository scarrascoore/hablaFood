<?php
require_once '../model/db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $correo = $_POST['correo'] ?? null;

    if (!$correo) {
        exit('Debe ingresar un correo.');
    }

    // Conectar a la base de datos
    $db = new Database();
    $conexion = $db->connect();

    // Verificar si el correo existe
    $stmt = $conexion->prepare("SELECT id FROM usuarios WHERE correo = :correo");
    $stmt->bindParam(':correo', $correo);
    $stmt->execute();
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$usuario) {
        exit('El correo no está registrado.');
    }

    $usuarioId = $usuario['id'];

    // Generar token y expiración
    $token = bin2hex(random_bytes(32));
    $fechaExpiracion = date('Y-m-d H:i:s', strtotime('+1 hour'));

    // Insertar el token en la base de datos
    $stmt = $conexion->prepare("INSERT INTO tokens (usuario_id, token, fecha_expiracion) VALUES (:usuario_id, :token, :fecha_expiracion)");
    $stmt->bindParam(':usuario_id', $usuarioId);
    $stmt->bindParam(':token', $token);
    $stmt->bindParam(':fecha_expiracion', $fechaExpiracion);
    $stmt->execute();

    // Crear enlace de recuperación
    //$enlace = "http://localhost/hablafood/view/resetear_contrasena.html?token=$token";
    $enlace = "http://localhost:3001/view/resetear_pass.html?token=$token";


    // Contenido del correo
    $html = "
        <h2>Recuperación de Contraseña</h2>
        <p>Hola, has solicitado restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para continuar:</p>
        <p><a href='$enlace'>$enlace</a></p>
        <p>Este enlace expirará en 1 hora.</p>
    ";

    // Enviar al servidor Node (Nodemailer)
    $data = [
        'to' => $correo,
        'subject' => 'Recuperación de contraseña - Habla Food',
        'html' => $html
    ];

    $opciones = [
        'http' => [
            'header'  => "Content-Type: application/json\r\n",
            'method'  => 'POST',
            'content' => json_encode($data),
        ],
    ];

    $contexto = stream_context_create($opciones);
    $respuesta = file_get_contents('http://localhost:3001/send', false, $contexto);

    if ($respuesta === FALSE) {
        exit('Hubo un error al enviar el correo. Inténtalo más tarde.');
    }

    echo 'Se ha enviado un enlace de recuperación a tu correo electrónico.';
}
?>
