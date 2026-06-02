import { Router } from "express";
import {
  listConversations,
  getMessages,
  sendMessage,
  createConversation,
} from "../controllers/messages.controller";
import { requireAuth } from "../middleware/auth";
import { requireTherapistAuth } from "../middleware/therapistAuth";

const router = Router();

router.get(
  "/conversations",
  (req, _res, next) => {
    if (req.cookies?.wellnest_therapist) {
      return requireTherapistAuth(req, _res, next);
    }
    return requireAuth(req, _res, next);
  },
  listConversations,
);

router.get(
  "/conversations/:id/messages",
  (req, _res, next) => {
    if (req.cookies?.wellnest_therapist) {
      return requireTherapistAuth(req, _res, next);
    }
    return requireAuth(req, _res, next);
  },
  getMessages,
);

router.post(
  "/conversations/:id/messages",
  (req, _res, next) => {
    if (req.cookies?.wellnest_therapist) {
      return requireTherapistAuth(req, _res, next);
    }
    return requireAuth(req, _res, next);
  },
  sendMessage,
);

router.post("/conversations", requireAuth, createConversation);

export default router;
