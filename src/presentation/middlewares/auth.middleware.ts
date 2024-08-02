import { FastifyReply, FastifyRequest } from 'fastify'
import { isJwtError } from '../../domain'


export class AuthMiddleware {
	static async validateJwt(
		request: FastifyRequest,
		reply: FastifyReply,
	) {

		try {

			await request.jwtVerify()

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
