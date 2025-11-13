import Router from 'express'
import { ServiceController } from '../controllers/serviceController'
import { upload } from "../middlewares/fileMiddleware";

const router = Router()

router.get('/', ServiceController.getServices)

router.get('/:id', ServiceController.getService)

router.post('/', 
    authenticateToken,
    authorizeRoles('user'),
    upload.array("image", 5), 
    ServiceController.createService
)

router.put('/:id')

router.delete('/:id', ServiceController.deleteService)

export default router