<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Livro; 
use Illuminate\Support\Facades\Http;

class LivroController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       return response()->json(Livro::all(), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $livro = Livro::create($request->all());
        return response()->json($livro, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $livro = Livro::find($id);
        
        if (!$livro) {
            return response()->json(['message' => 'Livro não encontrado'], 404);
        }
        
        return response()->json($livro, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
       $livro = Livro::find($id);
        
        if (!$livro) {
            return response()->json(['message' => 'Livro não encontrado'], 404);
        }
        
        $livro->update($request->all());
        return response()->json($livro, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
       $livro = Livro::find($id);
        
        if (!$livro) {
            return response()->json(['message' => 'Livro não encontrado'], 404);
        }
        
        $livro->delete();
        return response()->json(['message' => 'Livro deletado com sucesso'], 200);
    }

    // Método para buscar dados de um livro no Google Books pelo ISBN
    // Método para buscar dados de um livro na Open Library pelo ISBN
   // Método para buscar dados de um livro usando a Brasil API
    public function buscarPorIsbn($isbn)
    {
        // Faz a requisição para a Brasil API
        $response = Http::withoutVerifying()->get("https://brasilapi.com.br/api/isbn/v1/" . $isbn);

        // Se a API retornar erro (como 404), avisamos o usuário
        if ($response->failed()) {
            return response()->json(['message' => 'Livro não encontrado na Brasil API'], 404);
        }

        $dados = $response->json();

        // Monta o objeto formatado com os dados que a Brasil API devolve
        $livroFormatado = [
            'titulo' => $dados['title'] ?? 'Título desconhecido',
            'autor' => isset($dados['authors'][0]) ? $dados['authors'][0] : 'Autor desconhecido',
            'sinopse' => $dados['synopsis'] ?? 'Sem sinopse',
            'url_capa' => $dados['cover_url'] ?? null,
            'isbn' => $isbn
        ];

        return response()->json($livroFormatado, 200);
    }
}
