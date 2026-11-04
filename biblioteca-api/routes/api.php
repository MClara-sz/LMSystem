<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Models\Livro; // Importa o teu Model Livro

Route::get('/livros', function (Request $request) {
    // Pega o termo de pesquisa enviado pelo React (ex: ?q=m)
    $termo = $request->query('q');

    if ($termo) {
        // Procura no banco de dados onde o título ou autor se parecem com o termo digitado
        $livros = Livro::where('titulo', 'like', "%{$termo}%")
                       ->orWhere('autor', 'like', "%{$termo}%")
                       ->get();
    } else {
        // Se nada foi digitado, retorna todos os livros do banco
        $livros = Livro::all();
    }

    return response()->json($livros);
});