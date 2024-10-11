import fastifyFormbody from '@fastify/formbody'
import fastify, { FastifyInstance, FastifyRequest } from 'fastify'
import fjwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { AuthMiddleware } from './middlewares/auth.middleware'
import { swaggerConfig, swaggerUiConfig } from '../config/swagger'
import cors from '@fastify/cors'

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
		this.app.register(cors, {
			origin: ['https://keep-account-client.vercel.app', 'http://localhost:3000'],
			credentials: true,
		})

		this.app.register(fjwt, {
			secret: this.jwtSeed
		})

		this.app.addHook('preHandler', (request: FastifyRequest, reply, done) => {
			request.jwt = this.app.jwt
			return done()
		})
		
		this.app.register(fastifyCookie, {
			secret: 'secretToken',
			parseOptions: {
				httpOnly: true,
				secure: true,
				path: '/',
				sameSite: 'lax'
			}
		})

		this.app.decorate('authenticate', AuthMiddleware.validateJwt)
		this.app.register(fastifyFormbody) // x-www-form-urlencoded
		this.app.register(fastifySwagger, swaggerConfig)
		this.app.register(fastifySwaggerUi, swaggerUiConfig)
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
