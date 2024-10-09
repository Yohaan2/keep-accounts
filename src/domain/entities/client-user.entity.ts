import { IDebt } from '..'

export class ClientUserEntity {
	constructor(
		public id: string,
		public name: string,
		public createdAt: Date,
		public total: number = 0,
		public totalDolar: string = '0.00$',
		public debt: IDebt[] = [],
	) {}
}
