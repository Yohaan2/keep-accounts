import { SwaggerOptions } from '@fastify/swagger'
import { FastifySwaggerUiOptions } from '@fastify/swagger-ui'
import fs from 'fs'
import path from 'path'

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
      },
      {
        url: 'http://localhost:3001',
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
        },
        Client: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            amount: { type: 'number' },
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

export const swaggerUiConfig: FastifySwaggerUiOptions = {
  routePrefix: '/docs',
  uiConfig: {
				docExpansion: 'list',
				deepLinking: false,
			},
			theme: {
				favicon: [{
					filename: 'swagger.ico',
					rel: 'icon',
					sizes: '16x16',
					type: 'image/png',
					content: Buffer.from(fs.readFileSync(path.join(__dirname, '../assets/icon/swagger.ico')))
				}]
			},
			uiHooks: {
				onRequest: function (request, reply, next) { next()},
				preHandler: function (request, reply, next) { next()}
			},
			staticCSP: true,
			transformStaticCSP: (header) => header,
			transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
			transformSpecificationClone: true,
}