import { Router } from 'express'
const router = Router()
import {registerAdmin, login, register, logout, getUser, refresh} from '../controllers/auth_controller.js'
import {auth} from '../middleware/auth.js'
router.post('/registerAdmin', registerAdmin)
router.post('/register', register)

router.post('/login', login)

router.post('/logout', logout)

router.post('/refresh', refresh)

router.get('/user', auth ,  getUser)



export default router