export class ClientRecordAmountEntity {
	constructor(
		public id: string,
		public amount: number,
		public description: string,
		public createdAt: Date
	) {}
}
