import { Types } from 'mongoose'

export class ClientDebtsEntity {
	constructor(public id: string, public name: string, public debt: Types.ObjectId[]) {}
}
