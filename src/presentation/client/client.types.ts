import { RouteGenericInterface } from "fastify";
import { ClientAmountDto, ClientCreateDto } from "../../domain";

export interface CreateClientRequest {
  Body: ClientCreateDto
}

export interface RecordDebtRequest {
	Body: ClientAmountDto
  Params: { id: string }
}