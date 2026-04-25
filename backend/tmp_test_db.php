<?php

try {
    $pdo = new PDO('mysql:host=127.0.0.1;port=3306;dbname=geotracker', 'root', 'Password?021904');
    echo 'DB_OK'.PHP_EOL;
} catch (PDOException $e) {
    echo 'DB_ERR: '.$e->getMessage().PHP_EOL;
}
