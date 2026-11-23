<?php


namespace App\Models;

use App\Models\Livro;
use Illuminate\Database\Eloquent\Model;

class Emprestimo extends Model
{
    protected $fillable = [
        'usuario_id',
        'livro_id',
        'data_emprestimo',
        'data_devolucao_prevista',
        'data_devolucao_real',
        'situacao',
    ];

    public function livro()
    {
        return $this->belongsTo(Livro::class, 'livro_id');
    }
}