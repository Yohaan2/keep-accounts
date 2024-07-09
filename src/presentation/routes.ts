import { AuthRoutes } from './auth/routes'
import { FastifyInstance } from 'fastify'

export class AppRoutes {
	static get routes() {
		return async (fastify: FastifyInstance) => {
			fastify.register(AuthRoutes.routes, { prefix: '/api/auth' })
		}
	}
}
