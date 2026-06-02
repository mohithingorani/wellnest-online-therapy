import { Router } from "express";
import {
  listEntries,
  getEntry,
  createEntry,
  updateEntry,
  deleteEntry,
  getStreak,
} from "../controllers/journal.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, listEntries);
router.get("/streak", requireAuth, getStreak);
router.get("/:id", requireAuth, getEntry);
router.post("/", requireAuth, createEntry);
router.patch("/:id", requireAuth, updateEntry);
router.delete("/:id", requireAuth, deleteEntry);

export default router;
