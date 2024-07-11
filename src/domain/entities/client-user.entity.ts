interface Debt {
	amount: number
	description: string
}

export class ClientUserEntity {
	constructor(public id: string, public name: string, public debt?: Debt[]) {}
}
