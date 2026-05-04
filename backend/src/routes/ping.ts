import { Router } from "express";
import { ping } from "../controllers/ping.controller";
const router = Router();

/**
 * @openapi
 * /api/ping:
 *   get:
 *     tags:
 *       - Ping
 *     summary: Health check endpoint.
 *     responses:
 *       200:
 *         description: API is reachable.
 */
router.get("/",ping);

export default router;