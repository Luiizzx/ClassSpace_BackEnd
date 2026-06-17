export const authPaths = {
  '/auth': {
    get: {
      tags: ['Auth'],
      summary: 'Verifica autenticação do usuário',
      security: [],
      responses: {
        200: {
          description: 'Usuário autenticado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id:   { type: 'string' },
                  name: { type: 'string' },
                  role: { type: 'string' },
                },
              },
            },
          },
        },
        401: { description: 'Não autorizado' },
      },
    },
  },

  '/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Login do usuário',
      security: [],
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

  '/auth/logout': {
    post: {
      tags: ['Auth'],
      summary: 'Logout do usuário',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Logout feito com sucesso',
        },
        401: { description: 'Não autorizado' },
      },
    },
  },

  '/auth/create-acc': {
    post: {
      tags: ['Auth'],
      summary: 'Criação de conta',
      security: [],
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