import { Router } from 'express';
import * as auth from '../controllers/auth';

export const router = Router();

router.get('/ping', auth.validade);
router.post('/login', auth.login);