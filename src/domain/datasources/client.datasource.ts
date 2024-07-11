import { ClientCreateDto } from '..'
import { ClientUserEntity } from '..'

export abstract class ClientDatasource {
	abstract create(clientDto: ClientCreateDto): Promise<ClientUserEntity>
}
