import { FastifyReply, FastifyRequest } from 'fastify'
import { isJwtError } from '../../domain'


export class AuthMiddleware {
	static async validateJwt(
		request: FastifyRequest,
		reply: FastifyReply,
	) {

		try {
			const token = request.cookies.access_token

			if (!token) {
				reply.statusCode = 401
				return reply.send({ error: 'Unauthorized' })
			}
			//aqui esta el email del user
			const verifyToken = request.jwt.verify<{email: string}>(token)

			request.user = verifyToken

		} catch (error) {
			if(isJwtError(error)){
				reply.statusCode = 401
				return reply.send({ error: error.message })
			}
			console.log(error)
			reply.statusCode = 500
			reply.send({ error: 'Internal Server Error5' })
		}
	}
}
