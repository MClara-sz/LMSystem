<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Emprestimo extends Model
{
    // Permite que o Controller preencha estas colunas ao salvar
    protected $fillable = [
        'usuario_id', 
        'livro_id', 
        'data_emprestimo', 
        'data_devolucao_prevista', 
        'data_devolucao_real', 
        'situacao'
    ];
}
