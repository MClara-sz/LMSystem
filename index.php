<?php
echo "<h1>Projeto LMS - PHP Rodando!</h1>";

if (extension_loaded('pgsql') && extension_loaded('pdo_pgsql')) {
    echo "<p style='color: green;'>✅ As extensões do PostgreSQL (pgsql e pdo_pgsql) estão ATIVAS!</p>";
} else {
    echo "<p style='color: red;'>❌ Atenção: As extensões do PostgreSQL não foram encontradas.</p>";
}