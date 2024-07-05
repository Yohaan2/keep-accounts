import Fastify, { FastifyInstance } from 'fastify'
import formbody from '@fastify/formbody'

interface Options {
	port?: number
	routes: (fastify: FastifyInstance) => void
}

export class Server {
	public readonly app: FastifyInstance
	private readonly port: number
	private readonly routes: (fastify: FastifyInstance) => void

	constructor(options: Options) {
		const { port = 3100, routes } = options

		this.app = Fastify()
		this.port = port
		this.routes = routes
	}

	async start() {
		this.app.register(formbody) // x-www-form-urlencoded
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
