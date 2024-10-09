import { ClientAmountDto, ClientCreateDto } from "../../domain";

export interface CreateClientRequest {
  Body: ClientCreateDto
}

export interface RecordDebtRequest {
	Body: ClientAmountDto
  Params: { id: string }
}

export interface ReduceAccountRequest {
  Body: ClientAmountDto
  Params: { id: string }
}