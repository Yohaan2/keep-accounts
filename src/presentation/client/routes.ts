import { FastifyInstance } from 'fastify'
import { ClientController } from './client.controller'
import { ClientDatasourceImpl, ClientRepositoryImpl } from '../../infrastructure'
import { AuthMiddleware } from '../middlewares/auth.middleware'

export class ClientRoutes {
	static get routes() {
		return async (fastify: FastifyInstance) => {
			const dataSource = new ClientDatasourceImpl()
			const repository = new ClientRepositoryImpl(dataSource)
			const controller = new ClientController(repository)

			fastify.post(
				'/create',
				{ preValidation: [AuthMiddleware.validateJwt] },
				controller.createClient
			)
			fastify.put(
				'/:id/record-debt',
				{ preValidation: [AuthMiddleware.validateJwt] },
				controller.recordDebt
			)
		}
	}
}
