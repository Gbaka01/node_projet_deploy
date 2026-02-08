
import { Router } from "express";
import { createImage, getMesImages, getAllImages, getImageById, updateImage, deleteImage } from "../controllers/image.controller.js"
import { upload } from "../middlewares/multer.js"
import auth from "../middlewares/auth.js"
const router = Router()

router.post('/new',auth, upload.single('nom'), createImage)
router.get('/mesimages', auth, getMesImages)
router.get('/all', getAllImages)
router.get('/:id', getImageById)
router.put('/:id', updateImage)
router.delete('/:id', deleteImage)

export default router