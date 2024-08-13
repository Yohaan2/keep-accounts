import { IDebt } from '..'

export class ClientUserEntity {
	constructor(
		public id: string,
		public name: string,
		public createdAt: Date,
		public total: number,
		public totalDolar?: string,
		public debt?: IDebt[],
	) {}
}
