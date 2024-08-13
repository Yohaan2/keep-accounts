export interface UserToken {
	token: string
	refreshToken: string
	user: {
		id: string
		name: string
		email: string
		roles: string[]
	}
}

export type SignToken = (payload: Object, duration?: string) => Promise<string | null>
