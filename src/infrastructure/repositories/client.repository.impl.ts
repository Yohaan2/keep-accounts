import {
	ClientAmountDto,
	ClientCreateDto,
	ClientDatasource,
	ClientDebtsEntity,
	ClientRepository,
	ClientUserEntity,
} from '../../domain'

export class ClientRepositoryImpl implements ClientRepository {
	constructor(private readonly clientDatasource: ClientDatasource) {}

	create(clientCreateDto: ClientCreateDto): Promise<ClientUserEntity> {
		return this.clientDatasource.create(clientCreateDto)
	}

	recordDebt(clientAmountDto: ClientAmountDto, id: string): Promise<ClientUserEntity> {
		return this.clientDatasource.recordDebt(clientAmountDto, id)
	}

	getDebtsById(id: string): Promise<ClientUserEntity> {
		return this.clientDatasource.getDebtsById(id)
	}

	getClients(): Promise<ClientUserEntity[]> {
		return this.clientDatasource.getClients()
	}

	deleteClient(id: string): Promise<string> {
		return this.clientDatasource.deleteClient(id)
	}

	reduceAccount(id: string, amount: number): Promise<ClientUserEntity> {
		return this.clientDatasource.reduceAccount(id, amount)
	}
}
