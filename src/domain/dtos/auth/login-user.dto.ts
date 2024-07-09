import { Validators } from '../../../config'

export class LoginUserDto {
	private constructor(public email: string, public password: string) {}

	static create(payload: { [key: string]: any }): [string?, LoginUserDto?] {
		const { email, password } = payload
		if (!email) return ['Missing email']
		if (!Validators.email.test(email)) return ['Invalid email']
		if (!password) return ['Missing password']
		if (password.length < 6) return ['Password too short']

		return [undefined, new LoginUserDto(email, password)]
	}
}
