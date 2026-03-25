<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
echo $app->make('config')->get('app.key') . PHP_EOL;
