import fastifyFormbody from '@fastify/formbody'
import fastify, { FastifyInstance, FastifyRequest } from 'fastify'
import fjwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { AuthMiddleware } from './middlewares/auth.middleware'
import fs from 'fs'
import path from 'path'

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
		})
		this.app.register(fastifySwaggerUi, {
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
