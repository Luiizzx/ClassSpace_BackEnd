import { authPaths } from "./modules/auth/auth.docs.js"

export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'ClassSpace BackEnd API',
    version: '1.0.0',
    description: 'Documentação da API com Swagger',
  },
  servers: [
    {
      url: 'http://localhost:3001',
    },
  ],
  paths: {
    ...authPaths
  }
}