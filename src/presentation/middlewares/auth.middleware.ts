import { FastifyReply, FastifyRequest } from 'fastify'
export class AuthMiddleware {
	static async validateJwt(
		request: FastifyRequest,
		reply: FastifyReply,
	) {

		try {
			await request.jwtVerify()
		} catch (error) {
			if((error as Error).message.includes('The token signature is invalid')){
				reply.statusCode = 401
				return reply.send({ error: (error as Error).message })
			}
			console.log(error)
			reply.statusCode = 500
			reply.send({ error: 'Internal Server Error' })
		}
	}
}
