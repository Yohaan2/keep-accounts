import { AuthController } from './auth.controller'
import { AuthDatasourceImpl, AuthRepositoryImpl } from '../../infrastructure'
// import { AuthMiddleware } from '../middlewares/auth.middleware'
import { FastifyInstance } from 'fastify'
import { JwtAdapter } from '../../config'

export class AuthRoutes {
	static get routes() {
		return async (fastify: FastifyInstance) => {
			const jwtAdapter =  new JwtAdapter(fastify)
			const datasource = new AuthDatasourceImpl(jwtAdapter)
			const authRepository = new AuthRepositoryImpl(datasource)
			const controller = new AuthController(authRepository, jwtAdapter)

			fastify.post('/login', controller.login)
			fastify.post('/register', controller.register)
			fastify.get('/logout', controller.logout)
			fastify.get(
				'/',
				controller.getUsers
			)
		}
	}
}
