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

const discountSchema = new Schema({
	amount: {
		type: Number,
	}, 
	createdAt: {
		type: Date
	}
})

const clientSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Name us required'],
	},
	debt: {
		type : [debtSchema],
		default: [],
	},
	total: {
		type: Number,
		default: 0,
	},
	createdAt: {
		type: Date,
	},
	discounts: {
		type: [discountSchema]
	}
})

export const Client = mongoose.model('Client', clientSchema)
