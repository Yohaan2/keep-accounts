import { FastifyInstance } from 'fastify'
import { AuthController } from './auth.controller'
import { AuthDatasourceImpl, AuthRepositoryImpl } from '../../infrastructure'
import { AuthMiddleware } from '../middlewares/auth.middleware'

type FastifyInstanceFunction = (fastify: FastifyInstance) => void

export class AuthRoutes {
	static get routes(): FastifyInstanceFunction {
		return async (fastify: FastifyInstance) => {
			const datasource = new AuthDatasourceImpl()
			const authRepository = new AuthRepositoryImpl(datasource)
			const controller = new AuthController(authRepository)
			fastify.post('/login', controller.login)

			fastify.post('/register', controller.register)

			fastify.get(
				'/users',
				{ preValidation: [AuthMiddleware.validateJwt] },
				controller.getUser
			)
		}
	}
}
