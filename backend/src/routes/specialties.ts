import {Router} from "express";
import {getSpecialties, createSpecialty} from "../controllers/specialties.controller";

const router = Router();

router.get('/', getSpecialties);
router.post('/', createSpecialty);
export default router;