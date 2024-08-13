import { JwtAdapter } from '../../../config/index.ts'
import { RegisterUserDto } from '../../index.ts'
import { CustomError } from '../../errors/custom.error.ts'
import { AuthRepository } from '../../repositories/auth.repository.ts'
import { UserToken } from '../../types/auth.types.ts'

interface RegisterUserUseCase {
	execute(registerUserDto: RegisterUserDto): Promise<UserToken>
}

export class RegisterUser implements RegisterUserUseCase {
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly jwt: JwtAdapter
	) {}

	async execute(registerUserDto: RegisterUserDto): Promise<UserToken> {
		const user = await this.authRepository.register(registerUserDto)

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
