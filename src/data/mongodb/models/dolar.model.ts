import mongoose, { Schema } from "mongoose"

const DolarSchema = new Schema({
  value: {
    type: Number,
    default: 37
  }
})

export const Dolar = mongoose.model('Dolar', DolarSchema) 