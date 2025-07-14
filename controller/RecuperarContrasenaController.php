<?php
require_once '../model/db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');

    $correo = $_POST['correo'] ?? null;

    if (!$correo) {
        echo json_encode(['status' => 'error', 'message' => 'Debe ingresar un correo.']);
        exit;
    }

    try {
        $db = new Database();
        $conexion = $db->connect();

        // Verificar si el correo está registrado
        $stmt = $conexion->prepare("SELECT id FROM usuarios WHERE correo = :correo");
        $stmt->bindParam(':correo', $correo);
        $stmt->execute();
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$usuario) {
            echo json_encode(['status' => 'error', 'message' => '(*) El correo no está registrado.']);
            exit;
        }

        $usuarioId = $usuario['id'];

        // Generar token de 5 caracteres alfanuméricos
        $token = strtoupper(substr(bin2hex(random_bytes(3)), 0, 5));

        // Fecha de expiración: 1 hora después
        $fechaExpiracion = date('Y-m-d H:i:s', strtotime('+1 hour'));

        // Guardar token en la base de datos
        $stmt = $conexion->prepare("INSERT INTO tokens (usuario_id, token, fecha_expiracion) 
                                    VALUES (:usuario_id, :token, :fecha_expiracion)");
        $stmt->bindParam(':usuario_id', $usuarioId);
        $stmt->bindParam(':token', $token);
        $stmt->bindParam(':fecha_expiracion', $fechaExpiracion);
        $stmt->execute();

        // Crear el contenido del correo
        $html = "
            <h2>Recuperación de Contraseña</h2>
            <p>Hola, has solicitado restablecer tu contraseña.</p>
            <p>Este es tu código de verificación:</p>
            <h3 style='color:#d9534f; font-size: 24px;'>$token</h3>
            <p>Este código expirará en 1 hora.</p>
            <p>Ingresa este código en la ventana emergente de Habla Food para continuar.</p>
        ";

        // Datos para el servicio de envío
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
            echo json_encode(['status' => 'error', 'message' => 'Error al enviar el correo. Inténtalo más tarde.']);
            exit;
        }

        echo json_encode(['status' => 'success', 'message' => 'Se ha enviado un código de verificación a tu correo electrónico.']);

    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => 'Error del servidor.']);
    }
}


