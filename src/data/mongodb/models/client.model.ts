import mongoose, { Schema } from 'mongoose'

const debtSchema = new Schema({
	amount: {
		type: Number,
	},
	description: {
		type: String,
	},
})

const clientSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Name us required'],
	},
	debt: [debtSchema],
})

export const Client = mongoose.model('Client', clientSchema)
