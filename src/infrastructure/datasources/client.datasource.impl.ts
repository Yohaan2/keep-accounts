import { Client } from '../../data/mongodb'
import {
	ClientCreateDto,
	ClientDatasource,
	ClientUserEntity,
	CustomError,
} from '../../domain'

export class ClientDatasourceImpl implements ClientDatasource {
	constructor() {}

	create = async (clientCreateDto: ClientCreateDto): Promise<ClientUserEntity> => {
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
}
