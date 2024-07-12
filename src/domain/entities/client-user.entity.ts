import { Types } from 'mongoose'
import { ClientRecordAmountEntity } from '..'

export class ClientUserEntity {
	constructor(
		public id: string,
		public name: string,
		public createdAt: Date,
		public debt?: ClientRecordAmountEntity
	) {}
}
