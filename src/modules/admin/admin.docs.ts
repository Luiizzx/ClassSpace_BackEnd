export const adminPaths = {
  '/stats/{classId}': {
    get: {
      tags: ['Admin'],
      summary: 'Obter estatísticas de uma turma',
      parameters: [
        {
          name: 'classId',
          in: 'path',
          required: true,
          schema: {
            type: 'integer'
          }
        },
        {
          name: 'userId',
          in: 'query',
          required: true,
          schema: {
            type: 'integer'
          }
        }
      ],
      responses: {
        200: {
          description: 'Estatísticas da turma obtidas com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  className: {
                    type: 'string',
                    example: 'Algoritmos'
                  },
                  info: {
                    type: 'object',
                    properties: {
                      totalStudents: {
                        type: 'integer',
                        example: 35
                      },
                      totalAssignments: {
                        type: 'integer',
                        example: 8
                      },
                      deliveries: {
                        type: 'array',
                        items: {
                          type: 'object'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        400: {
          description: 'Usuário não existe ou não é um administrador'
        },
        404: {
          description: 'Turma não encontrada'
        }
      }
    }
  }
};