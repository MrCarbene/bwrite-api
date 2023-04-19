import { Router } from 'express';
import { Permission } from '../../database/models/ApiKey';
import permission from '../../middlewares/permission';
import apikey from '../../middlewares/apikey';
import { signup, login, logout, token } from './auth';

const router = Router();

// ----------- CHECK API KEY AND PERMISSIONS -----------
router.use(apikey);
router.use(permission(Permission.GENERAL));
// ---------- -------------- ----------- ----------- ---

router.use('/signup', signup);
router.use('/login', login);
router.use('/logout', logout);
router.use('/refersh', token);

export default router;
