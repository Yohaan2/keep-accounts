import { FastifyReply, FastifyRequest } from 'fastify'
import {
	ClientAmountDto,
	ClientCreateDto,
	ClientRepository,
	CustomError,
} from '../../domain'
import { CreateClientRequest, RecordDebtRequest, ReduceAccountRequest } from './client.types'

export class ClientController {
	constructor(private readonly clientRepository: ClientRepository) {}

	private handleError = (error: unknown, reply: FastifyReply) => {
		if (error instanceof CustomError) {
			reply.statusCode = error.statusCode
			return reply.send({ error: error.message })
		}

		console.log(error)
		reply.statusCode = 500
		return reply.send({ error: 'Internal Server Error' })
	}

	createClient = async (
		request: FastifyRequest<CreateClientRequest>,
		reply: FastifyReply
	) => {
		const [error, clientCreatDto] = ClientCreateDto.create(request.body)
		if (error) {
			reply.statusCode = 400
			return reply.send({ error })
		}

		try {
			const client = await this.clientRepository.create(clientCreatDto!)

			reply.statusCode = 201
			return reply.send(client)
		} catch (error) {
			console.log(error)
			return this.handleError(error, reply)
		}
	}

	recordDebt = async (
		request: FastifyRequest<RecordDebtRequest>,
		reply: FastifyReply
	) => {
		const [error, clientAmountDto] = ClientAmountDto.create(request.body)
		if (error) {
			reply.statusCode = 400
			return reply.send({ error })
		}

		const { id } = request.params

		try {
			const client = await this.clientRepository.recordDebt(
				clientAmountDto!,
				id,
			)

			reply.statusCode = 201
			return reply.send(client)
		} catch (error) {
			return this.handleError(error, reply)
		}
	}

	getDebtsById = async (
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply
	) => {
		try {
			const client = await this.clientRepository.getDebtsById(request.params.id)
			reply.statusCode = 200
			return reply.send(client)
		} catch (error) {
			return this.handleError(error, reply)
		}
	}

	getClients = async (
		request: FastifyRequest,
		reply: FastifyReply
	) => {
		try {
			const clients = await this.clientRepository.getClients()
			reply.statusCode = 200
			return reply.send(clients)
		} catch (error) {
			return this.handleError(error, reply)
		}
	}

	deleteClient = async (
		request: FastifyRequest<{ Params: { id: string }}>, 
		reply: FastifyReply
	) => {
		const { id } = request.params
		try {
			const response = await this.clientRepository.deleteClient(id)
			reply.statusCode = 200
			return reply.send({message: response})
		} catch (error) {
			return this.handleError(error, reply)
		}
	}

	reduceAccount = async (
		request: FastifyRequest<ReduceAccountRequest>, 
		reply: FastifyReply
	) => {
		const { id } = request.params
		const [error, clientAmountDto] = ClientAmountDto.create(request.body)

		if (error) {
			reply.statusCode = 400
			return reply.send({ error })
		}
		
		try {
			const client = await this.clientRepository.reduceAccount(id, clientAmountDto!.amount)
			reply.statusCode = 200
			return reply.send(client)
			
		} catch (error) {
			return this.handleError(error, reply)
		}
	}
}
