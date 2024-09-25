import express  from 'express'
const router = express.Router()
import {registerAdmin, login, register, logout, refresh} from '../controllers/auth_controller.js'
import {auth} from '../middleware/auth.js'
router.post('/registerAdmin', registerAdmin)
router.post('/register', register)

router.post('/login', login)

router.post('/logout', logout)

router.post('/refresh', refresh)





export default router