<?php
require_once 'db_connection.php';

class UsuarioModel {
  private $db;

  public function __construct() {
    $this->db = (new Database())->connect();
  }

  public function obtenerUsuarioPorId($id) {
    $stmt = $this->db->prepare("SELECT id, nombres, apellidos, correo, celular FROM usuarios WHERE id = ?");
    $stmt->execute([$id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

  public function actualizarUsuario($data) {
    $stmt = $this->db->prepare("UPDATE usuarios SET nombres = ?, apellidos = ?, correo = ?, celular = ? WHERE id = ?");
    return $stmt->execute([
      $data['nombres'],
      $data['apellidos'],
      $data['correo'],
      $data['celular'],
      $data['id']
    ]);
  }
}

