import { AuthController } from './auth.controller'
import { AuthDatasourceImpl, AuthRepositoryImpl } from '../../infrastructure'
import { FastifyInstance } from 'fastify'
import { JwtAdapter } from '../../config'
import { loginUserSchema, logoutUserSchema, refreshTokenSchema, registerUserSchema } from './auth.docs'

export class AuthRoutes {
	static get routes() {
		return async (fastify: FastifyInstance) => {
			const jwtAdapter =  new JwtAdapter(fastify)
			const datasource = new AuthDatasourceImpl(jwtAdapter)
			const authRepository = new AuthRepositoryImpl(datasource)
			const controller = new AuthController(authRepository, jwtAdapter)

			fastify.post('/login', { schema: loginUserSchema }, controller.login)
			fastify.post('/register',{ schema: registerUserSchema}, controller.register)
			fastify.get('/logout', { schema: logoutUserSchema } , controller.logout)
			fastify.get('/refresh-token', { schema:  refreshTokenSchema }, controller.refreshToken)
			fastify.get('/verify-token', controller.verifyToken)
		}
	}
}
