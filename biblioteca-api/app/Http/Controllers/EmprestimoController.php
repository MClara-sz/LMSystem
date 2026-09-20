<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Emprestimo;

class EmprestimoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Emprestimo::all(), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $emprestimo = Emprestimo::create($request->all());
        return response()->json($emprestimo, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
       $emprestimo = Emprestimo::find($id);
        if (!$emprestimo) {
            return response()->json(['message' => 'Empréstimo não encontrado'], 404);
        }
        return response()->json($emprestimo, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $emprestimo = Emprestimo::find($id);
        if (!$emprestimo) {
            return response()->json(['message' => 'Empréstimo não encontrado'], 404);
        }
        $emprestimo->update($request->all());
        return response()->json($emprestimo, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
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
