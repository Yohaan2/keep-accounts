export class DollarAmountDto {
  private constructor(public amount: number) {}

  static create(payload: { [key: string]: any }): [string?, DollarAmountDto?] {
    const { amount } = payload
    if (!amount) return ['Missing amount']
    return [undefined, new DollarAmountDto(amount)]
  }
}