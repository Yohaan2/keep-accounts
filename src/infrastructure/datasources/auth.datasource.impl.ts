import { BcryptAdapter, JwtAdapter } from '../../config'
import { User } from '../../data/mongodb'
import {
	AuthDatasource,
	CustomError,
	RegisterUserDto,
	UserEntity,
	LoginUserDto,
	RefreshTokenDto,
} from '../../domain'
import { UserMapper } from '../index'

type HashFunction = (password: string) => string
type CompareFunction = (password: string, hash: string) => boolean

export class AuthDatasourceImpl implements AuthDatasource {
	constructor(
		private readonly jwt: JwtAdapter,
		private readonly hashPassword: HashFunction = BcryptAdapter.hash,
		private readonly comparePassword: CompareFunction = BcryptAdapter.compare,
	) {}

	async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
		const { name, email, password } = registerUserDto

		try {
			const emailExists = await User.findOne({ email })
			if (emailExists) throw CustomError.BadRequest('Credentials invalid')

			const user = await User.create({
				name,
				email,
				password: this.hashPassword(password),
			})

			await user.save()

			return UserMapper.userEntityFromObject(user)
		} catch (error) {
			if (error instanceof CustomError) {
				throw error
			}
			throw CustomError.InternalServer()
		}
	}

	async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
		const { email, password } = loginUserDto
		try {
			const user = await User.findOne({ email })
			if (!user) throw CustomError.BadRequest('Invalid email or password')
			const isValidPassword = this.comparePassword(password, user.password)
			if (!isValidPassword) throw CustomError.BadRequest('Invalid email or password')

			return UserMapper.userEntityFromObject(user)
		} catch (error) {
			if (error instanceof CustomError) {
				throw error
			}
			throw CustomError.InternalServer()
		}
	}

	async refreshToken(refresTokenDto: RefreshTokenDto): Promise<String> {
		try {
			const validateToken = await this.jwt.verifyToken(refresTokenDto.refreshToken)
			const accessToken = await this.jwt.generateToken({ email: validateToken.email })

			return accessToken
		} catch (error) {
			if (error instanceof CustomError) {
				throw error
			}
			throw CustomError.InternalServer()
		}
	}
}
