import { Router } from 'express'
const router = Router()
import {registerAdmin} from '../controllers/auth_controller.js'

router.post('/registerAdmin', registerAdmin)
// router.post('/register')

// router.post('/login', login)

// router.post('/logout', logout)

// router.post('/refresh', refresh)

// router.get('/user', auth ,  user)



export default router