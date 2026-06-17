export const userPaths = {
  '/class/getAll/:userId': {
    get: {
      tags: ['Class'],
      summary: 'Obter turmas do usuário',
      responses: {
        200: {
          description: 'Turmas obtidas com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id:     { type: 'integer' },
                    code:   { type: 'string' },
                    name:   { type: 'string' },
                  },
                },
              },
            },
          },
        },
        404: { description: 'Nenhuma turma encontrada' },
      },
    },
  },
  '/class/getParticipants/:classId': {
    get: {
      tags: ['Class'],
      summary: 'Obter participantes da turma',
      responses: {
        200: {
          description: 'Participantes obtidos com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  teacher: {
                    type: 'object',
                    properties: {
                      name:  { type: 'string' },
                      email: { type: 'string' },
                    },
                  },
                  students: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        404: { description: 'Turma não encontrada' },
      },
    },
  },
  '/getPosts/:classId': {
    get: {
      tags: ['Posts'],
      summary: 'Obter postagens da turma',
      responses: {
        200: {
          description: 'Postagens obtidas com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id:         { type: 'integer' },
                    authorName: { type: 'string' },
                    date:       { type: 'string', format: 'date-time' },
                    text:       { type: 'string' },
                  },
                },
              },
            },
          },
        },
        404: { description: 'Nenhuma postagem encontrada' },
      },
    },
  },
  '/getPosts/:postId': {
    get: {
      tags: ['Posts'],
      summary: 'Obter postagem',
      responses: {
        200: {
          description: 'Postagem obtida com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id:         { type: 'integer' },
                  authorName: { type: 'string' },
                  date:       { type: 'string', format: 'date-time' },
                  text:       { type: 'string' },
                  replies: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id:         { type: 'integer' },
                        authorName: { type: 'string' },
                        date:       { type: 'string', format: 'date-time' },
                        text:       { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        404: { description: 'Postagem não encontrada' },
      },
    },
  },

  '/createPost/:classId': {
    post: {
      tags: ['Posts'],
      summary: 'Criar postagem',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                authorName: { type: 'string' },
                text:       { type: 'string' },
                date:       { type: 'string', format: 'date-time' },
              },
              required: ['authorName', 'text'],
            },
          },
        },
      },
      responses: {
        200: { description: 'Postagem criada com sucesso' },
        404: { description: 'Turma não encontrada' },
      },
    },
  },
  
  '/replyPost/:postId': {
    post: {
      tags: ['Posts'],
      summary: 'Responder postagem',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                authorName: { type: 'string' },
                text:       { type: 'string' },
                date:       { type: 'string', format: 'date-time' },
              },
              required: ['authorName', 'text'],
            },
          },
        },
      },
      responses: {
        200: { description: 'Resposta adicionada com sucesso' },
        404: { description: 'Postagem não encontrada' },
      },
    },
  },

  '/assignment/getAll/:classId': {
    get: {
      tags: ['Assignment'],
      summary: 'Obter todas as tarefas da turma',
      responses: {
        200: {
          description: 'Tarefas obtidas com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
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
        404: { description: 'Nenhuma tarefa encontrada' },
      },
    },
  },

  '/assignment/getAssignment/:assignmentId': {
    get: {
      tags: ['Assignment'],
      summary: 'Obter tarefa específica',
      responses: {
        200: {
          description: 'Tarefa obtida com sucesso',
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
        404: { description: 'Tarefa não encontrada' },
      },
    },
  },

  '/delivery/getDelivery/:deliveryId': {
    get: {
      tags: ['Deliveries'],
      summary: 'Obter entrega específica',
      responses: {
        200: {
          description: 'Entrega obtida com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  studentName: { type: 'string',  example: 'João Silva' },
                  score:       { type: 'number',  example: 9.5, nullable: true },
                  attachments: {
                    type: 'array',
                    nullable: true,
                    items: {
                      type: 'string',
                      format: 'uri',
                      example: 'https://storage.com/arquivo.pdf',
                    },
                  },
                },
              },
            },
          },
        },
        404: { description: 'Entrega não encontrada' },
      },
    },
  },
};