<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LivroController;
use App\Http\Controllers\EmprestimoController;

// Rotas Públicas de Autenticação
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rotas de Livros (Consulta livre e busca por ISBN)
Route::get('/livros', [LivroController::class, 'index']);
Route::get('/livros/isbn/{isbn}', [LivroController::class, 'buscarPorIsbn']);
Route::get('/livros/google', [LivroController::class, 'pesquisarGoogle']);
Route::get('/livros/{id}', [LivroController::class, 'show']);

// Rotas Protegidas (Exigem autenticação por Token Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Gerenciamento de Livros (Apenas Admin/Rotas protegidas conforme regra)
    Route::post('/livros', [LivroController::class, 'store']);
    Route::put('/livros/{id}', [LivroController::class, 'update']);
    Route::delete('/livros/{id}', [LivroController::class, 'destroy']);

    // Gestão de Empréstimos (CRUD completo)
    Route::get('/emprestimos', [EmprestimoController::class, 'index']);
    Route::post('/emprestimos', [EmprestimoController::class, 'store']);
    Route::get('/emprestimos/{id}', [EmprestimoController::class, 'show']);
    Route::put('/emprestimos/{id}', [EmprestimoController::class, 'update']);
    Route::delete('/emprestimos/{id}', [EmprestimoController::class, 'destroy']);
});