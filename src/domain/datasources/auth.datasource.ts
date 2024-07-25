import { LoginUserDto, RefreshTokenDto, RegisterUserDto } from '..'
import { UserEntity } from '..'

export abstract class AuthDatasource {
	abstract register(registerUserDto: RegisterUserDto): Promise<UserEntity>
	abstract login(loginUserDto: LoginUserDto): Promise<UserEntity>
	abstract refreshToken(refresTokenDto: RefreshTokenDto): Promise<String>
}
