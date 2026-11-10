<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Livro; 
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class LivroController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
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
        // Validação dos dados e do arquivo de capa
        $request->validate([
            'titulo' => 'required|string|max:255',
            'autor'  => 'required|string|max:255',
            'capa'   => 'nullable|file|image|mimes:jpeg,png,jpg,gif|max:2048', // Upload via arquivo (max 2MB)
        ]);

        $dados = $request->all();

        // Trata o upload do arquivo de capa se for enviado um arquivo
        if ($request->hasFile('capa')) {
            $caminhoCapa = $request->file('capa')->store('capas', 'public');
            $dados['url_capa'] = Storage::url($caminhoCapa);
        }

        $livro = Livro::create($dados);
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

        $dados = $request->all();

        // Trata a atualização de arquivo de capa
        if ($request->hasFile('capa')) {
            // Apaga a capa antiga do storage se ela for um arquivo armazenado localmente
            if ($livro->url_capa && Storage::disk('public')->exists(str_replace('/storage/', '', $livro->url_capa))) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $livro->url_capa));
            }

            $caminhoCapa = $request->file('capa')->store('capas', 'public');
            $dados['url_capa'] = Storage::url($caminhoCapa);
        }
        
        $livro->update($dados);
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

        // Remove a capa do storage ao deletar o livro
        if ($livro->url_capa && Storage::disk('public')->exists(str_replace('/storage/', '', $livro->url_capa))) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $livro->url_capa));
        }
        
        $livro->delete();
        return response()->json(['message' => 'Livro deletado com sucesso'], 200);
    }

    /**
     * Baixar a imagem da capa do livro (Atende o requisito de Download do edital)
     */
    public function downloadCapa(string $id)
    {
        $livro = Livro::find($id);

        if (!$livro || !$livro->url_capa) {
            return response()->json(['message' => 'Capa não encontrada para este livro'], 404);
        }

        $caminhoRelativo = str_replace('/storage/', '', $livro->url_capa);

        if (!Storage::disk('public')->exists($caminhoRelativo)) {
            return response()->json(['message' => 'Arquivo físico não existe no servidor'], 404);
        }

        return Storage::disk('public')->download($caminhoRelativo);
    }

    /**
     * Buscar dados de um livro no Google Books pelo ISBN
     */
    public function buscarPorIsbn($isbn)
    {
        $isbnLimpo = preg_replace('/[^0-9]/', '', $isbn);

        $response = Http::withoutVerifying()->get("https://brasilapi.com.br/api/isbn/v1/{$isbnLimpo}");

        if ($response->failed()) {
            return response()->json(['message' => 'Livro não encontrado na BrasilAPI'], 404);
        }

        $dados = $response->json();

        $livroFormatado = [
            'titulo' => $dados['title'] ?? 'Título desconhecido',
            'autor' => isset($dados['authors']) ? implode(', ', $dados['authors']) : 'Autor desconhecido',
            'sinopse' => $dados['synopsis'] ?? 'Sem sinopse',
            'url_capa' => $dados['cover_url'] ?? null,
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