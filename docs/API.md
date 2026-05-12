# API do Yearbook — Documentação de Endpoints

    Base URL (produção): `https://yearbook-backend.vercel.app`

    ## Convenções

    - Todas as respostas são em JSON
    - Rotas protegidas exigem header `Authorization: Bearer <token>`
    - O campo `senhaHash` nunca é retornado em nenhuma resposta
    - Erros seguem o formato `{ "erro": "mensagem descritiva" }`

## Auth

    ### POST /auth/register

    Cria uma nova conta de aluno.

    - **Autenticação:** Não
    - **Body:**

    ```json
    {
      "nome": "Maria Silva",
      "email": "maria@email.com",
      "senha": "minhasenha123",
      "cidade": "Salinas",
      "frase": "Aqui começa o futuro.",
      "planosFuturos": "Cursar Ciência da Computação na UFMG"
    }
    ```

    - **Resposta de sucesso:** `201 Created`

    ```json
    {
      "id": 1,
      "nome": "Maria Silva",
      "email": "maria@email.com",
      "cidade": "Salinas",
      "frase": "Aqui começa o futuro.",
      "planosFuturos": "Cursar Ciência da Computação na UFMG",
      "fotoUrl": null,
      "role": "USER",
      "criadoEm": "2026-04-03T10:30:00.000Z"
    }
    ```

    - **Erros:**
      - `400` — Campos obrigatórios ausentes
      - `409` — Email já cadastrado

### POST /auth/login

    Autentica um aluno e retorna um token JWT.

    - **Autenticação:** Não
    - **Body:**

    ```json
    {
      "email": "maria@email.com",
      "senha": "minhasenha123"
    }
    ```

    - **Resposta de sucesso:** `200 OK`

    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

    - **Erros:**
      - `401` — Credenciais inválidas (email não existe ou senha incorreta)

## Alunos

### GET /alunos

Lista todos os alunos cadastrados.

- **Autenticação:** Bearer token
- **Body:** Nenhum

- **Resposta de sucesso:** `200 OK`

```json
[
  {
    "id": 1,
    "nome": "Maria Silva",
    "email": "maria@email.com",
    "cidade": "Salinas",
    "frase": "Aqui começa o futuro.",
    "planosFuturos": "Cursar Ciência da Computação na UFMG",
    "fotoUrl": null,
    "role": "USER",
    "criadoEm": "2026-04-03T10:30:00.000Z"
  }
]
```

- **Erros:**
  - `401` — Token ausente ou inválido

---

### GET /alunos/:id

Retorna os dados de um aluno específico.

- **Autenticação:** Bearer token
- **Body:** Nenhum

- **Resposta de sucesso:** `200 OK`

```json
{
  "id": 1,
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "cidade": "Salinas",
  "frase": "Aqui começa o futuro.",
  "planosFuturos": "Cursar Ciência da Computação na UFMG",
  "fotoUrl": null,
  "role": "USER",
  "criadoEm": "2026-04-03T10:30:00.000Z"
}
```

- **Erros:**
  - `401` — Token ausente ou inválido
  - `404` — Aluno não encontrado

---

### PUT /alunos/:id

Atualiza os dados de um aluno.

- **Autenticação:** Bearer token
- **Body:**

```json
{
  "nome": "Maria Souza",
  "cidade": "Belo Horizonte",
  "frase": "Novos sonhos, novos caminhos."
}
```

- **Resposta de sucesso:** `200 OK`

```json
{
  "mensagem": "Aluno atualizado com sucesso"
}
```

- **Erros:**
  - `400` — Dados inválidos
  - `401` — Token ausente ou inválido
  - `403` — Sem permissão
  - `404` — Aluno não encontrado

---

### DELETE /alunos/:id

Remove um aluno do sistema.

- **Autenticação:** Bearer token (admin)
- **Body:** Nenhum

- **Resposta de sucesso:** `204 No Content`

- **Erros:**
  - `401` — Token ausente ou inválido
  - `403` — Apenas administradores
  - `404` — Aluno não encontrado

## Mensagens

### GET /mensagens

Lista todas as mensagens do mural.

- **Autenticação:** Bearer token
- **Body:** Nenhum

- **Resposta de sucesso:** `200 OK`

```json
[
  {
    "id": 1,
    "conteudo": "Foi incrível estudar com vocês!",
    "criadoEm": "2026-04-03T10:30:00.000Z",
    "autor": {
      "id": 1,
      "nome": "Maria Silva",
      "fotoUrl": null
    }
  }
]
```

- **Erros:**
  - `401` — Token ausente ou inválido

---

### POST /mensagens

Cria uma nova mensagem no mural.

- **Autenticação:** Bearer token
- **Body:**

```json
{
  "conteudo": "Nunca desistam dos seus sonhos!"
}
```

> O campo `autorId` não é enviado no body.  
> O usuário é identificado automaticamente pelo token JWT.

- **Resposta de sucesso:** `201 Created`

```json
{
  "id": 2,
  "conteudo": "Nunca desistam dos seus sonhos!",
  "criadoEm": "2026-04-03T11:00:00.000Z",
  "autorId": 1
}
```

- **Erros:**
  - `400` — Conteúdo não informado
  - `401` — Token ausente ou inválido

---

### DELETE /mensagens/:id

Remove uma mensagem do mural.

- **Autenticação:** Bearer token
- **Body:** Nenhum

- **Resposta de sucesso:** `204 No Content`

- **Erros:**
  - `401` — Token ausente ou inválido
  - `403` — Sem permissão para excluir esta mensagem
  - `404` — Mensagem não encontrada

