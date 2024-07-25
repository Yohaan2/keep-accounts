import { FastifyInstance } from 'fastify'
import { envs } from './envs'

export const JWT_REFRESS_SEED = envs.JWT_REFRESH_SEED
export const JWT_SEED = envs.JWT_SEED

export interface JwtAdapterInterface {
  generateToken(payload: { email: string }): Promise<string>
  generateRefreshtoken(payload: { email: string }): Promise<string>
  verifyToken(token: string): Promise<{ email: string }>
}

export class JwtAdapter implements JwtAdapterInterface {
	constructor(
		public readonly jwt: FastifyInstance,
	) {
	}
	async generateToken(
		payload: { email: string },
	): Promise<string> {
		return this.jwt.jwt.sign(payload, { expiresIn: Math.floor(Date.now() / 1000) + 60 * 60 * 5})
	}

	async generateRefreshtoken(payload: { email: string }): Promise<string> {
		return this.jwt.jwt.sign(payload, { expiresIn: Math.floor(Date.now() / 1000) + 60 * 60 + 5, key: JWT_REFRESS_SEED})
	}

	async verifyToken(token: string, seed?: string): Promise<{ email: string }> {
		return this.jwt.jwt.verify<{ email: string }>(token,{ key: seed || JWT_SEED })
	}
}
