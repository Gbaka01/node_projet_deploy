import express from 'express'
import { register, login, getAll, getOne, updateUser, deleteOne, renewPassword } from '../controllers/user.controller.js'
import auth from '../middlewares/auth.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/list', auth, getAll)
router.get('/:id', auth, getOne)
router.put('/:id', auth, updateUser)
router.delete('/:id', auth, deleteOne)
router.put("/renewpassword", auth, renewPassword);

export default router