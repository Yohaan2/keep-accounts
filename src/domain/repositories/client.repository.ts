import { ClientCreateDto } from '..'
import { ClientUserEntity } from '..'

export abstract class ClientRepository {
	abstract create(clientDto: ClientCreateDto): Promise<ClientUserEntity>
}
