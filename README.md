# Atividade MongoDB – Relacionamentos e Schema Design

**Disciplina:** Banco de Dados
**Tema:** Modelagem de Relacionamentos, `$lookup` e Schema Design Patterns no MongoDB

# Objetivo

Projetar e implementar uma solução para uma rede social de leitura inspirada em plataformas como Skoob e Goodreads, aplicando conceitos de modelagem de dados em MongoDB, relacionamentos entre documentos, agregações utilizando `$lookup` e Schema Design Patterns.

# Estrutura do Projeto

```text
atividade-mongodb/
│
├── README.md
├── 01-modelagem.md
├── 05-schema-patterns.md
│
└── scripts/
    ├── 02-seed.js
    ├── 03-lookup-editora.js
    └── 04-lookup-autores.js
```

# Parte 1 – Modelagem de Relacionamentos

A modelagem foi desenvolvida considerando os requisitos de uma rede social de leitura composta pelas entidades:

* Usuário
* Livro
* Autor
* Editora
* Resenha
* Comentário
* Estante
* Seguidores

As decisões de modelagem foram tomadas considerando:

* Cardinalidade dos relacionamentos;
* Frequência de leitura conjunta;
* Frequência de atualização dos dados;
* Crescimento esperado do relacionamento;
* Limite de 16 MB por documento BSON.

As respostas completas encontram-se no arquivo:

```text
01-modelagem.md
```

---

# Coleções Utilizadas

## usuarios

Armazena informações dos usuários da plataforma.

Principais campos:

* nome
* email
* bio
* foto
* configurações
* dataCadastro


## autores

Armazena os autores dos livros.

Principais campos:

* nome
* país


## editoras

Armazena informações das editoras.

Principais campos:

* nome
* cidade


## livros

Armazena os livros cadastrados.

Principais campos:

* titulo
* autores
* editora
* ano
* generos
* isbn
* sinopse


## resenhas

Armazena avaliações dos usuários sobre os livros.

Principais campos:

* usuarioId
* livroId
* nota
* texto
* curtidas
* data


## comentarios

Armazena comentários realizados em resenhas.

Principais campos:

* resenhaId
* usuarioId
* texto
* data


## estantes

Representa as listas de leitura dos usuários.

Tipos:

* lido
* lendo
* quero ler


## seguidores

Representa o relacionamento social entre usuários.

Principais campos:

* seguidorId
* seguidoId
* data


# Parte 2 – Consultas com $lookup

## Script: 02-seed.js

Responsável pela criação dos dados iniciais utilizados na atividade.

O script cria:

### Autores

* Frank Herbert
* Robert C. Martin
* Erich Gamma
* Richard Helm
* Ralph Johnson

### Editoras

* Aleph
* Alta Books

### Livros

* Duna
* Clean Code
* Clean Architecture
* Design Patterns

Requisitos atendidos:

* Livro com múltiplos autores.
* Dois livros publicados pela mesma editora.


## Script: 03-lookup-editora.js

Objetivo:

Relacionar livros e editoras utilizando `$lookup`.

Operadores utilizados:

* `$lookup`
* `$unwind`
* `$project`

Saída esperada:

```json
{
  "title": "Duna",
  "editora": "Aleph",
  "cidade": "São Paulo"
}
```

## Script: 04-lookup-autores.js

Objetivo:

Resolver o relacionamento N:N entre livros e autores.

Operadores utilizados:

* `$lookup`
* `$project`

Saída esperada:

```json
{
  "title": "Design Patterns",
  "autores": [
    "Erich Gamma",
    "Richard Helm",
    "Ralph Johnson"
  ]
}
```

# Parte 3 – Schema Design Patterns

Foram aplicados os seguintes padrões de modelagem:

## Extended Reference

Duplicação controlada de informações frequentemente acessadas.

Exemplo:

* Nome do usuário
* Título do livro

Benefício:

Redução da necessidade de `$lookup` em leituras frequentes.


## Subset Pattern

Armazena apenas as três resenhas mais recentes dentro do documento do livro.

Benefício:

Melhora o desempenho das consultas mais comuns.


## Computed Pattern

Mantém valores previamente calculados.

Exemplo:

* Média das notas
* Quantidade de resenhas

Benefício:

Evita agregações repetitivas em tempo de leitura.


## Outlier Pattern

Utilizado para usuários com milhões de seguidores.

Benefício:

Evita crescimento excessivo dos documentos e melhora a escalabilidade da aplicação.

As respostas completas encontram-se no arquivo:

```text
05-schema-patterns.md
```

# Como Executar

## 1. Criar o banco

```javascript
use("livraria")
```

## 2. Executar carga inicial

```javascript
load("./scripts/02-seed.js")
```

## 3. Executar consulta Livro → Editora

```javascript
load("./scripts/03-lookup-editora.js")
```

## 4. Executar consulta Livro → Autor

```javascript
load("./scripts/04-lookup-autores.js")
```

# Conclusão

A atividade demonstrou a aplicação prática de técnicas de modelagem para bancos NoSQL utilizando MongoDB. Foram analisados diferentes tipos de relacionamentos, estratégias de armazenamento por embedding e referência, consultas utilizando `$lookup` e padrões de modelagem voltados para desempenho e escalabilidade.

