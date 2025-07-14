<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once '../model/db_connection.php';

// Crear conexión usando la clase Database
$database = new Database();
$pdo = $database->connect();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre_local = $_POST['nombre_local'] ?? '';
    $direccion = $_POST['direccion'] ?? '';
    $distrito = $_POST['distrito'] ?? '';
    $referencia = $_POST['referencia'] ?? '';
    $precio = $_POST['precio'] ?? '';
    $valoracion = $_POST['valoracion'] ?? '';
    $resena = $_POST['resena'] ?? '';

    $latitud = $_POST['latitud'] ?? null;
    $longitud = $_POST['longitud'] ?? null;



    $imagen_nombre = '';
    $imagen_path = '';

    if (isset($_FILES['imagen_local']) && $_FILES['imagen_local']['error'] === UPLOAD_ERR_OK) {
        $nombreOriginal = $_FILES['imagen_local']['name'];
        $extension = strtolower(pathinfo($nombreOriginal, PATHINFO_EXTENSION));
        $permitidas = ['jpg', 'jpeg', 'png'];

        if (in_array($extension, $permitidas)) {
            // Obtener el siguiente número incremental
            $query = $pdo->query("SELECT COUNT(*) + 1 AS numero FROM locales1");
            $row = $query->fetch();
            $numero = str_pad($row['numero'], 6, '0', STR_PAD_LEFT);
            $nuevoNombre = 'local' . $numero . '.' . $extension;

            // Rutas
            $rutaRelativa = 'assets/img/locales/' . $nuevoNombre;
            $rutaAbsoluta = 'C:/xampp/htdocs/hablafood/' . $rutaRelativa;

            if (move_uploaded_file($_FILES['imagen_local']['tmp_name'], $rutaAbsoluta)) {
                $imagen_nombre = $nuevoNombre;
                $imagen_path = $rutaRelativa;
            }
        }
    }

    // Insertar en la base de datos
    $sql = "INSERT INTO locales1 
    (nombre_local, direccion, distrito, referencia, precio_rango, imagen_nombre, imagen_path, valoracion, resena, latitud, longitud) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $nombre_local,
        $direccion,
        $distrito,
        $referencia,
        $precio,
        $imagen_nombre,
        $imagen_path,
        $valoracion,
        $resena,
        $latitud,
        $longitud
    ]);


    header('Location: ../view/registrolocal_ok.html?nombre_local='.urlencode($nombre_local));
            
    exit();
}
?>



