import Router from 'express'
import { ConversationController } from '../controllers/conversationController.js'
import { authenticateToken } from '../middleware/auth.js'
import { handleInputErrors } from '../middleware/validation.js'

const router = Router()

router.get("/check/:freelancerId", authenticateToken, ConversationController.getConversationByParticipants)
router.get("/", authenticateToken, ConversationController.getConversationByUser)
router.get("/:id", ConversationController.getConversationById)

router.post("/", authenticateToken, handleInputErrors, ConversationController.sendMessage)

export default router