import { Client } from '../../data/mongodb'
import {
	ClientAmountDto,
	ClientCreateDto,
	ClientDatasource,
	ClientUserEntity,
	CustomError,
	IDebt,
	IDiscount,
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
			const client = await Client.create({ name, createdAt })
			await client.save()

			return new ClientUserEntity(
				client.id, 
				client.name, 
				client.createdAt as Date,
				client.total,
			)
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
			const totalDolar = await this.divisaService.convertBsToDolar(client.total)

			return new ClientUserEntity(
				clientUpdated.id,
				clientUpdated.name,
				clientUpdated.createdAt as Date,
				clientUpdated.total,
				totalDolar,
				clientUpdated.debt as IDebt[],
				clientUpdated.discounts as IDiscount[]
			)
		} catch (error) {
			if (error instanceof CustomError) {
				throw error
			}
			throw CustomError.InternalServer()
		}
	}

	async getDebtsById(id: string): Promise<ClientUserEntity> {
		try {
			const client = await Client.findById(id)

			if (!client) throw CustomError.NotFound('Client not found')
				const totalDolar = await this.divisaService.convertBsToDolar(client.total)

			return new ClientUserEntity(
				client.id,
				client.name,
				client.createdAt as Date,
				client.total,
				totalDolar,
				client.debt as IDebt[],
				client.discounts as IDiscount[],
			)
		} catch (error) {
			if (error instanceof CustomError) {
				throw error
			}
			throw CustomError.InternalServer()
		}
	}

	async getClients(): Promise<ClientUserEntity[]> {
		const clients = await Client.find()

		return await Promise.all(clients.map(async (client) => {
			const totalDolar = await this.divisaService.convertBsToDolar(client.total)
			return new ClientUserEntity(
				client.id,
				client.name,
				client.createdAt as Date,
				client.total,
				totalDolar,
				client.debt as IDebt[],
				client.discounts as IDiscount[],
			)
		}))
	}

	async deleteClient(id: string): Promise<string> {

		try {
			const user = await Client.findById(id)
			if (!user) throw CustomError.NotFound('Client not found')

			const response = await Client.deleteOne({ _id: user.id})
			return 'Client deleted successfully'
			
		} catch (error) {
			if (error instanceof CustomError) {
				throw error
			}
			throw CustomError.InternalServer()
		}
	}

	async reduceAccount(id: string, amount: number): Promise<ClientUserEntity> {
		const user = await Client.findById(id)
		if (!user) throw CustomError.NotFound('Client not found')
		if (amount > user.total) throw CustomError.BadRequest('Amount is greater than total')
		
		user.total = user.total - amount
		user.discounts.push({ amount, createdAt: new Date() })
		await user.save()
		const totalDolar = await this.divisaService.convertBsToDolar(user.total)

		return new ClientUserEntity(
			user.id,
			user.name,
			user.createdAt as Date,
			user.total,
			totalDolar,
			user.debt as IDebt[],
			user.discounts as IDiscount[]
		)
	}

	async resetAccount(id: string): Promise<ClientUserEntity> {
		const user = await Client.findById(id)
		if (!user) throw CustomError.NotFound('Client not found')
		
		await Client.updateOne(
			{ _id: user.id },
			{ $set: 
				{ 
					total: 0, 
					debt: [] , 
					discounts: []
				}
			})

		return new ClientUserEntity(
			user.id,
			user.name,
			user.createdAt as Date,
		)
	}
}
