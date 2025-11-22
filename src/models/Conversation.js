import { Schema, model } from "mongoose"

const messageSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    _id: true
})

const conversationSchema = new Schema({
    freelancerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    clientId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    messages: [messageSchema]
},{
    timestamps: true,
    versionKey: false
})

conversationSchema.index({ freelancerId: 1, clientId: 1 })

const conversationModel = model("Conversation", conversationSchema)

export default conversationModel