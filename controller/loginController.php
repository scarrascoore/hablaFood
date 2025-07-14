<?php
require_once '../model/db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $correo = $_POST['correo'] ?? '';
    $passw  = $_POST['contrasena'] ?? '';

    if ($correo && $passw) {
        $db = new Database();
        $conn = $db->connect();

        try {
            $stmt = $conn->prepare("SELECT * FROM usuarios WHERE correo = :correo LIMIT 1");
            $stmt->bindParam(':correo', $correo);
            $stmt->execute();

            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
           
            if ($usuario && password_verify($passw, $usuario['contrasena'])) {
                echo json_encode([
                    'success' => true,
                    'id' => $usuario['id'],
                    'nombre' => $usuario['nombres']                    
                ]);
            } else {
                echo json_encode(['success' => false, 'error' => 'Credenciales incorrectas.']);
            }
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'error' => 'Error en el servidor.']);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Datos incompletos.']);
    }
}
?>


