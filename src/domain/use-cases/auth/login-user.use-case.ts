import { JwtAdapter } from '../../../config/index.ts'
import { LoginUserDto } from '../../dtos/auth/login-user.dto.ts'
import { CustomError } from '../../errors/custom.error.ts'
import { AuthRepository } from '../../repositories/auth.repository.ts'
import { UserToken } from '../../types/auth.types.ts'

interface LoginUserUseCase {
	execute(loginUserDto: LoginUserDto): Promise<UserToken>
}

export class LoginUser implements LoginUserUseCase {
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly jwt: JwtAdapter
	) {}
	async execute(loginUserDto: LoginUserDto): Promise<UserToken> {
		const user = await this.authRepository.login(loginUserDto)

		const token = await this.jwt.generateToken({ email: user.email })
		const refreshToken = await this.jwt.generateRefreshtoken({ email: user.email })
		if (!token) throw CustomError.InternalServer('Error generating token')

		return {
			token,
			refreshToken,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				roles: user.roles,
			},
		}
	}
}
