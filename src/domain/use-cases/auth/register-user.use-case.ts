import { JwtAdapter } from '../../../config'
import { RegisterUserDto } from '../../index'
import { CustomError } from '../../errors/custom.error'
import { AuthRepository } from '../../repositories/auth.repository'
import { SignToken, UserToken } from '../../types/auth.types'

interface RegisterUserUseCase {
	execute(registerUserDto: RegisterUserDto): Promise<UserToken>
}

export class RegisterUser implements RegisterUserUseCase {
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly signToken: SignToken = JwtAdapter.generateToken
	) {}

	async execute(registerUserDto: RegisterUserDto): Promise<UserToken> {
		const user = await this.authRepository.register(registerUserDto)

		const token = await this.signToken({ email: user.email }, '2h')
		if (!token) throw CustomError.InternalServer('Error generating token')

		return {
			token: token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
			},
		}
	}
}
