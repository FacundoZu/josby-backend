import Router from 'express'
import { ServiceController } from '../controllers/serviceController.js'
import { upload } from '../middleware/fileMiddleware.js'
import { authenticateToken, authorizeRoles } from "../middleware/auth.js"
import { createServiceValidator, updateServiceValidator } from '../validators/serviceValidator.js'
import { handleInputErrors } from '../middleware/validation.js'
const router = Router()

router.get('/', ServiceController.getServices)

router.get('/:id', ServiceController.getService)

router.post('/',
    authenticateToken,
    authorizeRoles('freelancer', 'user'),
    upload.array("images", 5), 
    createServiceValidator,
    handleInputErrors,
    ServiceController.createService
)

router.put('/:id', 
    authenticateToken,
    authorizeRoles('freelancer'),
    upload.array("images", 5), 
    updateServiceValidator,
    handleInputErrors,
    ServiceController.updateService
)

router.delete('/:id', 
    authenticateToken,
    authorizeRoles('freelancer'),
    ServiceController.deleteService
)

export default router