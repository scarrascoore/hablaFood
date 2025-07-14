<?php
require_once '../model/UsuarioModel.php';

$input = json_decode(file_get_contents("php://input"), true);

if (!$input || !isset($input['id'])) {
  echo json_encode(["success" => false, "message" => "Datos inválidos."]);
  exit;
}

$model = new UsuarioModel();
$success = $model->actualizarUsuario($input);

if ($success) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "message" => "No se pudo actualizar."]);
}


