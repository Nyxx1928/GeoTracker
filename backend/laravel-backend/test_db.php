<?php
try {
    $pdo = new PDO('mysql:host=127.0.0.1;port=3306;dbname=geotracker', 'root', 'Password?021904');
    echo "CONNECTED\n";
} catch (PDOException $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
