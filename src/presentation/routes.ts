import { FastifyInstance } from 'fastify'
import { AuthRoutes } from './auth/routes'

export class AppRoutes {
	static get routes() {
		return async (fastify: FastifyInstance) => {
			fastify.register(AuthRoutes.routes, { prefix: '/api/auth' })
		}
	}
}
