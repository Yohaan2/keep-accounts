import { Client } from '../../data/mongodb'
import {
	ClientAmountDto,
	ClientCreateDto,
	ClientDatasource,
	ClientUserEntity,
	CustomError,
	IDebt,
} from '../../domain'
import { DivisaService } from '../services/divisa.service'

export class ClientDatasourceImpl implements ClientDatasource {
	constructor(
		private readonly divisaService: DivisaService = new DivisaService()
	) {}

	async create(clientCreateDto: ClientCreateDto): Promise<ClientUserEntity> {
		const { name } = clientCreateDto

		try {
			const createdAt = new Date()
			const client = await Client.create({ name, debt: [], total: 0, createdAt })
			await client.save()

			return new ClientUserEntity(client.id, client.name, client.createdAt as Date, 0)
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
			client.total = (client.total ?? 0) + amount

			client.debt.push({ amount, description, createdAt })
			const clientUpdated = await client.save()

			return new ClientUserEntity(
				clientUpdated.id,
				clientUpdated.name,
				clientUpdated.createdAt as Date,
				clientUpdated.total,
				clientUpdated.debt as IDebt[]
			)
		} catch (error) {
			if (error instanceof CustomError) {
				throw error
			}
			throw CustomError.InternalServer()
		}
	}

	async getDebts(id: string): Promise<ClientUserEntity> {
		try {
			const client = await Client.findById(id)

			if (!client) throw CustomError.NotFound('Client not found')
				const totaDolar = await this.divisaService.convertBsToDolar(client.total)

			return new ClientUserEntity(
				client.id,
				client.name,
				client.createdAt as Date,
				client.total,
				client.debt as IDebt[],
				totaDolar
			)
		} catch (error) {
			if (error instanceof CustomError) {
				throw error
			}
			throw CustomError.InternalServer()
		}
	}
}
