import { FastifyReply, FastifyRequest } from 'fastify'
import {
	ClientAmountDto,
	ClientCreateDto,
	ClientRepository,
	CustomError,
} from '../../domain'
import { CreateClientRequest, RecordDebtRequest } from './client.types'

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
			console.log(request.user)
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

	getDebts = async (
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply
	) => {
		try {
			const client = await this.clientRepository.getDebts(request.params.id)
			reply.statusCode = 200
			return reply.send(client)
		} catch (error) {
			return this.handleError(error, reply)
		}
	}
}
