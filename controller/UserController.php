<?php
require_once '../model/db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombres   = $_POST['nombres']   ?? '';
    $apellidos = $_POST['apellidos'] ?? '';
    $correo    = $_POST['correo']    ?? '';
    $celular   = $_POST['celular']   ?? '';
    $passw     = $_POST['contrasena'] ?? '';

    if ($nombres && $apellidos && $correo && $passw && $celular) {
        $hashedPass = password_hash($passw, PASSWORD_DEFAULT);

        $db = new Database();
        $conn = $db->connect();

        try {
            // Registrar usuario
            $stmt = $conn->prepare("INSERT INTO usuarios (nombres, apellidos, correo, contrasena, celular) VALUES (:nombres, :apellidos, :correo, :passw, :celular)");
            $stmt->bindParam(':nombres', $nombres);
            $stmt->bindParam(':apellidos', $apellidos);
            $stmt->bindParam(':correo', $correo);
            $stmt->bindParam(':passw', $hashedPass);
            $stmt->bindParam(':celular', $celular);
            $stmt->execute();

            $usuarioId = $conn->lastInsertId();

            // Enviar correo
            $asunto = "¡Bienvenido a Habla Food!";
            $mensajeHtml = "
                <h2>Hola $nombres 👋</h2>
                <p>Gracias por registrarte en <strong>Habla Food</strong>.</p>
                <p>Explora y descubre nuevos lugares cerca de ti.</p>
            ";

            $payload = json_encode([
                'to'      => $correo,
                'subject' => $asunto,
                'html'    => $mensajeHtml
            ]);

            $ch = curl_init('http://localhost:3001/send');
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
            curl_setopt($ch, CURLOPT_POST, true);
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpCode === 200) {
                $updateMail = $conn->prepare("UPDATE usuarios SET confirmado_email = 1 WHERE id = :id");
                $updateMail->bindParam(':id', $usuarioId);
                $updateMail->execute();
            }

            // Enviar SMS con twilio
            $telefono_formateado = '+51' . preg_replace('/\D/', '', $celular);
            $nombre_escapado = escapeshellarg($nombres);

            $comando = "node C:\\Users\\PC001\\Desktop\\UTP\\Proyectos\\mailer-node\\sendSMS.js {$telefono_formateado} {$nombre_escapado}";
            exec($comando, $output, $sms_status);

            if ($sms_status === 0) {
                $updateSMS = $conn->prepare("UPDATE usuarios SET confirmado_sms = 1 WHERE id = :id");
                $updateSMS->bindParam(':id', $usuarioId);
                $updateSMS->execute();
            }

            header("Location: ../view/registrouser_ok.html?nombre=" . urlencode($nombres));
            exit;

        } catch (PDOException $e) {
            echo "Error al registrar usuario: " . $e->getMessage();
        }
    } else {
        echo "Todos los campos son obligatorios.";
    }
}
?>




