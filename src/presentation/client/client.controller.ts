import { FastifyReply, FastifyRequest } from 'fastify'
import { ClientCreateDto, ClientRepository, CustomError } from '../../domain'

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
		request: FastifyRequest<{ Body: ClientCreateDto }>,
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

	recordDebt = async (request: FastifyRequest, reply: FastifyReply) => {
		return reply.send({ message: "I'm debt" })
	}
}
