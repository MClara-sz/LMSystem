<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LivroController;
use App\Http\Controllers\EmprestimoController;
use App\Http\Middleware\AdminMiddleware; // <-- Importante: Importar o Middleware

// Rotas Públicas de Autenticação
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rotas de Livros (Consulta livre e busca por ISBN)
Route::get('/livros', [LivroController::class, 'index']);
Route::get('/livros/isbn/{isbn}', [LivroController::class, 'buscarPorIsbn']);
Route::get('/livros/google', [LivroController::class, 'pesquisarGoogle']);
Route::get('/livros/{id}', [LivroController::class, 'show']);

// Rotas Protegidas (Exigem autenticação por Token Sanctum para QUALQUER utilizador logado)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Gestão de Empréstimos (Utilizadores comuns podem ver e criar os seus empréstimos)
    Route::get('/emprestimos', [EmprestimoController::class, 'index']);
    Route::post('/emprestimos', [EmprestimoController::class, 'store']);
    Route::get('/emprestimos/{id}', [EmprestimoController::class, 'show']);
});

// Rotas RESTRITAS APENAS A ADMINISTRADORES (Exigem Sanctum + AdminMiddleware)
Route::middleware(['auth:sanctum', AdminMiddleware::class])->group(function () {
    // Gerenciamento crítico de Livros (Apenas admins criam, editam ou apagam livros)
    Route::post('/livros', [LivroController::class, 'store']);
    Route::put('/livros/{id}', [LivroController::class, 'update']);
    Route::delete('/livros/{id}', [LivroController::class, 'destroy']);

    // Gestão avançada de Empréstimos (Apenas admins podem alterar ou apagar registos globais)
    Route::put('/emprestimos/{id}', [EmprestimoController::class, 'update']);
    Route::delete('/emprestimos/{id}', [EmprestimoController::class, 'destroy']);
});