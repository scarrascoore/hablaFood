<?php
require_once '../model/UsuarioModel.php';

if (!isset($_GET['id'])) {
    echo json_encode(["success" => false, "message" => "ID requerido"]);
    exit;
}

$model = new UsuarioModel();
$usuario = $model->getUsuarioById($_GET['id']);

if ($usuario) {
    echo json_encode(["success" => true, "usuario" => $usuario]);
} else {
    echo json_encode(["success" => false, "message" => "Usuario no encontrado"]);
}

