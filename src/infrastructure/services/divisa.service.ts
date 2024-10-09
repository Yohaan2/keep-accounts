export interface IDivisaService {
  getDollarPrice(): Promise<number>
  convertBsToDolar(amount: number): string
}

export class DivisaService implements IDivisaService {
  constructor() {}

  async getDollarPrice(): Promise<number> {

    const dolar = await fetch('https://pydolarvenezuela-api.vercel.app/api/v1/dollar/unit/bcv')
    const data = await dolar.json()
    console.log(data.price)
    return data.price
  }

  convertBsToDolar(amount: number): string{
    return (amount / 37).toFixed(2) + '$'
  }
}