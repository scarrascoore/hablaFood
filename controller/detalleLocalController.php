<?php
require_once '../model/LocalModel.php';

if (isset($_GET['id'])) {
    $id = intval($_GET['id']); // Sanitizar el id
    $localModel = new LocalModel();

    $detalle = $localModel->obtenerDetalleLocal($id);

    if ($detalle) {
        header('Content-Type: application/json');
        echo json_encode($detalle);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Local no encontrado']);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'ID no especificado']);
}
