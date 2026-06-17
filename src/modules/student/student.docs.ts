export const studentPaths = {
  '/enrollment/create': {
    post: {
      tags: ['Enrollment'],
      summary: 'Criação de nova matrícula para uma turma',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                studentId: { type: 'integer'},
                code: { type: 'string'}
              },
              required: ['studentId', 'code']
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Matrícula criada com sucesso'
        }
      }
    }
  },
  '/delivery/create/:assignmentId': {
    post: {
      tags: ['Deliveries'],
      summary: "Fazer entrega de uma tarefa",
      parameters: [
        {
          name: 'assignmentId',
          in: 'path',
          required: true,
          schema: { type: 'integer' }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                studentId: { type: 'integer' },
                links: {
                  type: 'array',
                  items: { type: 'string' }
                },
                delivered: { type: 'boolean', default: true }
              },
              required: ['studentId', 'links', 'delivered']
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Entrega criada com sucesso'
        }
      }
    }
  },
  '/delivery/update/:deliveryId': {
    patch: {
      tags: ['Deliveries'],
      summary: "Atualizar uma entrega de uma tarefa",
      parameters: [
        {
          name: 'deliveryId',
          in: 'path',
          required: true,
          schema: { type: 'integer' }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                links: {
                  type: 'array',
                  items: { type: 'string' }
                },
                delivered: { type: 'boolean' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Entrega atualizada com sucesso'
        }
      }
    }
  }
};