<?php
header("Content-Type: application/json");

require_once __DIR__ . '/../model/UsuarioModel.php';

// Leer los datos JSON recibidos
$input = json_decode(file_get_contents("php://input"), true);

// Validar campos requeridos
if (
    !isset($input['id']) ||
    !isset($input['nombres']) ||
    !isset($input['apellidos']) ||
    !isset($input['correo']) ||
    !isset($input['celular'])
) {
    echo json_encode([
        "success" => false,
        "message" => "Faltan campos obligatorios."
    ]);
    exit;
}

// Obtener datos
$id = intval($input['id']);
$nombres = trim($input['nombres']);
$apellidos = trim($input['apellidos']);
$correo = trim($input['correo']);
$celular = trim($input['celular']);

try {
    $usuarioModel = new UsuarioModel();
    $actualizado = $usuarioModel->actualizarUsuario($id, $nombres, $apellidos, $correo, $celular);

    if ($actualizado) {
        echo json_encode([
            "success" => true,
            "message" => "Datos actualizados correctamente."
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "No se pudo actualizar el usuario. Verifica los datos."
        ]);
    }

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error en el servidor: " . $e->getMessage()
    ]);
}
