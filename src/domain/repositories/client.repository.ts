import { ClientAmountDto, ClientCreateDto, ClientDebtsEntity } from '..'
import { ClientUserEntity } from '..'

export abstract class ClientRepository {
	abstract create(clientDto: ClientCreateDto): Promise<ClientUserEntity>
	abstract recordDebt(
		clientAmountDto: ClientAmountDto,
		id: string
	): Promise<ClientUserEntity>
	abstract getDebtsById(id: string): Promise<ClientUserEntity>
	abstract getClients(): Promise<ClientUserEntity[]>
	abstract deleteClient(id: string): Promise<string>
	abstract reduceAccount(id:string, amount: number): Promise<ClientUserEntity>
	abstract resetAccount(id:string): Promise<ClientUserEntity>
}
