function Livros() {
    return <h1>Acervo</h1>;
    const livros = [
        { id: 1, titulo: "Dom Casmurro", autor: { nome: "Machado" } },
        { id: 2, titulo: "Iracema", autor: { nome: "Alencar" } },
    ];

    {
        livros.map((livro) => (
            <li key={livro.id}>{livro.titulo}</li>
        ))
    }

}

export default Livros;
