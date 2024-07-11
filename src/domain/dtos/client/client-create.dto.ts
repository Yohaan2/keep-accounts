export class ClientCreateDto {
	private constructor(public name: string) {}

	static create(payload: { [key: string]: any }): [string?, ClientCreateDto?] {
		const { name } = payload
		if (!name) return ['Missing name']
		return [undefined, new ClientCreateDto(name)]
	}
}
