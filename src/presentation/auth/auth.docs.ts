import { FastifySchema } from "fastify"

const MAIN_TAG = 'Auth'

export const registerUserSchema: FastifySchema = {
  tags: [MAIN_TAG],
  summary: 'Puedes registrar un nuevo usuario',
  body: {
    type: 'object',
    required: ['name', 'email', 'password'],
    properties: {
      name: { type: 'string' },
      email: { type: 'string' },
      password: { type: 'string' },
    },
  },
  response: {
    201: {
      description: 'Successful response',
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        refresh_token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
  },
}

export const loginUserSchema: FastifySchema = {
  tags: [MAIN_TAG],
  summary: 'Puedes iniciar sesion',
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string' },
      password: { type: 'string' },
    },
  },
  response: {
    201: {
      description: 'Successful response',
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        refresh_token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
  },
}

export const logoutUserSchema: FastifySchema = {
  tags: [MAIN_TAG],
  summary: 'Puedes cerrar sesion limpiando las cookies',
  response: {
    202: {
      description: 'Successful response',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  },
}

export const refreshTokenSchema: FastifySchema = {
  tags: [MAIN_TAG],
  summary: 'Puedes refrescar el token cuando el access token se ha expirado',
  response: {
    200: {
      description: 'Successful response',
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
        },
        refresh_token: {
          type: 'string'
        }
      },
    },
  },
}