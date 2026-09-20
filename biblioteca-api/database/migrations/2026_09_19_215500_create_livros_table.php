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
    Schema::create('livros', function (Blueprint $table) {
        $table->id();
        $table->string('titulo', 200);
        $table->string('autor', 150);
        $table->string('genero', 100)->nullable();
        $table->string('isbn', 20)->unique()->nullable();
        $table->string('url_capa', 255)->nullable();
        $table->text('sinopse')->nullable();
        $table->timestamps(); // Cria a data_cadastro automaticamente
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('livros');
    }
};
