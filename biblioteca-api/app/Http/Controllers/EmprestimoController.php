<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Emprestimo;

class EmprestimoController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Emprestimo::with(['livro', 'usuario']);

        if ($user->role !== 'admin') {
            $query->where('usuario_id', $user->id);
        }

        return response()->json($query->get(), 200);
    }

    public function store(Request $request)
    {
        $dados = $request->validate([
            'livro_id' => 'required|exists:livros,id',
            'data_emprestimo' => 'nullable|date',
            'data_devolucao_prevista' => 'required|date',
            'situacao' => 'nullable|string',
            'usuario_id' => 'nullable|exists:users,id',
        ]);

        // Apenas admins podem criar empréstimo em nome de outro utilizador
        if ($request->user()->role === 'admin' && !empty($dados['usuario_id'])) {
            $dados['usuario_id'] = $dados['usuario_id'];
        } else {
            $dados['usuario_id'] = $request->user()->id;
        }

        $dados['data_emprestimo'] = $dados['data_emprestimo'] ?? now()->toDateString();
        $dados['situacao'] = $dados['situacao'] ?? 'ativo';

        $emprestimo = Emprestimo::create($dados);

        return response()->json($emprestimo->load('livro'), 201);
    }

    public function show(Request $request, string $id)
    {
        $emprestimo = Emprestimo::with('livro')->find($id);
        if (!$emprestimo) {
            return response()->json(['message' => 'Empréstimo não encontrado'], 404);
        }

        if ($request->user()->role !== 'admin' && (int) $emprestimo->usuario_id !== (int) $request->user()->id) {
            return response()->json(['message' => 'Acesso não autorizado.'], 403);
        }

        return response()->json($emprestimo, 200);
    }

    public function update(Request $request, string $id)
    {
        $emprestimo = Emprestimo::find($id);
        if (!$emprestimo) {
            return response()->json(['message' => 'Empréstimo não encontrado'], 404);
        }

        if ($request->user()->role !== 'admin' && (int) $emprestimo->usuario_id !== (int) $request->user()->id) {
            return response()->json(['message' => 'Você só pode devolver os seus próprios empréstimos.'], 403);
        }

        $dados = $request->validate([
            'situacao' => 'nullable|string',
            'data_devolucao_real' => 'nullable|date',
            'data_devolucao_prevista' => 'nullable|date',
        ]);

        $emprestimo->update($dados);

        return response()->json($emprestimo->load('livro'), 200);
    }

    public function destroy(string $id)
    {
        $emprestimo = Emprestimo::find($id);
        if (!$emprestimo) {
            return response()->json(['message' => 'Empréstimo não encontrado'], 404);
        }

        $emprestimo->delete();
        return response()->json(['message' => 'Deletado com sucesso'], 200);
    }
}