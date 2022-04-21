## The road to learn React

- Use `npm start` para rodar o app no [http://localhost:3000] e visualizar o app
- Ou acesse: https://whispering-dawn-22201.herokuapp.com/

- Projeto criado baseado no projeto do livro, existem algumas modificações no layout para uma melhor visualização

[![road-react](https://media.giphy.com/media/oMxeWZA19mtc0DsF4l/giphy.gif "road-react")](https://media.giphy.com/media/oMxeWZA19mtc0DsF4l/giphy.gif "road-react")

### Sobre o projeto

- O projeto contempla um SPA (Single Page Application) que faz comunicação com a API Hacker News, permitindo ao usuário pesquisar por palavras chaves e ter acesso a diversas notícias relacionadas a pesquisa. Existem filtros que permitem filtrar por Título (Title), Autor (Author), Comentários (Comments) e Pontos (Points)
- Usuário tem o botão More (Mais), para pesquisar mais material sobre o assunto procurado e também o botão Dismiss (Dispensar) para remover aquelas matérias que não lhe interessam
- O conteúdo pesquisado fica salvo no local storage do navegador, para quando o usuário pesquisar novamente pelo termo não precisar realizar uma nova requisição e assim carregar o conteúdo mais rápido
