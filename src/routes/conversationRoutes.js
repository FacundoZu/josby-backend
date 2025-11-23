import Router from 'express'
import { ConversationController } from '../controllers/conversationController.js'
import { authenticateToken, authorizeRoles } from '../middleware/auth.js'
import { handleInputErrors } from '../middleware/validation.js'

const router = Router()

router.get("/check/:freelancerId", authenticateToken, ConversationController.getConversationByParticipants)
router.get("/", authenticateToken, ConversationController.getConversationByUser)
router.get("/search", authenticateToken, authorizeRoles('freelancer'), ConversationController.searchConversations)
router.get("/:id", ConversationController.getConversationById)

router.post("/", authenticateToken, handleInputErrors, ConversationController.sendMessage)
router.put("/read/:id", authenticateToken, ConversationController.markAsRead)

export default router