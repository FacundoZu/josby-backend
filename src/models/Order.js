import {Schema, model} from 'mongoose'

const orderSchema = new Schema({
    clienteId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    freelancerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    serviceId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Service"
    },
    fechaPedido: {
        type: Date,
        required: true,
        default: Date.now
    },
    fechaEntrega: {
        type: Date,
        required: true
    },
    precio: {
        type: Number,
        required: true,
    },
    estado: {
        type: String,
        required: true,
        enum: ['pendiente', 'en progreso', 'completado', 'cancelado'],
        default: 'pendiente'
    },
    entregables: {
        type: [String],
        required: true,
        default: []
    }
}, {
    timestamps: true,
    versionKey: false
}
)

const orderModel = model("Order", orderSchema)
export default orderModel