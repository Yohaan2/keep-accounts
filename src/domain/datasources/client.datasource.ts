import { ClientCreateDto, ClientAmountDto, ClientDebtsEntity } from '..'
import { ClientUserEntity } from '..'

export abstract class ClientDatasource {
	abstract create(clientDto: ClientCreateDto): Promise<ClientUserEntity>
	abstract recordDebt(
		clientAmountDto: ClientAmountDto,
		id: string
	): Promise<ClientUserEntity>
}
