import fastifyFormbody from '@fastify/formbody'
import fastify, { FastifyInstance, FastifyRequest } from 'fastify'
import fjwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { AuthMiddleware } from './middlewares/auth.middleware'

interface Options {
	port?: number
	routes: FastifyInstanceFunction
	jwtSeed: string
}

type FastifyInstanceFunction = (fastify: FastifyInstance) => void

export class Server {
	public readonly app: FastifyInstance = fastify()
	private readonly port: number
	private readonly routes: FastifyInstanceFunction
	private readonly jwtSeed: string

	constructor(options: Options) {
		const { port = 8080, routes, jwtSeed } = options

		this.port = port
		this.routes = routes
		this.jwtSeed = jwtSeed
	}

	async start() {
		this.app.register(fjwt, {
			secret: this.jwtSeed
		})
		this.app.addHook('preHandler', (request: FastifyRequest, reply, done) => {
			request.jwt = this.app.jwt
			return done()
		})
		
		this.app.register(fastifyCookie, {
			secret: 'secret',
			hook: 'preHandler'
		})
		this.app.decorate('authenticate', AuthMiddleware.validateJwt)
		this.app.register(fastifyFormbody) // x-www-form-urlencoded
		this.app.register(fastifySwagger, {
			swagger: {
				info:{
					title: 'Keep Account',
					description: 'Keep Account API',
					version: '1.0.0'
				},
				externalDocs: {
					url: 'https://swagger.io',
					description: 'Find more info here'
				},
				host: '0.0.0.0',
				schemes: ['http', 'https'],
				consumes: ['application/json'],
				produces: ['application/json'],
				securityDefinitions: {
        authorization: {
          type: 'apiKey',
          name: 'authorization',
          in: 'header',
					description: 'Enter the token with the `Bearer: `'
        }
      }
			}
		})
		this.app.register(fastifySwaggerUi, {
			routePrefix: '/docs',
			uiConfig: {
				docExpansion: 'list',
				deepLinking: false,
			},
			uiHooks: {
				onRequest: function (request, reply, next) { next()},
				preHandler: function (request, reply, next) { next()}
			},
			staticCSP: true,
			transformStaticCSP: (header) => header,
			transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
			transformSpecificationClone: true
		})
		this.routes(this.app)

		this.app.listen({ port: this.port, host: '0.0.0.0' }, (err, address) => {
			if (err) {
				console.error(err)
				process.exit(1)
			}
			console.log(`Server listening on ${this.port}`)
		})
	}
}
