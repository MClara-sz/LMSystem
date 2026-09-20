<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Livro extends Model
{
   // Permite que o Controller salve dados nestas colunas
    protected $fillable = ['titulo', 'autor', 'genero', 'isbn', 'url_capa', 'sinopse'];
}
