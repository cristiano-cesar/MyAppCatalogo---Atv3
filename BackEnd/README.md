# Catálogo de Produtos — Back-end

API REST para gerenciamento de produtos de tecnologia, desenvolvida com Node.js, TypeScript, Express, Prisma ORM e PostgreSQL. O projeto inclui validação de dados com Zod e autenticação de usuários com JWT, utilizando bcrypt para proteger as senhas.

## 1. Tecnologias utilizadas

- **Node.js:** ambiente de execução JavaScript.
- **TypeScript:** tipagem estática para o desenvolvimento.
- **Express:** criação dos endpoints da API REST.
- **PostgreSQL 15:** banco de dados relacional.
- **Docker Compose:** execução do banco de dados em contêiner.
- **Prisma ORM:** acesso ao banco de dados e gerenciamento de migrações.
- **Zod:** validação dos dados recebidos pela API.
- **bcrypt:** geração e verificação de hashes de senhas.
- **jsonwebtoken (JWT):** geração e validação de tokens de autenticação.
- **tsx:** execução dos arquivos TypeScript durante o desenvolvimento.
- **Insomnia:** testes das requisições HTTP.

## 2. Pré-requisitos

Antes de executar o projeto, instale:

- Node.js e npm.
- Docker Desktop, com o mecanismo Docker em execução.
- Visual Studio Code ou outro editor de código.
- Insomnia, para testar os endpoints.

## 3. Estrutura do projeto

```text
BackEnd/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── middleware/
│   │   └── authMiddleware.ts
│   ├── routes/
│   │   └── authRoutes.ts
│   ├── schemas/
│   │   ├── auth.schema.ts
│   │   └── produtoSchema.ts
│   ├── prisma.ts
│   └── server.ts
├── .env
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
├── package-lock.json
├── prisma.config.ts
└── README.md
```

A pasta `prisma/migrations/` armazena o histórico das alterações do banco de dados. O arquivo `seed.ts` cadastra os produtos iniciais.

O diretório `src/` contém o servidor Express, a conexão com o Prisma Client, os esquemas de validação, as rotas de autenticação e o middleware responsável por verificar os tokens JWT.

## 4. Instalação das dependências

Abra o terminal na pasta do projeto:

```powershell
cd D:\MyAppCatalogo\BackEnd
```

Instale as dependências:

```powershell
npm install
```

## 5. Configuração das variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto, caso ainda não exista.

Configure as variáveis de acordo com o arquivo `docker-compose.yml`:

```dotenv
POSTGRES_USER=catalogo_user
POSTGRES_PASSWORD=SUBSTITUA_POR_UMA_SENHA_LOCAL
POSTGRES_DB=catalogo_db

DATABASE_URL="postgresql://catalogo_user:SUBSTITUA_POR_UMA_SENHA_LOCAL@localhost:5432/catalogo_db?schema=public"

ALLOWED_ORIGIN="http://localhost:5173"

JWT_SECRET="SUBSTITUA_POR_UMA_CHAVE_SECRETA"
```

Os valores de usuário, senha, banco e URL devem corresponder à configuração do PostgreSQL no `docker-compose.yml`. Substitua os valores de exemplo pelos valores utilizados no seu ambiente.

A variável `ALLOWED_ORIGIN` define a origem do front-end autorizada a acessar a API por meio do CORS.

A variável `JWT_SECRET` contém a chave secreta utilizada para assinar e validar os tokens JWT. Gere uma chave forte e exclusiva para o ambiente.

Para gerar uma chave aleatória no PowerShell, execute:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copie o resultado para a variável `JWT_SECRET` no arquivo `.env`.

### Arquivo `.env.example`

O arquivo `.env.example` deve conter os nomes das variáveis e valores ilustrativos, sem senhas ou chaves reais. Ele serve como modelo para configurar o ambiente.

**Importante:** não publique o arquivo `.env` em repositórios públicos. Mantenha-o no `.gitignore` e disponibilize apenas o `.env.example`.

Confira se o `.gitignore` contém as seguintes regras:

```gitignore
.env
.env.*
!.env.example
node_modules/
```

## 6. Inicialização do PostgreSQL com Docker

Com o Docker Desktop em execução, inicialize o banco:

```powershell
docker compose up -d
```

Confira o estado dos contêineres:

```powershell
docker compose ps
```

O serviço PostgreSQL deve aparecer em execução e, se houver uma verificação de saúde configurada, apresentar o estado `healthy`.

O banco utiliza a porta `5432` do computador e um volume persistente para preservar os dados.

Para interromper os contêineres sem remover os dados:

```powershell
docker compose down
```

Para iniciar novamente:

```powershell
docker compose up -d
```

## 7. Configuração do Prisma e migrações

Valide o esquema do banco:

```powershell
npx prisma validate
```

Gere o Prisma Client:

```powershell
npx prisma generate
```

Para aplicar as migrações existentes em um ambiente configurado:

```powershell
npx prisma migrate deploy
```

Durante o desenvolvimento, quando houver alterações no esquema que precisem de uma nova migração, utilize:

```powershell
npm run prisma:migrate -- --name nome_da_migracao
```

Para abrir a interface de consulta do banco de dados:

```powershell
npm run prisma:studio
```

As migrações registram e aplicam as alterações da estrutura do banco conforme o esquema definido em `prisma/schema.prisma`.

O esquema inclui os modelos de produtos e usuários. Os usuários possuem identificador, nome, e-mail, senha armazenada como hash e data de criação.

## 8. Cadastro dos produtos iniciais

Para inserir os produtos iniciais no banco de dados, execute:

```powershell
npm run seed
```

O seed cadastra cinco produtos de tecnologia, como notebook, mouse, teclado, monitor e SSD.

O procedimento utiliza o modelo `Produto` do Prisma e evita duplicar os produtos iniciais quando executado novamente, desde que os nomes permaneçam iguais.

## 9. Execução da API

Inicie o servidor em modo de desenvolvimento:

```powershell
npm run dev
```

A API estará disponível em:

`http://localhost:3001`

Para verificar se o servidor está funcionando, acesse:

`http://localhost:3001/`

Resposta esperada:

```json
{
  "status": "ok"
}
```

## 10. Endpoints de produtos

A API disponibiliza os caminhos em inglês (`/api/products`) e em português (`/api/produtos`).

As consultas são públicas. As operações de cadastro, atualização e exclusão exigem autenticação por meio de um token JWT válido.

| Método | Endpoint | Acesso | Descrição |
|---|---|---|---|
| GET | `/api/products` | Público | Lista os produtos |
| GET | `/api/products/:id` | Público | Consulta um produto por ID |
| POST | `/api/products` | Autenticado | Cadastra um produto |
| PUT | `/api/products/:id` | Autenticado | Atualiza um produto |
| DELETE | `/api/products/:id` | Autenticado | Exclui um produto |

Os mesmos métodos estão disponíveis nos caminhos equivalentes iniciados por `/api/produtos`.

### 10.1. Listar produtos

**Requisição:**

```http
GET /api/products
```

Exemplo de URL completa:

`http://localhost:3001/api/products`

Retorna a lista de produtos cadastrados. Não exige token JWT.

### 10.2. Consultar um produto

**Requisição:**

```http
GET /api/products/1
```

Exemplo de URL completa:

`http://localhost:3001/api/products/1`

Retorna o produto correspondente ao ID informado.

Principais respostas:

- `200 OK`: produto encontrado.
- `400 Bad Request`: identificador inválido.
- `404 Not Found`: produto não encontrado.
- `500 Internal Server Error`: erro interno do servidor.

### 10.3. Cadastrar um produto

**Requisição:**

```http
POST /api/products
Content-Type: application/json
Authorization: Bearer SEU_TOKEN_JWT
```

Corpo da requisição:

```json
{
  "nome": "Webcam Logitech C920",
  "descricao": "Webcam Full HD para videoconferências e aulas on-line.",
  "preco": 349.90,
  "imagemUrl": "https://exemplo.com/webcam.jpg"
}
```

O cabeçalho `Authorization` deve conter o token obtido no cadastro ou login.

Em caso de sucesso, a API retorna `201 Created` e os dados do produto criado, incluindo o identificador gerado pelo banco.

Validações aplicadas:

- `nome`: texto com pelo menos três caracteres.
- `descricao`: texto com pelo menos dez caracteres.
- `preco`: número maior que zero.
- `imagemUrl`: campo opcional; quando informado, deve atender às regras de validação do esquema.

O nome do produto deve ser único. Dados inválidos resultam em `400 Bad Request`, e um nome duplicado resulta em `409 Conflict`.

### 10.4. Atualizar um produto

**Requisição:**

```http
PUT /api/products/1
Content-Type: application/json
Authorization: Bearer SEU_TOKEN_JWT
```

Corpo da requisição:

```json
{
  "nome": "Webcam Logitech C920 Atualizada",
  "preco": 329.90
}
```

A atualização é parcial: podem ser enviados somente os campos que precisam ser alterados.

Em caso de sucesso, a API retorna `200 OK` e o produto atualizado.

Principais respostas:

- `400 Bad Request`: ID ou dados inválidos, ou corpo sem campos para atualização.
- `401 Unauthorized`: token ausente, inválido ou expirado.
- `404 Not Found`: produto não encontrado.
- `409 Conflict`: conflito com um nome já cadastrado.
- `500 Internal Server Error`: erro interno do servidor.

### 10.5. Excluir um produto

**Requisição:**

```http
DELETE /api/products/1
Authorization: Bearer SEU_TOKEN_JWT
```

Em caso de sucesso, a API retorna `204 No Content`, sem corpo na resposta.

Principais respostas:

- `401 Unauthorized`: token ausente, inválido ou expirado.
- `404 Not Found`: produto não encontrado.
- `500 Internal Server Error`: erro interno do servidor.

## 11. Autenticação e autorização com JWT

O projeto implementa autenticação de usuários por meio de JSON Web Token (JWT).

As senhas são processadas com bcrypt antes do armazenamento no banco de dados. Assim, a aplicação não precisa armazenar a senha original em texto puro.

O middleware de autenticação verifica o token enviado no cabeçalho `Authorization` antes de permitir o acesso às rotas protegidas.

### 11.1. Cadastro de usuário

**Requisição:**

```http
POST /api/auth/register
Content-Type: application/json
```

Corpo da requisição:

```json
{
  "nome": "Usuario Teste",
  "email": "usuario.teste@example.com",
  "senha": "Senha123"
}
```

Em caso de sucesso, a API retorna `201 Created`, com os dados públicos do usuário e um token JWT.

A senha não é incluída na resposta.

Principais respostas:

- `201 Created`: usuário cadastrado.
- `400 Bad Request`: dados inválidos.
- `409 Conflict`: e-mail já cadastrado.
- `500 Internal Server Error`: erro interno do servidor.

### 11.2. Login

**Requisição:**

```http
POST /api/auth/login
Content-Type: application/json
```

Corpo da requisição:

```json
{
  "email": "usuario.teste@example.com",
  "senha": "Senha123"
}
```

Quando as credenciais são válidas, a API retorna `200 OK`, os dados públicos do usuário e um token JWT.

O token é gerado com prazo de validade de sete dias, conforme a configuração implementada no servidor.

Principais respostas:

- `200 OK`: autenticação realizada.
- `400 Bad Request`: dados inválidos.
- `401 Unauthorized`: e-mail ou senha incorretos.
- `500 Internal Server Error`: erro interno do servidor.

### 11.3. Consultar o usuário autenticado

**Requisição:**

```http
GET /api/auth/me
Authorization: Bearer SEU_TOKEN_JWT
```

Essa rota permite consultar os dados do usuário associado ao token.

O token deve ser enviado no cabeçalho `Authorization`, precedido por `Bearer`.

Principais respostas:

- `200 OK`: token válido e usuário encontrado.
- `401 Unauthorized`: token ausente, inválido ou expirado.
- `404 Not Found`: usuário associado ao token não encontrado.
- `500 Internal Server Error`: erro interno do servidor.

### 11.4. Proteção das rotas

As rotas de escrita de produtos utilizam o middleware `autenticar`.

O middleware:

1. Verifica se o cabeçalho `Authorization` contém um token Bearer.
2. Valida o token JWT com a chave secreta configurada no ambiente.
3. Rejeita tokens inválidos ou expirados.
4. Permite a continuidade da requisição quando a autenticação é válida.

As rotas `GET` dos produtos permanecem públicas, enquanto `POST`, `PUT` e `DELETE` exigem autenticação.

### 11.5. Validação dos dados de autenticação

O Zod valida os dados recebidos no cadastro e no login.

No cadastro, são exigidos nome, e-mail válido e senha com pelo menos seis caracteres. No login, são exigidos e-mail válido e senha informada.

As requisições com dados inválidos são rejeitadas antes do processamento da operação.

## 12. Validação de dados com Zod

O projeto utiliza o Zod para validar os dados recebidos nas operações de criação e atualização de produtos, bem como no cadastro e login de usuários.

Na parte de produtos, a validação verifica o tamanho mínimo do nome e da descrição, exige um preço positivo e permite atualizações parciais por meio de um esquema baseado em `produtoSchema.partial()`.

As validações são realizadas antes da gravação no banco de dados. As requisições inválidas recebem `400 Bad Request`.

## 13. Configuração do CORS

O CORS (*Cross-Origin Resource Sharing*) é configurado pelo middleware `cors` do Express.

A origem permitida é definida pela variável `ALLOWED_ORIGIN`, cujo valor padrão no servidor é:

`http://localhost:5173`

A configuração permite os métodos HTTP `GET`, `POST`, `PUT` e `DELETE`, além dos cabeçalhos `Content-Type` e `Authorization`.

O cabeçalho `Authorization` é necessário para o envio do token JWT nas requisições autenticadas.

Essa configuração permite que o front-end local acesse a API, respeitando as origens autorizadas no servidor.

## 14. Testes com o Insomnia

Utilize a URL-base:

`http://localhost:3001`

Os testes podem ser organizados em dois grupos: gerenciamento de produtos e autenticação.

### 14.1. Testes do catálogo

Verifique os seguintes cenários:

- Consulta do estado da API.
- Listagem pública de produtos.
- Consulta de produto existente.
- Consulta com ID inválido.
- Consulta com ID inexistente.
- Cadastro de produto com token válido.
- Cadastro sem token.
- Cadastro com dados inválidos.
- Cadastro com nome duplicado.
- Atualização com token válido.
- Atualização sem token.
- Atualização de produto inexistente.
- Exclusão com token válido.
- Exclusão sem token.
- Exclusão de produto inexistente.

### 14.2. Testes de autenticação

**Cadastro de usuário**

Envie `POST /api/auth/register` com nome, e-mail e senha válidos. O resultado esperado é `201 Created`.

**Login**

Envie `POST /api/auth/login` com as credenciais cadastradas. O resultado esperado é `200 OK`, com os dados públicos do usuário e o token JWT.

**Consulta sem token**

Envie `GET /api/auth/me` sem o cabeçalho `Authorization`. O resultado esperado é `401 Unauthorized`.

**Consulta com token válido**

Envie `GET /api/auth/me` com o cabeçalho:

```http
Authorization: Bearer SEU_TOKEN_JWT
```

O resultado esperado é `200 OK`.

**Cadastro de produto sem token**

Envie `POST /api/products` sem autenticação. O resultado esperado é `401 Unauthorized`.

**Cadastro de produto com token**

Repita a requisição com um token válido e um corpo JSON que atenda ao esquema de validação. O cadastro deve ser autorizado.

**Atualização e exclusão sem token**

Envie requisições `PUT` e `DELETE` sem autenticação. Ambas devem retornar `401 Unauthorized`.

Os testes realizados confirmaram o funcionamento do cadastro de usuários, do login, da consulta do usuário autenticado e do bloqueio das operações de escrita quando o token não é informado.

### 14.3. Principais códigos HTTP

| Código | Significado |
|---|---|
| `200 OK` | Requisição concluída com sucesso |
| `201 Created` | Recurso criado |
| `204 No Content` | Operação concluída sem corpo na resposta |
| `400 Bad Request` | Dados ou identificador inválidos |
| `401 Unauthorized` | Autenticação ausente ou inválida |
| `404 Not Found` | Recurso não encontrado |
| `409 Conflict` | Conflito, como nome ou e-mail duplicado |
| `500 Internal Server Error` | Erro interno do servidor |

## 15. Observações

- O banco de dados é executado localmente por meio do Docker Compose.
- O Prisma Client é gerado a partir do esquema do Prisma.
- O campo `preco` utiliza o tipo `Decimal` para representar valores monetários.
- O campo `imagemUrl` permite armazenar o endereço de uma imagem; o upload de arquivos não faz parte da implementação atual.
- As senhas dos usuários são armazenadas como hashes gerados com bcrypt.
- Os tokens JWT possuem prazo de validade e são verificados pelo middleware de autenticação.
- As credenciais do banco e o segredo JWT devem permanecer em variáveis de ambiente.
- O arquivo `.env.example` deve conter somente valores ilustrativos, sem credenciais reais.

## 16. Licença

Projeto desenvolvido para fins acadêmicos e de aprendizagem em desenvolvimento de APIs REST.