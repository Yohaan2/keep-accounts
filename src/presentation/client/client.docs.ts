import { FastifySchema } from "fastify"

const MAIN_TAG = 'Client'

export const clientCreateSchema: FastifySchema = {
  tags: [MAIN_TAG],
  description: 'Add new client',
  security: [{ bearerAuth: [] }],
  summary: 'Puedes crear un nuevo cliente para almacenar sus cuentas',
  body: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string' },
    },
  },
  response: {
    201: {
      description: 'Successful response',
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        user: { 
          type: 'object', 
          properties: { 
            id: { type: 'string' }, 
            name: { type: 'string' }, 
            email: { type: 'string' } 
          } 
        },
      }
    }
  }
}