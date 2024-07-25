import { RegisterUserDto, LoginUserDto, RefreshTokenDto } from '..'
import { UserEntity } from '..'

export abstract class AuthRepository {
	abstract register(registerUserDto: RegisterUserDto): Promise<UserEntity>
	abstract login(loginUserDto: LoginUserDto): Promise<UserEntity>
	abstract refreshToken(refresTokenDto: RefreshTokenDto): Promise<String>
}
