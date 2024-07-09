import { JwtAdapter } from '../../../config'
import { LoginUserDto } from '../../dtos/auth/login-user.dto'
import { CustomError } from '../../errors/custom.error'
import { AuthRepository } from '../../repositories/auth.repository'
import { SignToken, UserToken } from '../../types/auth.types'

interface LoginUserUseCase {
	execute(loginUserDto: LoginUserDto): Promise<UserToken>
}

export class LoginUser implements LoginUserUseCase {
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly signToken: SignToken = JwtAdapter.generateToken
	) {}
	async execute(loginUserDto: LoginUserDto): Promise<UserToken> {
		const user = await this.authRepository.login(loginUserDto)

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
