import { SwaggerOptions } from '@fastify/swagger'

export const swaggerConfig: SwaggerOptions = {
  openapi: {
    info: {
      title: 'Keep Account',
      description: 'Keep Account API',
      version: '1.0.0'
    },
    servers:[
      {
        url: 'https://keep-accounts.onrender.com/',
      }
    ],
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here'
    },
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            password: { type: 'string' },
            role: { type: 'string' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer', 
          bearerFormat: 'JWT'
        }
      }
    }
  }
}