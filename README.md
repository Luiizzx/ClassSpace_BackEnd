# BackEnd do projeto ClassSpace
Esse é o BackEnd do projeto ClassSpace, feito com Node JS versão 25, Typescrit, Express e Prisma ORM.

## Instalação e execução
Após clonar esse repositório e acessá-lo, rode ambos os comandos abaixo:

> npm install
> npx tsc

para fazer a instalação dos pacotes e compilar os arquivos TypeScript.

## Configurações com .env

Para que as requisições de fato funcionem, você precisa criar e configurar um banco de dados relacional.
Após configurar o banco, cheque o .env.example e crie seu próprio .env baseado nele.

Por padrão, as requisições serão escutadas na porta 3000.
Caso deseje alterar, escolha uma nova porta no PORT do seu .env.

## Rodando migrações

Após criar o banco de dados e colocar as configurações no .env, rode as migrações para criar as tabelas com:

> npx prisma migrate dev
> npx prisma generate
Isso cria todas as tabelas direto no banco configurado.

## Rodando o BackEnd

Após realizar todos esses passos, utilize o comando abaixo para rodar o BackEnd:

> node dist/server.js

As rotas estão separadas por módulo e comentadas no app.ts. 