import { FastifyInstance } from 'fastify'
import { ClientController } from './client.controller'
import { ClientDatasourceImpl, ClientRepositoryImpl } from '../../infrastructure'

export class ClientRoutes {
	static get routes() {
		return async (fastify: FastifyInstance) => {
			const dataSource = new ClientDatasourceImpl()
			const repository = new ClientRepositoryImpl(dataSource)
			const controller = new ClientController(repository)

			fastify.post(
				'/create',{
					preHandler: fastify.authenticate
				},
				controller.createClient
			)
			fastify.put(
				'/:id/record-debt',{
					preHandler: fastify.authenticate
				},
				controller.recordDebt
			)
			fastify.get('/:id/debts',{
				preHandler: fastify.authenticate
			} ,controller.getDebts)
		}
	}
}
