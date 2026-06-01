use("livraria");

// AUTORES

db.autor.insertMany([
{
    _id: 1,
    nome: "Frank Herbert"
},
{
    _id: 2,
    nome: "Robert C. Martin"
},
{
    _id: 3,
    nome: "Erich Gamma"
},
{
    _id: 4,
    nome: "Richard Helm"
},
{
    _id: 5,
    nome: "Ralph Johnson"
}
]);

// EDITORAS

db.editora.insertMany([
{
    _id: 1,
    nome: "Aleph",
    cidade: "São Paulo"
},
{
    _id: 2,
    nome: "Alta Books",
    cidade: "Rio de Janeiro"
}
]);

// LIVROS

db.livro.insertMany([
{
    titulo: "Duna",
    autores: [1],
    editora: 1,
    ano: 1965
},
{
    titulo: "Clean Code",
    autores: [2],
    editora: 2,
    ano: 2008
},
{
    titulo: "Clean Architecture",
    autores: [2],
    editora: 2,
    ano: 2017
},
{
    titulo: "Design Patterns",
    autores: [3,4,5],
    editora: 2,
    ano: 1994
}
]);