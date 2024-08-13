import { FastifySchema } from "fastify"

const MAIN_TAG = 'Client'

export const clientCreateSchema: FastifySchema = {
  tags: [MAIN_TAG],
  security: [{ bearerAuth: [] }],
  summary: 'Puedes crear un nuevo cliente para almacenar sus cuentas',
  body: {
    type: 'object',
    properties: {
      name: { type: 'string'}
    }
  },
  response: {
    201: {
      description: 'Successful response',
      type: 'object',
      properties: {
        id: { type: 'string' }, 
        name: { type: 'string' }, 
        createdAt: { type: 'string' },
        total: { type: 'number' },
      }
    }
  }
}

export const clientRecordDebtSchema: FastifySchema = {
  tags: [MAIN_TAG],
  security: [{ bearerAuth: [] }],
  summary: 'Puedes registrar un nuevo producto a la cuenta del cliente',
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
  },
  body: {
    type: 'object',
    required: ['amount', 'description'],
    properties: {
      amount: { type: 'number' },
      description: { type: 'string' },
    },
  },
  response: {
    201: {
      description: 'Successful response',
      type: 'object',
      properties: {
        id: { type: 'string' }, 
        name: { type: 'string' }, 
        createdAt: { type: 'string' },
        total: { type: 'number' },
      }
    }
  }
}

export const clientGetDebtsSchema: FastifySchema = {
  tags: [MAIN_TAG],
  security: [{ bearerAuth: [] }],
  summary: 'Puedes obtener las cuentas de un cliente en especifico',
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
  },
  response: {
    200: {
      description: 'Successful response',
      type: 'object',
      properties: {
        id: { type: 'string' }, 
        name: { type: 'string' }, 
        createdAt: { type: 'string' },
        total: { type: 'number' },
        totalDolar: { type: 'string' },
        debt: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              amount: { type: 'number' },
              description: { type: 'string' },
              createdAt: { type: 'string' },
            }
          }
        }
      }
    }
  }
}