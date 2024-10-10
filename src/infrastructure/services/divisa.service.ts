import { Dolar } from "../../data/mongodb"

export interface IDivisaService {
  setDollarPrice(amount: number): Promise<number>
  getDollarPrice(): Promise<number>
  convertBsToDolar(amount: number): Promise<string>
}

export class DivisaService implements IDivisaService {
  constructor() {}
  async setDollarPrice(amount: number): Promise<number> {
    const findDollar = await Dolar.findOne()

    if (!findDollar) {
      const newDollar = await Dolar.create({ value: amount })
      return newDollar.value as number
    }

    await Dolar.updateOne({ value: amount })
    return amount
  }

  async getDollarPrice(): Promise<number> {

    const dolar = await Dolar.findOne()
    if (!dolar) return 0
    return dolar.value as number
  }

  async convertBsToDolar(amount: number): Promise<string> {
    const dollar = await Dolar.findOne()
    if (!dollar) return 'Dollar not found'

    return (amount / dollar?.value as number).toFixed(2) + '$'
  }
}