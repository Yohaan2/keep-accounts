import { Client, Debt } from '../../data/mongodb'
import {
	ClientAmountDto,
	ClientCreateDto,
	ClientDatasource,
	ClientDebtsEntity,
	ClientRecordAmountEntity,
	ClientUserEntity,
	CustomError,
} from '../../domain'

export class ClientDatasourceImpl implements ClientDatasource {
	constructor() {}

	async create(clientCreateDto: ClientCreateDto): Promise<ClientUserEntity> {
		const { name } = clientCreateDto

		try {
			const createdAt = new Date()
			const client = await Client.create({ name, createdAt })
			await client.save()
			console.log(client.createdAt)

			return new ClientUserEntity(client.id, name, createdAt)
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
			const createdAt = new Date()
			const client = await Client.findById(id)

			if (!client) throw CustomError.NotFound('Client not found')

			const debt = await Debt.create({ amount, description, createdAt })

			const clientUpdated = await Client.findOneAndUpdate(
				{
					_id: client.id,
				},
				{ $addToSet: { debt: debt._id } },
				{ new: true }
			).populate('debt')

			if (!clientUpdated) throw CustomError.BadRequest('Client not found')

			const newDebt = new ClientRecordAmountEntity(
				debt.id,
				amount,
				description,
				createdAt
			)

			return new ClientUserEntity(
				client.id,
				client.name,
				client.createdAt as Date,
				newDebt
			)
		} catch (error) {
			if (error instanceof CustomError) {
				throw error
			}
			throw CustomError.InternalServer()
		}
	}

	async getDebts(id: string): Promise<ClientDebtsEntity> {
		try {
			const client = await Client.findById(id).populate('debt')

			if (!client) throw CustomError.NotFound('Client not found')

			return new ClientDebtsEntity(client.id, client.name, client.debt)
		} catch (error) {
			if (error instanceof CustomError) {
				throw error
			}
			throw CustomError.InternalServer()
		}
	}
}
