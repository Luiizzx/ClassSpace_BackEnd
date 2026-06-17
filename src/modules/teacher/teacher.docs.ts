export const teacherPaths = {
  '/assignment/create': {
    post: {
      tags: ['Assignment'],
      summary: 'Criar nova tarefa',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name:        { type: 'string' },
                description: { type: 'string' },
                dueDate:     { type: 'string', format: 'date-time' },
              },
              required: ['name', 'description', 'dueDate'],
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Tarefa criada com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id:          { type: 'integer' },
                  name:        { type: 'string' },
                  description: { type: 'string' },
                  dueDate:     { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
      },
    },
  },

  '/assignment/update/:assignmentId': {
    patch: {
      tags: ['Assignment'],
      summary: 'Atualizar tarefa',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name:        { type: 'string' },
                description: { type: 'string' },
                dueDate:     { type: 'string', format: 'date-time' },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Tarefa atualizada com sucesso' },
        404: { description: 'Tarefa não encontrada' },
      },
    },
  },

  '/delivery/getAll/:assignmentId': {
    get: {
      tags: ['Deliveries'],
      summary: 'Obter entregas de uma tarefa',
      responses: {
        200: {
          description: 'Entregas obtidas com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id:          { type: 'integer', example: 1 },
                    studentName: { type: 'string',  example: 'João Silva' },
                  },
                },
              },
            },
          },
        },
        404: { description: 'Nenhuma entrega encontrada' },
      },
    },
  },

  '/delivery/update-score/:deliveryId': {
    patch: {
      tags: ['Deliveries'],
      summary: 'Atualizar pontuação da entrega',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                score: { type: 'number', example: 9.5 },
              },
              required: ['score'],
            },
          },
        },
      },
      responses: {
        200: { description: 'Pontuação atualizada com sucesso' },
        404: { description: 'Entrega não encontrada' },
      },
    },
  },
};