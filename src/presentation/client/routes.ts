import { FastifyInstance } from 'fastify'
import { ClientController } from './client.controller'
import { ClientDatasourceImpl, ClientRepositoryImpl } from '../../infrastructure'
import { clientCreateSchema, clientGetDebtsSchema, clientRecordDebtSchema, clientReduceAccountSchema } from './client.docs'
import { DivisaService } from '../../infrastructure/services/divisa.service'

export class ClientRoutes {
	static get routes() {
		return async (fastify: FastifyInstance) => {
			const dataSource = new ClientDatasourceImpl()
			const repository = new ClientRepositoryImpl(dataSource)
			const dollar = new DivisaService()
			const controller = new ClientController(repository, dollar)

			fastify.post(
				'/create',{
					preHandler: fastify.authenticate, schema: clientCreateSchema
				},
				controller.createClient
			)
			fastify.put(
				'/:id/record-debt',{
					preHandler: fastify.authenticate, schema: clientRecordDebtSchema
				},
				controller.recordDebt
			)
			fastify.get('/:id/debts',{
				preHandler: fastify.authenticate, schema: clientGetDebtsSchema
			},
				controller.getDebtsById
			)
			fastify.get('/get-clients', {
				preHandler: fastify.authenticate
			}, 
				controller.getClients
			)
			fastify.delete('/:id', {
				preHandler: fastify.authenticate
			}, 
				controller.deleteClient
			)
			fastify.put('/reduce-account/:id',{
				preHandler: fastify.authenticate, schema: clientReduceAccountSchema
			}, 
				controller.reduceAccount
			)
			fastify.put('/reset-account/:id', {
				preHandler: fastify.authenticate
			},
				controller.resetAccount
			)
			fastify.post('/set-dollar-price', {
				preHandler: fastify.authenticate
			},
				controller.setDollarPrice
			)
		}
	}
}
