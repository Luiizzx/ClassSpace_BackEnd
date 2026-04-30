export const authPaths = {
  '/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Login do usuário',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: { type: 'string' },
                password: { type: 'string' },
              },
              required: ['email', 'password'],
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Login feito com sucesso',
        },
      },
    },
  },

  '/auth/create-acc': {
    post: {
      tags: ['Auth'],
      summary: 'Criação de conta',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: {type: 'string'},
                email: { type: 'string' },
                password: { type: 'string' },
                role: {type: 'string'}
              },
              required: ['name', 'email', 'password', 'role'],
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Conta criada com sucesso',
        },
      },
    },
  }
};