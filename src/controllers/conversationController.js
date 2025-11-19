import Conversation from "../models/Conversation.js"

export class ConversationController {
  static async getConversationByParticipants(req, res) {
    try{
        const { freelancerId } = req.params
        const clientId = req.user.id

        const conversation = await Conversation.findOne({
            freelancerId,
            clientId,
        })

        res.json(conversation)

    } catch (error) {
        console.error("Error al obtener la conversación", error)
        res.status(500).json(error)
    }
  }

  static async getConversationByUser(req, res) {
    try{
        const userId = req.user.id

        const conversations = await Conversation.find({
            $or: [
                { freelancerId: userId }, 
                { clientId: userId }
            ]
        })
        .populate('clientId', 'firstname lastname image')
        .populate('freelancerId', 'firstname lastname image') 
        .sort({ updatedAt: -1 })

        res.json(conversations)

    } catch (error) {
        console.error("Error al obtener la conversación", error)
        res.status(500).json(error)
    }
  }

  static async getConversationById(req, res) {
    try{
        const { id } = req.params

        const conversation = await Conversation.findById(id)

        if(!conversation){
            res.status(404).json({ message: "No se encontró la conversación" })
            return
        }

        res.status(200).json(conversation)

    }catch(error){
        console.error("Error al obtener la conversación", error)
        res.status(500).json(error)
    }
  }

  static async sendMessage(req, res) {
    try{
        const { freelancerId, clientId, message } = req.body
        const senderId = req.user.id

        let conversation = await Conversation.findOne({ freelancerId, clientId })

        if (conversation) {
            // Si existe, agregamos el mensaje
            conversation.messages.push({
                message,
                from: senderId
            })
            await conversation.save()
        } else {
            // Si no existe, creamos una conversación
            conversation = await Conversation.create({
                freelancerId,
                clientId,
                messages: [{
                    message,
                    from: senderId
                }]
            })
        }

        res.status(200).json(conversation)
    } catch (error) {
        console.error("Error al enviar mensaje", error)
        res.status(500).json(error)
    }
  }
}
