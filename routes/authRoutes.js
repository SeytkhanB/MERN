
import express from 'express';
const router = express.Router()

import {register, login, updateUser} from '../controllers/authController.js';

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/updateUser').patch(updateUser)
                          // ↑ don't forget, this is a "patch" request
export default router