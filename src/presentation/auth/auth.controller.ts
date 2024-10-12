import { FastifyReply, FastifyRequest } from 'fastify'
import {
	AuthRepository,
	CustomError,
	RegisterUser,
	RegisterUserDto,
	LoginUserDto,
	LoginUser,
	RefreshTokenDto,
	isJwtError,
	JwtError,
} from '../../domain/index'
import { LoginUserRequest, RegisterUserRequest } from './auth.types'
import { JwtAdapter } from '../../config'

export class AuthController {
	constructor(
		private readonly authRepository: AuthRepository, 
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

			// reply
			// 	.setCookie('refresh_token', user.refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 365 })
			// 	.setCookie('access_token', user.token, { maxAge: 1000 * 60 * 60 * 24 * 2 })

			reply.statusCode = 201
			return reply.send({ 
				access_token: user.token, 
				refresh_token: user.refreshToken,
				user: user.user 
			})
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

			// reply
			// .setCookie('refresh_token', user.refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 10 })
			// .setCookie('access_token', user.token, { maxAge: 1000 * 60 * 60 * 24 * 2 })

			reply.statusCode = 201
			return reply.send({ 
				access_token:  user.token, 
				refresh_token: user.refreshToken,
				user: user.user 
			})
		} catch (error) {
			return this.handleError(error, reply)
		}
	}

	logout = (_request: FastifyRequest, reply: FastifyReply) => {
		reply.clearCookie('refresh_token')
		return reply.send({ message: 'Logged out successfully' })
	}

	refreshToken = async (request: FastifyRequest, reply: FastifyReply) => {
		const { headers } = request
		const refreshToken = headers.authorization?.split(' ')[1]
		const [error, refreshTokenDto] = RefreshTokenDto.create({refresh_token: refreshToken})
		if (error) {
			reply.statusCode = 401
			return reply.send({ error })
		}
		
		try {
			const {accessToken, refreshToken} = await this.authRepository.refreshToken(refreshTokenDto!)
	
			reply
			.setCookie('access_token', accessToken, { maxAge: 1000 * 60 * 60 * 24 * 2 })
			.setCookie('refresh_token', refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 10 })
			
			reply.statusCode = 200
			return reply.send({ access_token: accessToken })
		} catch (error) {
			return this.handleError(error, reply)
		}
	}

	verifyToken = async (request: FastifyRequest, reply: FastifyReply) => {
		const { headers } = request
		const token = headers.authorization?.split(' ')[1]

		try {
			if(!token) {
				reply.statusCode = 401
				return reply.send({ error: 'Unauthorized' })
			}
				await this.jwt.verifyToken(token)
				reply.statusCode = 200
				return reply.send({ message: 'Token is valid' })

			} catch (error) {
			if(isJwtError(error)){
				reply.statusCode = 401
				throw JwtError.InvalidToken(error.code, error.message)
			}
			console.log(error)
			throw CustomError.InternalServer()
		}
		
	}

	getUser = async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const {password, ...user} = await this.authRepository.getUser(request.user as { email: string })
			reply.statusCode = 200
			return reply.send(user)
		} catch (error) {
			return this.handleError(error, reply)
		}
	}
}
