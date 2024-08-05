import { IDebt } from '..'

export class ClientUserEntity {
	constructor(
		public id: string,
		public name: string,
		public createdAt: Date,
		public total: number,
		public debt?: IDebt[],
		public totalDolar?: string,
	) {}
}
