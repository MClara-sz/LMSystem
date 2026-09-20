<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('emprestimos', function (Blueprint $table) {
        $table->id();
        
        // Chaves Estrangeiras (ligando com users e livros)
        $table->foreignId('usuario_id')->constrained('users')->onDelete('restrict');
        $table->foreignId('livro_id')->constrained('livros')->onDelete('restrict');
        
        // Datas e Situação
        $table->date('data_emprestimo')->default(now());
        $table->date('data_devolucao_prevista');
        $table->date('data_devolucao_real')->nullable();
        $table->string('situacao', 20)->default('ativo');
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('emprestimos');
    }
};
