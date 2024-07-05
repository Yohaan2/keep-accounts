import { FastifyInstance } from 'fastify'
import { AuthController } from './auth.controller'
import { AuthDatasourceImpl, AuthRepositoryImpl } from '../../infrastructure'

export class AuthRoutes {
	static get routes() {
		const datasource = new AuthDatasourceImpl()
		const authRepository = new AuthRepositoryImpl(datasource)
		const controller = new AuthController(authRepository)

		return async (fastify: FastifyInstance) => {
			fastify.post('/login', controller.login)

			fastify.post('/register', controller.register)
		}
	}
}
