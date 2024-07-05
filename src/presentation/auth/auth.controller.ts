import { FastifyReply, FastifyRequest } from 'fastify'
import { AuthRepository, RegisterUserDto } from '../../domain'

export class AuthController {
	constructor(private readonly authRepository: AuthRepository) {}

	async login(request: FastifyRequest, reply: FastifyReply) {
		reply.send(request.body)
	}

	async register(
		request: FastifyRequest<{ Body: RegisterUserDto }>,
		reply: FastifyReply
	) {
		const [error, registerUserDto] = RegisterUserDto.create(request.body)
		if (error) {
			reply.statusCode = 400
			return reply.send({ error })
		}

		this.authRepository
			.register(registerUserDto!)
			.then((user) => reply.send({ message: 'Register successful', user }))
			.catch((error) => reply.send({ error: error.message }))
	}
}
