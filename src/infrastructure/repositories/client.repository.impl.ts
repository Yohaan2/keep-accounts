import {
	ClientAmountDto,
	ClientCreateDto,
	ClientDatasource,
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
}
