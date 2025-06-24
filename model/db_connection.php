<?php
class Database {
    private $host = '127.0.0.1';
    private $db_name = 'hablafood_db1';
    private $username = 'root';
    private $password = 'P@ssw0rd';
    private $conn;

    public function connect() {
        $this->conn = null;

        try {
            $dsn = "mysql:host={$this->host};port=3306;dbname={$this->db_name};charset=utf8";
            $this->conn = new PDO($dsn, $this->username, $this->password);

            // Configurar modo de error de PDO para excepciones
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
            echo "Error de conexión: " . $e->getMessage();
            exit;
        }

        return $this->conn;
    }
}
?>
