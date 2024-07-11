export class ClientAmountDto {
	private constructor(public amount: number, public description: string = '') {}

	static create(payload: { [key: string]: any }): [string?, ClientAmountDto?] {
		const { amount, description } = payload
		if (!amount) return ['Missing amount']
		if (amount < 0) return ['Amount must be greater than 0']
		return [undefined, new ClientAmountDto(amount, description)]
	}
}
