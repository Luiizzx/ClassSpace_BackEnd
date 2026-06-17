export const adminPaths = {
  '/class/search': {
    get: {
      tags: ['Admin'],
      summary: 'Buscar turmas por nome',
      parameters: [
        {
          name: 'name',
          in: 'query',
          required: true,
          schema: { type: 'string' }
        },
        {
          name: 'adminId',
          in: 'query',
          required: true,
          schema: { type: 'integer' }
        }
      ],
      responses: {
        200: {
          description: 'Turmas encontradas com sucesso'
        },
        404: {
          description: 'Nenhuma turma encontrada'
        }
      }
    }
  }
};