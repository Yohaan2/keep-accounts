import { FastifyInstance } from 'fastify'
import { ClientController } from './client.controller'
import { ClientDatasourceImpl, ClientRepositoryImpl } from '../../infrastructure'

export class ClientRoutes {
	static get routes() {
		return async (fastify: FastifyInstance) => {
			const dataSource = new ClientDatasourceImpl()
			const repository = new ClientRepositoryImpl(dataSource)
			const controller = new ClientController(repository)

			fastify.post('/create', controller.createClient)
			fastify.post('/:id/debt', controller.recordDebt)
		}
	}
}
