export interface UserToken {
	token: string
	user: {
		id: string
		name: string
		email: string
	}
}

export type SignToken = (payload: Object, duration?: string) => Promise<string | null>
