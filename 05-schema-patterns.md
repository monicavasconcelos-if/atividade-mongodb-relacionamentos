# Parte 3 – Schema Design Patterns

## 3.1 Extended Reference Pattern

### Documento

```json
{
  "_id": "r001",
  "livroId": "l001",
  "livroTitulo": "Duna",
  "usuarioId": "u001",
  "usuarioNome": "Maria Silva",
  "nota": 5,
  "texto": "Excelente obra."
}
```

### Justificativa

O padrão Extended Reference consiste em duplicar informações que são frequentemente exibidas em conjunto. Nesse caso, foram duplicados o título do livro e o nome do usuário, pois são dados relativamente estáveis e utilizados constantemente na visualização de resenhas.

### Campo que não seria duplicado

A bio do usuário não seria duplicada, pois é um dado sujeito a alterações frequentes. Caso fosse copiada para milhares de documentos de resenha, haveria risco de inconsistência e aumento do custo de manutenção.

## 3.2 Subset Pattern

### Documento

```json
{
  "_id": "l001",
  "titulo": "Duna",
  "totalResenhas": 53218,
  "ultimasResenhas": [
    {
      "usuario": "Maria",
      "nota": 5
    },
    {
      "usuario": "João",
      "nota": 4
    },
    {
      "usuario": "Ana",
      "nota": 5
    }
  ]
}
```

### Justificativa

O documento do livro armazena apenas as três resenhas mais recentes e um contador total de avaliações. Isso permite que a página principal do livro seja carregada rapidamente sem consultar milhares de documentos.

### Funcionamento da tela "Ver todas as resenhas"

Ao acessar a página do livro, o usuário visualiza apenas as três avaliações mais recentes armazenadas no documento. Quando seleciona a opção "Ver todas as resenhas", o sistema realiza uma consulta paginada na coleção resenhas, recuperando os registros completos.

---

## 3.3 Computed Pattern

### Documento

```json
{
  "_id": "l001",
  "titulo": "Duna",
  "somaNotas": 940,
  "mediaNotas": 4.7,
  "totalResenhas": 200
}
```

### Atualização executada ao inserir uma nova resenha com nota 5

```javascript
db.livro.updateOne(
{
  _id: "l001"
},
{
  $inc: {
    totalResenhas: 1,
    somaNotas: 5
  }
}
)
```

### Justificativa

O padrão Computed mantém valores agregados previamente calculados. Dessa forma, a média de avaliações e o total de resenhas ficam disponíveis imediatamente, sem necessidade de executar operações de agregação a cada leitura da página.

## 3.4 Outlier Pattern

### Problema

Usuários muito populares podem possuir milhões de seguidores, enquanto a maioria possui apenas algumas dezenas ou centenas.

### Documento padrão

```json
{
  "_id": "u001",
  "nome": "Maria Silva"
}
```

### Documento outlier

```json
{
  "_id": "u999",
  "nome": "Autor Famoso",
  "outlierFollowers": true
}
```

### Coleção auxiliar

```json
{
  "_id": "of001",
  "usuarioId": "u999",
  "seguidores": [
    "u001",
    "u002",
    "u003"
  ]
}
```

### Justificativa

O padrão Outlier é utilizado para tratar casos extremos sem impactar toda a coleção. Como apenas alguns usuários possuem milhões de seguidores, esses casos são armazenados separadamente. Isso evita documentos excessivamente grandes e mantém o modelo principal simples e eficiente para a maioria dos usuários.
