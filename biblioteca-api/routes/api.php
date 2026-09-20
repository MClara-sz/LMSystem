<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LivroController;
use App\Http\Controllers\EmprestimoController; // Importe o controller

// Cria automaticamente as rotas GET, POST, PUT e DELETE para os livros
// Rota para buscar livro em API Externa (Google Books)
Route::get('livros/buscar-isbn/{isbn}', [LivroController::class, 'buscarPorIsbn']);
Route::apiResource('livros', LivroController::class);
Route::apiResource('emprestimos', EmprestimoController::class);

use App\Http\Controllers\AuthController;

// Rota de Login (Aberta)
Route::post('login', [AuthController::class, 'login']);

// Rotas Protegidas (Precisam de Token / Estar logado)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
});