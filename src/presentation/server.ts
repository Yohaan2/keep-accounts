import fastifyFormbody from '@fastify/formbody'
import fastify, { FastifyInstance, FastifyRequest } from 'fastify'
import fjwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
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
		const { port = 3100, routes, jwtSeed } = options

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
		this.routes(this.app)

		this.app.listen({ port: this.port }, (err, address) => {
			if (err) {
				console.error(err)
				process.exit(1)
			}
			console.log(`Server listening on ${address}`)
		})
	}
}
