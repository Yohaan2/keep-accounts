import { hashSync, genSaltSync, compareSync } from 'bcrypt'

export class BcryptAdapter {
	static hash(password: string): string {
		const salt = genSaltSync(10)
		return hashSync(password, salt)
	}

	static compare(password: string, hash: string): boolean {
		return compareSync(password, hash)
	}
}
