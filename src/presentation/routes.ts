import { AuthRoutes } from './auth/routes'
import { FastifyInstance } from 'fastify'
import { ClientRoutes } from './client/routes'

export class AppRoutes {
	static get routes() {
		return async (fastify: FastifyInstance) => {
			fastify.register(AuthRoutes.routes, { prefix: '/api/auth' })
			fastify.register(ClientRoutes.routes, { prefix: '/api/client' })
		}
	}
}
