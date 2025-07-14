<?php
require_once '../model/LocalModel.php';

$localModel = new LocalModel();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $locales = $localModel->obtenerLocalesTop();
    header('Content-Type: application/json');
    echo json_encode($locales);
}

if (isset($_GET['like'])) {
    $id = $_GET['like'];

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if ($localModel->incrementarLike($id)) {
            $likes = $localModel->obtenerLikes($id);
            echo json_encode(['likes' => $likes['likes']]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'No se pudo aumentar el like']);
        }
    }

    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        if ($localModel->disminuirLike($id)) {
            $likes = $localModel->obtenerLikes($id);
            echo json_encode(['likes' => $likes['likes']]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'No se pudo disminuir el like']);
        }
    }
}
?>

