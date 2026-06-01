# Parte 1 – Modelagem de Relacionamentos

## 1.1 Decisões Embed × Referência

### Coleções propostas

* usuarios
* autores
* editoras
* livros
* resenhas
* comentarios
* estantes
* seguidores


## Exemplo de documento da coleção usuarios

```json
{
  "_id": "u001",
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "bio": "Leitora de ficção científica",
  "foto": {
    "url": "https://cdn.site.com/fotos/maria.jpg"
  },
  "configuracoes": {
    "tema": "dark",
    "perfilPrivado": false
  },
  "dataCadastro": "2026-05-01"
}
```

## Exemplo de documento da coleção autores

```json
{
  "_id": "a001",
  "nome": "Frank Herbert",
  "pais": "Estados Unidos"
}
```

## Exemplo de documento da coleção editoras

```json
{
  "_id": "e001",
  "nome": "Aleph",
  "cidade": "São Paulo"
}
```

## Exemplo de documento da coleção livros

```json
{
  "_id": "l001",
  "titulo": "Duna",
  "autores": ["a001"],
  "editora": "e001",
  "ano": 1965,
  "generos": ["Ficção Científica"],
  "isbn": "9788576573135",
  "sinopse": "A luta pelo controle de Arrakis."
}
```

## Exemplo de documento da coleção resenhas

```json
{
  "_id": "r001",
  "usuarioId": "u001",
  "livroId": "l001",
  "nota": 5,
  "texto": "Uma obra-prima da ficção científica.",
  "curtidas": 120,
  "data": "2026-05-10"
}
```

## Exemplo de documento da coleção comentarios

```json
{
  "_id": "c001",
  "resenhaId": "r001",
  "usuarioId": "u002",
  "texto": "Concordo totalmente.",
  "data": "2026-05-11"
}
```

## Exemplo de documento da coleção estantes

```json
{
  "_id": "es001",
  "usuarioId": "u001",
  "tipo": "lido",
  "livros": ["l001", "l002"]
}
```

## Exemplo de documento da coleção seguidores

```json
{
  "_id": "s001",
  "seguidorId": "u001",
  "seguidoId": "u050",
  "data": "2026-05-20"
}
```

# (a) Usuário ↔ foto/perfil/configurações

### Decisão: EMBED

Foto, perfil e configurações possuem cardinalidade 1:1 e são acessados junto com os dados do usuário. O volume dessas informações é pequeno e não representa risco de atingir o limite de 16 MB do BSON. Como a leitura conjunta é muito frequente, o embedding reduz a necessidade de consultas adicionais.

# (b) Resenha ↔ comentários

### Decisão: REFERÊNCIA

Uma resenha pode possuir poucos comentários ou milhares deles. Como esse relacionamento pode crescer, armazenar comentários dentro da resenha pode gerar documentos muito grandes. Mantê-los em uma coleção separada permite paginação, melhor desempenho e maior escalabilidade.

# (c) Livro ↔ resenhas

### Decisão: REFERÊNCIA

Livros populares podem acumular centenas de milhares de resenhas ao longo do tempo. Armazenar todas dentro do documento do livro aumentaria excessivamente seu tamanho e dificultaria atualizações. Como as resenhas normalmente são carregadas de forma paginada, a utilização de uma coleção separada é mais adequada.


# (d) Usuário ↔ livros nas estantes

### Decisão: REFERÊNCIA

O relacionamento entre usuários e livros é do tipo N:N. Um usuário pode possuir milhares de livros em suas estantes e um mesmo livro pode estar presente em milhões de estantes. Utilizar referências mantém os documentos menores e facilita consultas em ambas as direções.

# (e) Usuário ↔ usuários (seguir)

### Decisão: REFERÊNCIA

O relacionamento de seguidores representa um grafo social. Alguns usuários podem possuir milhões de seguidores, tornando inviável armazenar todos os IDs em um único documento. Uma coleção própria de relacionamentos oferece melhor escalabilidade e facilita consultas específicas.


## 1.2 Cardinalidade que muda a decisão

### Livro comum (dezenas de resenhas)

Em um livro com poucas resenhas, seria possível armazenar as avaliações diretamente no documento do livro.

```json
{
  "_id": "l001",
  "titulo": "Livro Exemplo",
  "resenhas": [
    {
      "usuario": "Maria",
      "nota": 5
    },
    {
      "usuario": "João",
      "nota": 4
    }
  ]
}
```

Nesse cenário, a leitura é simples e rápida porque todas as informações estão no mesmo documento.

### Best-seller (centenas de milhares de resenhas)

Nesse cenário as resenhas devem ser armazenadas em uma coleção própria.

```json
{
  "_id": "l001",
  "titulo": "Harry Potter"
}
```

```json
{
  "_id": "r100001",
  "livroId": "l001",
  "nota": 5
}
```

### Schema Design Pattern utilizado

**Subset Pattern**

O documento do livro mantém apenas um subconjunto das resenhas mais recentes e um contador total. As demais resenhas permanecem em uma coleção separada. Essa abordagem mantém o documento pequeno e melhora o desempenho das consultas mais frequentes.


## 1.3 N:N – De que lado guardar a referência?

A melhor solução é utilizar uma coleção intermediária chamada seguidores.

```json
{
  "_id": "s001",
  "seguidorId": "u001",
  "seguidoId": "u050"
}
```

Guardar listas de seguidores diretamente no documento do usuário não escala para perfis com milhões de seguidores. Armazenar arrays nos dois lados do relacionamento gera duplicação de dados e aumenta a complexidade de sincronização. A coleção intermediária permite consultas eficientes para “quem eu sigo” e “quem me segue”, além de facilitar a criação de índices específicos para cada tipo de consulta.
