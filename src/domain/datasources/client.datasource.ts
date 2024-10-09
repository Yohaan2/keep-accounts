import { ClientCreateDto, ClientAmountDto, ClientDebtsEntity } from '..'
import { ClientUserEntity } from '..'

export abstract class ClientDatasource {
	abstract create(clientDto: ClientCreateDto): Promise<ClientUserEntity>
	abstract recordDebt(
		clientAmountDto: ClientAmountDto,
		id: string
	): Promise<ClientUserEntity>
	abstract getDebtsById(id: string): Promise<ClientUserEntity>
	abstract getClients(): Promise<ClientUserEntity[]>
	abstract deleteClient(id: string): Promise<string>
	abstract reduceAccount(id:string, amount: number): Promise<ClientUserEntity>
}
