import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify'
import { JwtAdapter } from '../../config'
import { User } from '../../data/mongodb'

export class AuthMiddleware {
	static async validateJwt(
		request: FastifyRequest<{ Body: { [key: string]: any } }>,
		reply: FastifyReply,
		done: HookHandlerDoneFunction
	) {
		const authorization = request.headers.authorization
		if (!authorization) return reply.status(401).send({ error: 'No Token provided' })
		if (!authorization.startsWith('Bearer '))
			return reply.status(401).send({ error: 'Invalid Bearer Token' })

		const token = authorization.split(' ').at(1) || ''

		try {
			if (!request.body) request.body = {}
			const payload = await JwtAdapter.validateToken<{ email: string }>(token)
			if (!payload) return reply.status(401).send({ error: 'Invalid Token' })

			const user = await User.findOne({ email: payload.email })
			if (!user) return reply.status(401).send({ error: 'Invalid Token' })

			request.body.user = user

			done()
		} catch (error) {
			console.log(error)
			reply.statusCode = 500
			return reply.send({ error: 'Internal Server Error' })
		}
	}
}
