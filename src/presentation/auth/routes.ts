import { AuthController } from './auth.controller'
import { AuthDatasourceImpl, AuthRepositoryImpl } from '../../infrastructure'
import { AuthMiddleware } from '../middlewares/auth.middleware'
import { FastifyInstance } from 'fastify'

export class AuthRoutes {
	static get routes() {
		return async (fastify: FastifyInstance) => {
			const datasource = new AuthDatasourceImpl()
			const authRepository = new AuthRepositoryImpl(datasource)
			const controller = new AuthController(authRepository)

			fastify.post('/login', controller.login)
			fastify.post('/register', controller.register)
			fastify.get(
				'/',
				{ preValidation: [AuthMiddleware.validateJwt] },
				controller.getUsers
			)
		}
	}
}
