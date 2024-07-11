import { Debt } from '../types/client.types'

export class ClientUserEntity {
	constructor(public id: string, public name: string, public debt?: Debt[]) {}
}
