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

      const formattedConversations = conversations.map(conv => {
         const convObj = conv.toObject()
         
         if (conv.freelancerId._id.toString() === userId) {
            convObj.unread = conv.freelancerUnread || 0
         } 
         else {
            convObj.unread = conv.clientUnread || 0
         }
         
         return convObj
      })

      res.json(formattedConversations)
    } catch (error) {
      console.error("Error al obtener la conversación", error)
      res.status(500).json(error)
    }
  }

  static async getConversationById(req, res) {
    try {
      const { id } = req.params

      const conversation = await Conversation.findById(id).populate("clientId", "firstname lastname image")

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
      let isNewConversation = false

      if (conversation) {
        // Si existe, agregamos el mensaje
        conversation.messages.push({
          message,
          from: senderId,
        })

        if (senderId === conversation.freelancerId.toString()) {
            conversation.clientUnread = (conversation.clientUnread || 0) + 1
        } else {
            conversation.freelancerUnread = (conversation.freelancerUnread || 0) + 1
        }

        newMessage = conversation.messages[conversation.messages.length - 1]
        await conversation.save()
      } else {
        // Si no existe, creamos una conversación
        isNewConversation = true
        const isSenderFreelancer = senderId === freelancerId

        conversation = await Conversation.create({
          freelancerId,
          clientId,
          freelancerUnread: isSenderFreelancer ? 0 : 1,
          clientUnread: isSenderFreelancer ? 1 : 0,
          messages: [
            {
              message,
              from: senderId
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
        {
          newMessage,
          conversationId: conversation._id
        }
      )

      io.to(receiverID.toString()).emit(
        "chat_list_update",
        {
          newMessage,
          conversationId: conversation._id
        }
      )

      //Emite la notificación (cuando el usuario está en otro lado de la pág)
      io.to(receiverID).emit("notification", {
        conversationId: conversation._id,
        from: senderId,
        message,
        updatedAt: new Date(),
      })

      if (isNewConversation) {
        res.status(200).json(conversation)
        return

      } else {
        res.status(200).json(newMessage)
        return
      }

    } catch (error) {
      console.error("Error al enviar mensaje", error)
      res.status(500).json(error)
    }
  }

  static async markAsRead(req, res){
    try{
      const { id } = req.params
      const userId = req.user.id

      const conversation = await Conversation.findById(id)

      if (!conversation){
        res.status(404).json({ msg: "Conversación no encontrada" })
        return
      } 

      if (userId === conversation.freelancerId.toString()) {
          conversation.freelancerUnread = 0
      } else if (userId === conversation.clientId.toString()) {
          conversation.clientUnread = 0
      }

      await conversation.save()
      res.status(200).json({ msg: "Marcado como leído" })
    }catch(error){
      console.error("Error al marcar como leido:", error)
      res.status(500).json(error)
    }
  }
}
