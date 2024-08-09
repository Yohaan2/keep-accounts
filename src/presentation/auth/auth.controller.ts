import { FastifyReply, FastifyRequest } from 'fastify'
import {
	AuthRepository,
	CustomError,
	RegisterUser,
	RegisterUserDto,
	LoginUserDto,
	LoginUser,
	RefreshTokenDto,
} from '../../domain'
import { User } from '../../data/mongodb'
import { LoginUserRequest, RegisterUserRequest } from './auth.types'
import { JwtAdapter } from '../../config'

export class AuthController {
	constructor(private readonly authRepository: AuthRepository, 
		private readonly jwt: JwtAdapter
	) {}

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
		request: FastifyRequest<RegisterUserRequest>,
		reply: FastifyReply
	) => {
		const [error, registerUserDto] = RegisterUserDto.create(request.body)
		if (error) {
			reply.statusCode = 400
			return reply.send({ error })
		}

		try {
			const user = await new RegisterUser(this.authRepository, this.jwt).execute(registerUserDto!)

			reply.setCookie('refresh_token', user.refreshToken, {
				httpOnly: true,
				secure: true,
				path:'/',
				maxAge: 1000 * 60 * 60 * 24 * 365
			})

			reply.statusCode = 201
			return reply.send({ access_token:  user.token, user: user.user })
		} catch (error) {
			return this.handleError(error, reply)
		}
	}

	login = async (
		request: FastifyRequest<LoginUserRequest>,
		reply: FastifyReply
	) => {
		const [error, loginUserDto] = LoginUserDto.create(request.body)
		if (error) {
			reply.statusCode = 400
			return reply.send({ error })
		}

		try {
			const user = await new LoginUser(this.authRepository, this.jwt).execute(loginUserDto!)

			reply.setCookie('refresh_token', user.refreshToken, {
				httpOnly: true,
				secure: true,
				path:'/',
				maxAge: 1000 * 60 * 60 * 24 * 365
			})
			reply.statusCode = 201
			return reply.send({ access_token:  user.token, user: user.user })
		} catch (error) {
			return this.handleError(error, reply)
		}
	}

	logout = (_request: FastifyRequest, reply: FastifyReply) => {
		return reply.clearCookie('refresh_token').send({ message: 'Logged out successfully' })
	}

	refreshToken = async (request: FastifyRequest, reply: FastifyReply) => {
		const refreshToken = request.cookies
		const [error, refreshTokenDto] = RefreshTokenDto.create(refreshToken)
		if (error) {
			reply.statusCode = 401
			return reply.send({ error })
		}
		
		try {
			const accessToken = await this.authRepository.refreshToken(refreshTokenDto!)
	
			reply.statusCode = 200
			return reply.send({ access_token: accessToken })
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
