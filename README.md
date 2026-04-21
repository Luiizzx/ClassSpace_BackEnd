# BackEnd do projeto ClassSpace
Esse é o BackEnd do projeto ClassSpace, feito com Node JS versão 25, Typescrit, Express e Prisma ORM.

## Instalação e execução
Após clonar esse repositório, e acessá-lo digite no terminal:

> npm install

para fazer a instalação dos pacotes.

Depois, rode o BackEnd usando:

> npm run dev

Você pode visualizar as rotas das requisições no arquivo routes.ts.

## Configurações com .env

Para que as requisições de fato funcionem, você precisa criar e configurar um banco de dados relacional.
Após configurar o banco, cheque o .env.example e crie seu próprio .env baseado nele.

Por padrão, as requisições serão escutadas na porta 3000.
Caso deseje alterar, escolha uma nova porta no PORT do seu .env.

## Rodando migrações

Após criar o banco de dados e colocar as configurações no .env, rode as migrações para criar as tabelas com:

> npx prisma migrate dev --name init

Isso criará uma pasta cujo nome será o momento (Timestamp) em que a migração rodou + "init", correspondente a criação de todas as tabelas iniciais.
