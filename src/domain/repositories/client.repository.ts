import { ClientAmountDto, ClientCreateDto, ClientDebtsEntity } from '..'
import { ClientUserEntity } from '..'

export abstract class ClientRepository {
	abstract create(clientDto: ClientCreateDto): Promise<ClientUserEntity>
	abstract recordDebt(
		clientAmountDto: ClientAmountDto,
		id: string
	): Promise<ClientUserEntity>
	abstract getDebts(id: string): Promise<ClientDebtsEntity>
}
