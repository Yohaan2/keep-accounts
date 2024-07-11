import { Client } from '../../data/mongodb'
import {
	ClientAmountDto,
	ClientCreateDto,
	ClientDatasource,
	ClientUserEntity,
	CustomError,
	Debt,
} from '../../domain'

export class ClientDatasourceImpl implements ClientDatasource {
	constructor() {}

	async create(clientCreateDto: ClientCreateDto): Promise<ClientUserEntity> {
		const { name } = clientCreateDto

		try {
			const client = await Client.create({ name })
			await client.save()

			return new ClientUserEntity(client.id, name)
		} catch (error) {
			if (error instanceof CustomError) {
				throw error
			}
			throw CustomError.InternalServer()
		}
	}

	async recordDebt(
		clientAmountDto: ClientAmountDto,
		id: string
	): Promise<ClientUserEntity> {
		const { amount, description } = clientAmountDto
		try {
			const client = await Client.findById(id)

			if (!client) throw CustomError.NotFound('Client not found')

			const debt = await Client.findOneAndUpdate(
				{
					_id: client.id,
				},
				{ $push: { debt: { amount, description } } },
				{ new: true }
			)
			if (!debt) throw CustomError.BadRequest('Debt not found')

			const newDebt = debt.toObject().debt as Debt[]
			console.log(newDebt)
			return new ClientUserEntity(client.id, client.name, newDebt)
		} catch (error) {
			if (error instanceof CustomError) {
				throw error
			}
			throw CustomError.InternalServer()
		}
	}
}
