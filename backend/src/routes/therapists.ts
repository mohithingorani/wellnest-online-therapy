import {Router} from 'express';
import {createTherapist, getTherapists} from '../controllers/therapists.controller';

const router = Router();

router.get('/', getTherapists);
router.post('/', createTherapist);

export default router;