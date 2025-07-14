<?php
require_once __DIR__ . '/../model/db_connection.php';

class LocalModel {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->connect();
    }

    // === FUNCIONES EXISTENTES ===

    public function obtenerLocalesTop() {
        $sql = "SELECT id, nombre_local, imagen_path, valoracion, likes FROM locales1 ORDER BY likes DESC";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function incrementarLike($id) {
        $sql = "UPDATE locales1 SET likes = likes + 1 WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([$id]);
    }

    public function obtenerLikes($id) {
        $sql = "SELECT likes FROM locales1 WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function disminuirLike($id) {
        $sql = "UPDATE locales1 SET likes = GREATEST(likes - 1, 0) WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([$id]);
    }

    // === NUEVAS FUNCIONES PARA detalle_local ===

    // 1. Obtener un local por ID
    public function getLocalById($id) {
        $sql = "SELECT * FROM locales1 WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // 2. Obtener 3 locales aleatorios, excluyendo uno
    public function getOtrosLocalesRandom($limite = 3, $excluir_id = null) {
        $sql = "SELECT * FROM locales1";
        $params = [];

        if ($excluir_id) {
            $sql .= " WHERE id != ?";
            $params[] = $excluir_id;
        }

        $sql .= " ORDER BY RAND() LIMIT ?";
        $params[] = (int)$limite;

        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // 3. Obtener valoraciones (lista de comentarios)
    public function getValoraciones($local_id) {
        $sql = "SELECT valoracion, comentario FROM valoraciones WHERE local_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$local_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // 4. Promedio de valoraciones
    public function getPromedioValoracion($local_id) {
        $sql = "SELECT AVG(valoracion) as promedio FROM valoraciones WHERE local_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$local_id]);
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        return $resultado['promedio'] ?? 0;
    }

    // 5. Registrar nueva valoración
    public function agregarValoracion($local_id, $valoracion, $comentario = '') {
        $sql = "INSERT INTO valoraciones (local_id, valoracion, comentario) VALUES (?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([$local_id, $valoracion, $comentario]);
    }


public function obtenerDetalleLocal($id) {
    $query = "SELECT nombre_local, valoracion, latitud, longitud FROM locales1 WHERE id = :id LIMIT 1";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetch(PDO::FETCH_ASSOC);
}


}

