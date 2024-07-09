import fastifyFormbody from '@fastify/formbody'
import fastify, { FastifyInstance } from 'fastify'

interface Options {
	port?: number
	routes: FastifyInstanceFunction
}

type FastifyInstanceFunction = (fastify: FastifyInstance) => void

export class Server {
	public readonly app: FastifyInstance = fastify()
	private readonly port: number
	private readonly routes: FastifyInstanceFunction

	constructor(options: Options) {
		const { port = 3100, routes } = options

		this.port = port
		this.routes = routes
	}

	async start() {
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
