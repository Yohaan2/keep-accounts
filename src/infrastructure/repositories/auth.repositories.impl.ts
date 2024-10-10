import {
	AuthDatasource,
	AuthRepository,
	RegisterUserDto,
	UserEntity,
	LoginUserDto,
	RefreshTokenDto,
} from '../../domain'

export class AuthRepositoryImpl implements AuthRepository {
	constructor(private readonly authDatasource: AuthDatasource) {}

	register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
		return this.authDatasource.register(registerUserDto)
	}

	login(loginUserDto: LoginUserDto): Promise<UserEntity> {
		return this.authDatasource.login(loginUserDto)
	}

	refreshToken(refresTokenDto: RefreshTokenDto): Promise<{ accessToken: string, refreshToken: string }> {
		return this.authDatasource.refreshToken(refresTokenDto)
	}

	getUser(user: { email:string }): Promise<UserEntity> {
		return this.authDatasource.getUser(user)
	}
}
