<?php

echo 'PHP_ENV_DB_USERNAME: '.getenv('DB_USERNAME').PHP_EOL;
echo 'PHP_ENV_DB_CONNECTION: '.getenv('DB_CONNECTION').PHP_EOL;
echo 'Loaded .env file content DB_USERNAME: '.(file_exists(__DIR__.'/.env') ? trim(preg_replace('/.*DB_USERNAME=([\S]+)/s', '$1', file_get_contents(__DIR__.'/.env'))) : 'no .env').PHP_EOL;
