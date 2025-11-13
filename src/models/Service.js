import {Schema} from 'mongoose'


const serviceSchema = new Schema({
    usuarioId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 5
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minLength: 10
    },
    deliveryTime: { // se toma los numeros como cantidad de días
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 1
    },
    categories: {
        type: [Schema.Types.ObjectId],
        required: true,
        ref: "Category"
    },
    images: {
        type: [String],
        required: true,
        default: []
    }
})

const serviceModel = model("Service", serviceSchema)
export default serviceModel