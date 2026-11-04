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
    public function index(Request $request)
    {
        // Se houver um termo de busca local na base de dados
        $termo = $request->query('q');

        if ($termo) {
            $livros = Livro::where('titulo', 'like', "%{$termo}%")
                           ->orWhere('autor', 'like', "%{$termo}%")
                           ->get();
            return response()->json($livros, 200);
        }

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

    /**
     * Buscar dados de um livro no Google Books pelo ISBN
     */
    public function buscarPorIsbn($isbn)
    {
        // Faz a requisição para a API do Google Books usando o prefixo isbn:
        $response = Http::withoutVerifying()->get("https://www.googleapis.com/books/v1/volumes", [
            'q' => "isbn:{$isbn}"
        ]);

        if ($response->failed()) {
            return response()->json(['message' => 'Erro ao comunicar com a API do Google Books'], 500);
        }

        $dados = $response->json();

        // Verifica se encontrou algum livro com este ISBN
        if (empty($dados['items'])) {
            return response()->json(['message' => 'Livro não encontrado no Google Books'], 404);
        }

        $info = $dados['items'][0]['volumeInfo'] ?? [];

        // Mapeia os dados para o formato esperado
        $livroFormatado = [
            'titulo' => $info['title'] ?? 'Título desconhecido',
            'autor' => isset($info['authors']) ? implode(', ', $info['authors']) : 'Autor desconhecido',
            'sinopse' => $info['description'] ?? 'Sem sinopse',
            'url_capa' => $info['imageLinks']['thumbnail'] ?? null,
            'isbn' => $isbn
        ];

        return response()->json($livroFormatado, 200);
    }

    /**
     * Pesquisar múltiplos livros por texto livre (Título/Autor) no Google Books
     */
    public function pesquisarGoogle(Request $request)
    {
        $termo = $request->query('q');

        if (!$termo) {
            return response()->json([], 200);
        }

        $response = Http::withoutVerifying()->get('https://www.googleapis.com/books/v1/volumes', [
            'q' => $termo,
            'maxResults' => 10
        ]);

        if ($response->failed()) {
            return response()->json(['message' => 'Erro ao comunicar com a API do Google Books'], 500);
        }

        $dados = $response->json();

        $livros = collect($dados['items'] ?? [])->map(function ($item) {
            $info = $item['volumeInfo'] ?? [];
            return [
                'id' => $item['id'],
                'titulo' => $info['title'] ?? 'Título desconhecido',
                'autor' => isset($info['authors']) ? implode(', ', $info['authors']) : 'Autor desconhecido',
                'sinopse' => $info['description'] ?? 'Sem sinopse',
                'url_capa' => $info['imageLinks']['thumbnail'] ?? null,
            ];
        });

        return response()->json($livros, 200);
    }
}