# 🚀 Visão Geral da Plataforma - Gerenciamento de Produtos e Usuários

Este é um sistema **CRUD** simplificado (Create, Read, Update, Delete) para gerenciamento de produtos e categorias, construído com **React.js (Next.js)** e componentes **Shadcn UI**.

## ✨ Funcionalidades Principais

| Entidade | Ações Suportadas | Regra de Negócio |
| :--- | :--- | :--- |
| **Categorias** | Ler, Cadastrar, Atualizar, **Ativar** e **Desativar**. | Nenhuma |
| **Produtos** | Ler, Cadastrar, Atualizar, **Ativar** e **Desativar**. | Não é possível criar ou editar um produto usando uma **categoria desativada**. |
| **Usuários** | Ler e Cadastrar. | - |

## 👥 Colaboração e Acesso

* **Multi-Tenant:** A plataforma suporta múltiplos usuários trabalhando em colaboração.
* **Acesso Simplificado:** O sistema utiliza um fluxo de **Login Básico**, **sem geração de Token JWT**.
* **Autenticação:** O sistema salva **IDs localmente** (ex: `tenantId`) para autorização de operações de CRUD.

## 💻 Como Rodar a Aplicação

Siga os passos abaixo para iniciar o projeto:

### Pré-requisitos
Certifique-se de ter o Node.js e o npm instalados.

### Comandos de Execução

1.  **Instalar Dependências:**
    ```bash
    npm install
    ```
2.  **Rodar a Aplicação:**
    ```bash
    npm run dev
    ```

A aplicação estará acessível em `http://localhost:3000` (ou a porta que o Next.js indicar).
