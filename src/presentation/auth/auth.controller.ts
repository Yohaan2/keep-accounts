import { FastifyReply, FastifyRequest } from 'fastify'
import {
	AuthRepository,
	CustomError,
	RegisterUser,
	RegisterUserDto,
	LoginUserDto,
	LoginUser,
} from '../../domain'
import { User } from '../../data/mongodb'

export class AuthController {
	constructor(private readonly authRepository: AuthRepository) {}

	private handleError = (error: unknown, reply: FastifyReply) => {
		if (error instanceof CustomError) {
			reply.statusCode = error.statusCode
			return reply.send({ error: error.message })
		}

		console.log(error)
		reply.statusCode = 500
		return reply.send({ error: 'Internal Server Error' })
	}

	register = async (
		request: FastifyRequest<{ Body: RegisterUserDto }>,
		reply: FastifyReply
	) => {
		const [error, registerUserDto] = RegisterUserDto.create(request.body)
		if (error) {
			reply.statusCode = 400
			return reply.send({ error })
		}

		try {
			const user = await new RegisterUser(this.authRepository).execute(registerUserDto!)

			reply.statusCode = 201
			return reply.send(user)
		} catch (error) {
			return this.handleError(error, reply)
		}
	}

	login = async (
		request: FastifyRequest<{ Body: LoginUserDto }>,
		reply: FastifyReply
	) => {
		const [error, loginUserDto] = LoginUserDto.create(request.body)
		if (error) {
			reply.statusCode = 400
			return reply.send({ error })
		}

		try {
			const user = await new LoginUser(this.authRepository).execute(loginUserDto!)

			reply.statusCode = 201
			return reply.send(user)
		} catch (error) {
			return this.handleError(error, reply)
		}
	}

	getUsers = (
		request: FastifyRequest<{ Body: { [key: string]: any } }>,
		reply: FastifyReply
	) => {
		User.find()
			.then((users) => {
				reply.send({
					// users,
					user: request.body.user,
				})
			})
			.catch(() => reply.status(500).send({ error: 'Internal server error' }))
	}
}
