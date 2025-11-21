import Conversation from "../models/Conversation.js"
import User from '../models/User.js'

export class ConversationController {
  static async getConversationByParticipants(req, res) {
    try {
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
    try {
      const userId = req.user.id

      const conversations = await Conversation.find({
        $or: [{ freelancerId: userId }, { clientId: userId }],
      })
        .populate("clientId", "firstname lastname image")
        .populate("freelancerId", "firstname lastname image")
        .sort({ updatedAt: -1 })

      res.json(conversations)
    } catch (error) {
      console.error("Error al obtener la conversación", error)
      res.status(500).json(error)
    }
  }

  static async getConversationById(req, res) {
    try {
      const { id } = req.params

      const conversation = await Conversation.findById(id)

      if (!conversation) {
        res.status(404).json({ message: "No se encontró la conversación" })
        return
      }

      res.status(200).json(conversation)
    } catch (error) {
      console.error("Error al obtener la conversación", error)
      res.status(500).json(error)
    }
  }

  static async searchConversations(req, res) {
    try {
      const { q } = req.query

      if (!q) {
        return res.status(400).json({ message: "El término de búsqueda es requerido" })
      }

      const cleanQuery = q.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      const regex = new RegExp(cleanQuery, "i")

      //Busca al usuario ("cliente")
      const users = await User.find({
        $or: [
          { firstname: { $regex: regex } },
          { lastname: { $regex: regex } },
        ],
      }).select("_id") 

      if (users.length === 0){
        return res.status(200).json([])
      }

      const userIds = users.map((user) => user._id)

      const conversations = await Conversation.find({
        clientId: { $in: userIds },
        freelancerId: req.user.id 
      }).populate("clientId", "firstname lastname image")

      res.status(200).json(conversations)

    } catch (error) {
      console.error("Error al buscar conversaciones:", error)
      res.status(500).json(error)
    }
  }

  static async sendMessage(req, res) {
    try {
      const { freelancerId, clientId, message } = req.body
      const senderId = req.user.id

      const io = req.app.get("socketio")

      let conversation = await Conversation.findOne({ freelancerId, clientId })
      let newMessage = null

      if (conversation) {
        // Si existe, agregamos el mensaje
        conversation.messages.push({
          message,
          from: senderId,
        })

        newMessage = newMsg
        await conversation.save()
      } else {
        // Si no existe, creamos una conversación
        conversation = await Conversation.create({
          freelancerId,
          clientId,
          messages: [
            {
              message,
              from: senderId,
            },
          ],
        })

        newMessage = conversation.messages[0]
      }

      const receiverID =
        conversation.freelancerId.toString() === senderId
          ? conversation.clientId.toString()
          : conversation.freelancerId.toString()

      // Emite al chat (para verlo si el usuario está dentro)
      io.to(conversation._id.toString()).emit(
        "receive_message",
        newMessageData
      )

      //Emite la notificación (cuando el usuario está en otro lado de la pág)
      io.to(receiverID).emit("notification", {
        conversationId: conversation._id,
        from: senderId,
        message,
        updatedAt: new Date(),
      })

      res.status(200).json(conversation)
    } catch (error) {
      console.error("Error al enviar mensaje", error)
      res.status(500).json(error)
    }
  }
}
