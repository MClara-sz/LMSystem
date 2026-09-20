# API Biblioteca - Entrega Parcial

Esta é uma API RESTful desenvolvida em Laravel para o gerenciamento de uma biblioteca, incluindo o consumo de dados da Brasil API para validação de livros via ISBN e autenticação via Laravel Sanctum.

## Tecnologias Utilizadas
* **Backend:** Laravel (PHP 8.2)
* **Banco de Dados:** PostgreSQL (Supabase)
* **Infraestrutura:** Docker e Docker Compose

## Como rodar o projeto localmente com Docker

1. Certifique-se de ter o Docker Desktop instalado e rodando em sua máquina.
2. Clone este repositório.
3. Configure o arquivo `.env` com as credenciais do Supabase (banco de dados na nuvem).
4. Abra o terminal na raiz do projeto e execute o comando:
   ```bash
   docker-compose up --build