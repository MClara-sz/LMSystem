<!DOCTYPE html>
<html lang="pt-BR">

<body>

<div align="center" class="center">
  <h1>📚 Sistema de Gestão de Biblioteca</h1>
  <p>
    <strong>Aplicação web full-stack desenvolvida para a disciplina de Desenvolvimento Web II, integrando conceitos de Engenharia de Software e Segurança da Informação.</strong>
  </p>

  <p class="badges">
    <img src="https://img.shields.io/badge/PHP_8.4-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP 8.4" />
    <img src="https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel" />
    <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  </p>

  <p class="badges">
    <img src="https://img.shields.io/badge/Requisitos_Funcionais-9-0969DA?style=for-the-badge" alt="9 Requisitos Funcionais" />
    <img src="https://img.shields.io/badge/Requisitos_Não_Funcionais-5-1A7F37?style=for-the-badge" alt="5 Requisitos Não Funcionais" />
    <img src="https://img.shields.io/badge/Requisitos_de_Segurança-5-CF222E?style=for-the-badge" alt="5 Requisitos de Segurança" />
  </p>

  <p>
    <a href="#visao-geral">Visão Geral</a> •
    <a href="#arquitetura">Arquitetura e Tecnologias</a> •
    <a href="#organizacao">Organização do Repositório</a> •
    <a href="#instalacao">Instalação e Execução</a> •
    <a href="#api">Documentação da API</a>
  </p>
</div>

<hr />

<h2 id="visao-geral">📖 Visão Geral</h2>
<p>
  O sistema possui arquitetura desacoplada entre <strong>back-end (API REST em Laravel)</strong> e <strong>front-end (SPA em React + Vite)</strong>, com suporte a execução containerizada via <strong>Docker Compose</strong>. Permite o controle de acervo (com consulta de metadados via BrasilAPI e upload/download de capas), gestão de empréstimos e devoluções, edição de perfil e painel de indicadores administrativos.
</p>

<hr />

<h2 id="arquitetura">🏗️ Arquitetura e Tecnologias</h2>
<table>
  <thead>
    <tr>
      <th width="25%">Camada / Área</th>
      <th>Tecnologias e Ferramentas</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Back-end</strong></td>
      <td>PHP 8.4, Laravel, Laravel Sanctum (autenticação baseada em tokens), Eloquent ORM</td>
    </tr>
    <tr>
      <td><strong>Front-end</strong></td>
      <td>React 19, Vite, React Router DOM, Axios, Tailwind CSS / CSS modular</td>
    </tr>
    <tr>
      <td><strong>Banco de Dados</strong></td>
      <td>PostgreSQL (com suporte via nuvem Supabase; configurável via <code>.env</code>)</td>
    </tr>
    <tr>
      <td><strong>Integração Externa</strong></td>
      <td>BrasilAPI para consulta de metadados de livros por ISBN</td>
    </tr>
    <tr>
      <td><strong>Infraestrutura e Deploy</strong></td>
      <td>Docker e Docker Compose (back-end containerizado para deploy no <strong>Render</strong>) e front-end preparado para deploy no <strong>Vercel</strong></td>
    </tr>
  </tbody>
</table>

<hr />

<h2 id="organizacao">📁 Organização do Repositório</h2>
<pre><code>projeto-biblioteca/
├── backend/                          # API REST em Laravel
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── AuthController.php        # Cadastro, login, logout e atualização de perfil
│   │   │   │   ├── LivroController.php       # CRUD de livros, upload/download de capa e BrasilAPI
│   │   │   │   └── EmprestimoController.php  # Gestão de empréstimos e devoluções
│   │   │   └── Middleware/
│   │   │       └── AdminMiddleware.php       # Controle de acesso restrito a administradores
│   │   └── Models/
│   │       ├── User.php
│   │       ├── Livro.php
│   │       └── Emprestimo.php
│   ├── routes/
│   │   └── api.php                   # Definição das rotas públicas, autenticadas e administrativas
│   ├── storage/app/public/capas/     # Armazenamento local das capas enviadas
│   ├── Dockerfile                    # Imagem PHP 8.4 CLI com extensões pdo e pdo_pgsql
│   ├── docker-compose.yml            # Orquestração do contêiner biblioteca_api
│   └── .env.example                  # Modelo de variáveis de ambiente
│
└── frontend/                         # Aplicação SPA em React + Vite
    ├── src/
    │   ├── components/
    │   │   ├── BuscaIsbn.jsx         # Pesquisa rápida por ISBN (BrasilAPI)
    │   │   ├── FormularioLivro.jsx   # Cadastro e edição de livros com upload de capa
    │   │   ├── ListaLivros.jsx       # Listagem, filtro rápido e ações sobre o acervo
    │   │   └── NavBar/               # Barra de navegação dinâmica por perfil
    │   ├── pages/
    │   │   ├── Auth.jsx              # Tela de login e cadastro
    │   │   ├── livros.jsx            # Gestão e consulta do acervo
    │   │   ├── Emprestimos.jsx       # Controle de empréstimos ativos e histórico
    │   │   ├── Perfil.jsx            # Edição de perfil, alteração de senha e resumo da conta
    │   │   └── AdminDashboard.jsx    # Painel de indicadores administrativos
    │   └── services/
    │       └── api.js                # Cliente Axios com injeção de token Sanctum
    └── package.json</code></pre>

<hr />

<h2 id="instalacao">🚀 Instalação e Execução</h2>

<h3>Pré-requisitos</h3>
<ul>
  <li><strong>Docker e Docker Compose</strong> (recomendado para o back-end) ou PHP 8.4+ e Composer.</li>
  <li><strong>Node.js (v18+)</strong> e npm para o front-end.</li>
  <li>Instância <strong>PostgreSQL</strong> configurada (local ou Supabase).</li>
</ul>

<details open>
  <summary>1. Executando o Back-end com Docker Compose</summary>
  <ol>
    <li>Acesse o diretório do back-end e crie o arquivo <code>.env</code> a partir do exemplo:
      <pre><code>cd backend
cp .env.example .env</code></pre>
    </li>
    <li>Configure no <code>.env</code> a conexão com o banco PostgreSQL (<code>DB_CONNECTION=pgsql</code>, <code>DB_HOST</code>, <code>DB_PORT</code>, <code>DB_DATABASE</code>, <code>DB_USERNAME</code>, <code>DB_PASSWORD</code>) e a origem permitida no CORS para o front-end.</li>
    <li>Suba o contêiner da API (<code>biblioteca_api</code>):
      <pre><code>docker compose up -d --build</code></pre>
    </li>
    <li>Instale as dependências, gere a chave da aplicação, execute as migrações e crie o link simbólico do storage:
      <pre><code>docker compose exec api composer install
docker compose exec api php artisan key:generate
docker compose exec api php artisan migrate
docker compose exec api php artisan storage:link</code></pre>
    </li>
    <li>A API estará disponível em: <code>http://localhost:8000</code>.</li>
  </ol>
  <p>Para visualizar os logs ou encerrar o contêiner:</p>
  <pre><code>docker compose logs -f api
docker compose down</code></pre>
</details>

<details open>
  <summary>2. Executando o Front-end (React + Vite)</summary>
  <ol>
    <li>Em outro terminal, acesse o diretório do front-end e instale as dependências:
      <pre><code>cd frontend
npm install</code></pre>
    </li>
    <li>Configure o arquivo <code>.env</code> na raiz do front-end apontando para a API:
      <pre><code>VITE_API_URL=http://127.0.0.1:8000/api</code></pre>
    </li>
    <li>Inicie o servidor de desenvolvimento:
      <pre><code>npm run dev</code></pre>
    </li>
    <li>Acesse a aplicação no endereço exibido pelo Vite (geralmente <code>http://localhost:5173</code>).</li>
  </ol>
</details>

<hr />

<h2 id="api">🔌 Documentação Básica da API</h2>

<h3>Rotas Públicas</h3>
<table>
  <thead>
    <tr>
      <th width="12%">Método</th>
      <th width="33%">Endpoint</th>
      <th>Descrição</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><span class="method post">POST</span></td>
      <td><code>/api/register</code></td>
      <td>Cadastra um novo usuário com perfil padrão visitante e retorna token Sanctum.</td>
    </tr>
    <tr>
      <td><span class="method post">POST</span></td>
      <td><code>/api/login</code></td>
      <td>Autentica o usuário e retorna o token de acesso.</td>
    </tr>
    <tr>
      <td><span class="method get">GET</span></td>
      <td><code>/api/livros</code></td>
      <td>Lista todos os livros ou filtra por <code>?q=termo</code> (título/autor).</td>
    </tr>
    <tr>
      <td><span class="method get">GET</span></td>
      <td><code>/api/livros/{id}</code></td>
      <td>Retorna os detalhes de um livro específico.</td>
    </tr>
    <tr>
      <td><span class="method get">GET</span></td>
      <td><code>/api/livros/isbn/{isbn}</code></td>
      <td>Consulta dados de um livro na BrasilAPI pelo código ISBN.</td>
    </tr>
    <tr>
      <td><span class="method get">GET</span></td>
      <td><code>/api/livros/{id}/download-capa</code></td>
      <td>Realiza o download do arquivo de capa armazenado no servidor.</td>
    </tr>
  </tbody>
</table>

<h3>Rotas Autenticadas (<code>auth:sanctum</code>)</h3>
<table>
  <thead>
    <tr>
      <th width="12%">Método</th>
      <th width="33%">Endpoint</th>
      <th>Descrição</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><span class="method post">POST</span></td>
      <td><code>/api/logout</code></td>
      <td>Revoga o token de acesso atual do usuário.</td>
    </tr>
    <tr>
      <td><span class="method put">PUT</span></td>
      <td><code>/api/perfil</code></td>
      <td>Atualiza nome, e-mail e palavra-passe (mediante senha atual).</td>
    </tr>
    <tr>
      <td><span class="method get">GET</span></td>
      <td><code>/api/emprestimos</code></td>
      <td>Lista empréstimos do usuário autenticado (ou todos, se admin).</td>
    </tr>
    <tr>
      <td><span class="method post">POST</span></td>
      <td><code>/api/emprestimos</code></td>
      <td>Registra um novo empréstimo.</td>
    </tr>
    <tr>
      <td><span class="method get">GET</span></td>
      <td><code>/api/emprestimos/{id}</code></td>
      <td>Exibe detalhes de um empréstimo (restrito ao dono ou admin).</td>
    </tr>
    <tr>
      <td><span class="method put">PUT</span></td>
      <td><code>/api/emprestimos/{id}</code></td>
      <td>Atualiza prazos ou registra a devolução do livro.</td>
    </tr>
  </tbody>
</table>

<h3>Rotas Restritas a Administradores (<code>auth:sanctum</code> + <code>AdminMiddleware</code>)</h3>
<table>
  <thead>
    <tr>
      <th width="12%">Método</th>
      <th width="33%">Endpoint</th>
      <th>Descrição</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><span class="method post">POST</span></td>
      <td><code>/api/livros</code></td>
      <td>Cadastra um novo livro (com suporte a upload de imagem de capa).</td>
    </tr>
    <tr>
      <td><span class="method put">PUT</span></td>
      <td><code>/api/livros/{id}</code></td>
      <td>Atualiza os dados e/ou substitui a capa de um livro existente.</td>
    </tr>
    <tr>
      <td><span class="method delete">DELETE</span></td>
      <td><code>/api/livros/{id}</code></td>
      <td>Remove um livro (bloqueado com HTTP 409 se houver empréstimos vinculados).</td>
    </tr>
    <tr>
      <td><span class="method delete">DELETE</span></td>
      <td><code>/api/emprestimos/{id}</code></td>
      <td>Remove um registro de empréstimo.</td>
    </tr>
  </tbody>
</table>

</body>
</html>








<!DOCTYPE html>
<html lang="pt-BR">

<body>

<div align="center" class="center">
  <h1>📋 Especificação de Requisitos</h1>
  <h3>Sistema de Gestão de Biblioteca</h3>
  <p>
    Documento de especificação dos <strong>Requisitos Funcionais (RF)</strong>, <strong>Requisitos Não Funcionais (RNF)</strong> e <strong>Requisitos de Segurança (RSEC)</strong> para o planejamento e apresentação do projeto.
  </p>

  <p>
    <a href="#requisitos-funcionais">1. Requisitos Funcionais (RF)</a> •
    <a href="#requisitos-nao-funcionais">2. Requisitos Não Funcionais (RNF)</a> •
    <a href="#requisitos-seguranca">3. Requisitos de Segurança (RSEC)</a>
  </p>
</div>

<hr />

<div class="summary-box">
  <strong>📌 Objetivo do Documento:</strong> Consolidar os requisitos de negócio, restrições arquiteturais e diretrizes de segurança da informação aplicadas no desenvolvimento da aplicação web full-stack (Laravel + React + PostgreSQL).
</div>

<h2 id="requisitos-funcionais">1. Requisitos Funcionais (RF)</h2>
<table>
  <thead>
    <tr>
      <th width="10%">Código</th>
      <th width="25%">Nome</th>
      <th>Descrição</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><span class="code-badge rf-badge">RF01</span></td>
      <td><strong>Cadastro e Autenticação de Usuários</strong></td>
      <td>Permitir que novos usuários criem conta (com perfil padrão de visitante), realizem login com e-mail e senha e encerrem a sessão com segurança.</td>
    </tr>
    <tr>
      <td><span class="code-badge rf-badge">RF02</span></td>
      <td><strong>Consulta e Filtragem do Acervo</strong></td>
      <td>Permitir que qualquer usuário visualize os livros disponíveis no acervo, consulte detalhes de uma obra e filtre por título, autor ou gênero.</td>
    </tr>
    <tr>
      <td><span class="code-badge rf-badge">RF03</span></td>
      <td><strong>Busca Externa por ISBN</strong></td>
      <td>Permitir que o administrador busque dados de um livro a partir do código ISBN em serviço externo (BrasilAPI) para preencher automaticamente as informações no cadastro.</td>
    </tr>
    <tr>
      <td><span class="code-badge rf-badge">RF04</span></td>
      <td><strong>Gerenciamento do Acervo</strong></td>
      <td>Permitir que administradores cadastrem, editem e excluam livros do acervo, impedindo a remoção de obras que possuam empréstimos vinculados.</td>
    </tr>
    <tr>
      <td><span class="code-badge rf-badge">RF05</span></td>
      <td><strong>Upload e Download de Capas</strong></td>
      <td>Permitir o envio de imagem de capa (em formatos comuns e dentro de limite de tamanho) ao cadastrar ou editar livros, substituindo capas antigas e permitindo o download da imagem.</td>
    </tr>
    <tr>
      <td><span class="code-badge rf-badge">RF06</span></td>
      <td><strong>Detalhes do Livro e Resumo do Leitor</strong></td>
      <td>Exibir ao usuário comum os detalhes completos do livro selecionado (capa, informações básicas e sinopse), opção de baixar a capa e um resumo de seus empréstimos ativos.</td>
    </tr>
    <tr>
      <td><span class="code-badge rf-badge">RF07</span></td>
      <td><strong>Empréstimos e Devoluções</strong></td>
      <td>Permitir que usuários autenticados registrem empréstimos escolhendo o livro e a data prevista de devolução, acompanhem empréstimos ativos e o histórico, e registrem a devolução. Administradores visualizam os empréstimos com identificação do usuário.</td>
    </tr>
    <tr>
      <td><span class="code-badge rf-badge">RF08</span></td>
      <td><strong>Perfil e Resumo da Conta</strong></td>
      <td>Permitir que usuários autenticados consultem o resumo da própria conta (livros ativos, total no histórico e ano de ingresso) e atualizem nome, e-mail e senha (com confirmação da senha atual).</td>
    </tr>
    <tr>
      <td><span class="code-badge rf-badge">RF09</span></td>
      <td><strong>Painel Administrativo</strong></td>
      <td>Disponibilizar aos administradores um painel com visão geral do sistema (total de livros, empréstimos ativos, atrasados e devolvidos), controle de prazos e atalhos para as rotinas de gestão.</td>
    </tr>
  </tbody>
</table>

<hr />

<h2 id="requisitos-nao-funcionais">2. Requisitos Não Funcionais (RNF)</h2>
<table>
  <thead>
    <tr>
      <th width="10%">Código</th>
      <th width="25%">Categoria</th>
      <th>Descrição</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><span class="code-badge rnf-badge">RNF01</span></td>
      <td><strong>Arquitetura Desacoplada</strong></td>
      <td>Manter front-end (aplicação web em React) e back-end (API em Laravel) separados e comunicando-se via requisições HTTP/JSON, com configuração de CORS para permitir o acesso entre os domínios.</td>
    </tr>
    <tr>
      <td><span class="code-badge rnf-badge">RNF02</span></td>
      <td><strong>Containerização e Deploy</strong></td>
      <td>Permitir execução local padronizada com Docker e Docker Compose, com back-end containerizado preparado para hospedagem no Render e front-end preparado para publicação no Vercel.</td>
    </tr>
    <tr>
      <td><span class="code-badge rnf-badge">RNF03</span></td>
      <td><strong>Persistência de Dados</strong></td>
      <td>Armazenar usuários, livros e empréstimos em banco de dados relacional PostgreSQL, garantindo integridade entre os registros.</td>
    </tr>
    <tr>
      <td><span class="code-badge rnf-badge">RNF04</span></td>
      <td><strong>Usabilidade e Interface</strong></td>
      <td>Oferecer interface organizada e responsiva, com mensagens claras de retorno, indicadores de carregamento e janelas de confirmação para ações importantes.</td>
    </tr>
    <tr>
      <td><span class="code-badge rnf-badge">RNF05</span></td>
      <td><strong>Organização e Manutenção</strong></td>
      <td>Estruturar o projeto em módulos e camadas bem definidas para facilitar a manutenção, o trabalho em equipe e a evolução do sistema.</td>
    </tr>
  </tbody>
</table>

<hr />

<h2 id="requisitos-seguranca">3. Requisitos de Segurança (RSEC)</h2>
<table>
  <thead>
    <tr>
      <th width="10%">Código</th>
      <th width="25%">Requisito</th>
      <th>Descrição no Planejamento e Análise</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><span class="code-badge rsec-badge">RSEC01</span></td>
      <td><strong>Hash, Salt e Pepper de Senhas</strong></td>
      <td>As senhas dos usuários não devem ser armazenadas em texto puro, mas protegidas com algoritmo de hash forte (<code>bcrypt</code>) e salt único por senha, além de não serem expostas nas respostas da API. Como evolução de endurecimento, recomenda-se avaliar o uso de pepper adicional no nível da aplicação.</td>
    </tr>
    <tr>
      <td><span class="code-badge rsec-badge">RSEC02</span></td>
      <td><strong>Prepared Statements</strong></td>
      <td>Todas as consultas e alterações no banco de dados devem utilizar consultas parametrizadas (prepared statements) por meio do ORM, prevenindo ataques de SQL Injection.</td>
    </tr>
    <tr>
      <td><span class="code-badge rsec-badge">RSEC03</span></td>
      <td><strong>Logs e Auditoria</strong></td>
      <td>O sistema deve registrar eventos relevantes, erros e falhas da aplicação em arquivos de log para diagnóstico e rastreabilidade, sendo desejável expandir o registro de auditoria para ações sensíveis (como falhas de login, troca de senha e exclusões).</td>
    </tr>
    <tr>
      <td><span class="code-badge rsec-badge">RSEC04</span></td>
      <td><strong>Controle de Acesso (RBAC)</strong></td>
      <td>O acesso às funcionalidades deve respeitar o perfil do usuário (visitante/comum ou administrador), bloqueando operações administrativas para usuários não autorizados e impedindo que um usuário comum acesse ou altere empréstimos de outras pessoas.</td>
    </tr>
    <tr>
      <td><span class="code-badge rsec-badge">RSEC05</span></td>
      <td><strong>Validação de Dados e Arquivos</strong></td>
      <td>Todas as entradas de dados e envios de arquivos (como capas de livros) devem ser validadas no servidor quanto a formato, obrigatoriedade e tamanho máximo antes de serem processados ou salvos.</td>
    </tr>
  </tbody>
</table>

</body>
</html>
