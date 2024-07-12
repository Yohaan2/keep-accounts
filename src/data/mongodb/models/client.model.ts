import mongoose, { Schema } from 'mongoose'

const debtSchema = new Schema({
	amount: {
		type: Number,
	},
	description: {
		type: String,
	},
	createdAt: {
		type: Date,
	},
})

const clientSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Name us required'],
	},
	debt: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Debt',
		},
	],
	createdAt: {
		type: Date,
	},
})

clientSchema.plugin(require('mongoose-autopopulate'))
export const Client = mongoose.model('Client', clientSchema)
export const Debt = mongoose.model('Debt', debtSchema)
