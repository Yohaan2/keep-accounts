import { FastifyReply, FastifyRequest } from 'fastify'
import {
	AuthRepository,
	CustomError,
	RegisterUser,
	RegisterUserDto,
	LoginUserDto,
	LoginUser,
} from '../../domain'
import { JwtAdapter } from '../../config'
import { User } from '../../data/mongodb'

export class AuthController {
	constructor(private readonly authRepository: AuthRepository) {}

	private handleError(error: unknown, reply: FastifyReply) {
		if (error instanceof CustomError) {
			reply.statusCode = error.statusCode
			return reply.send({ error: error.message })
		}
		reply.statusCode = 500
		return reply.send({ error: 'Internal server error' })
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

		try {
			const user = await new RegisterUser(
				this.authRepository,
				JwtAdapter.generateToken
			).execute(registerUserDto!)

			reply.statusCode = 201
			return reply.send(user)
		} catch (error) {
			console.log(error)
			reply.statusCode = 500
			return reply.send({ error: 'Internal server error por aqui' })
		}
	}

	async login(request: FastifyRequest<{ Body: LoginUserDto }>, reply: FastifyReply) {
		const [error, loginUserDto] = LoginUserDto.create(request.body)
		if (error) {
			reply.statusCode = 400
			return reply.send({ error })
		}
		new LoginUser(this.authRepository)
			.execute(loginUserDto!)
			.then((user) => reply.send(user))
			.catch((error) => {
				console.log(error)
				return reply.status(500).send({ error })
			})
	}

	async getUser(
		request: FastifyRequest<{ Body: { [key: string]: any } }>,
		reply: FastifyReply
	) {
		const users = await User.find()
		reply.statusCode = 200
		return reply.send({ user: request.body.user })
	}
}
