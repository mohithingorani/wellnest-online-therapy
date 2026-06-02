import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import swaggerUi from "swagger-ui-express";
import therapistRoutes from "./routes/therapists";
import pingRoutes from "./routes/ping";
import specialityRoutes from "./routes/specialties";
import userRoutes from "./routes/users";
import adminRoutes from "./routes/admin";
import therapistAuthRoutes from "./routes/therapistAuth";
import messageRoutes from "./routes/messages";
import journalRoutes from "./routes/journal";
import { openApiSpec } from "./swagger";
import { createSocketServer } from "./socket";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173","https://wellnest.mohit.systems"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));
app.get("/api/openapi.json", (_req, res) => {
  res.json(openApiSpec);
});
app.use("/api/therapists", therapistRoutes);
app.use("/api/ping", pingRoutes);
app.use("/api/specialties", specialityRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/therapists/auth", therapistAuthRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/journal", journalRoutes);

const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app);
createSocketServer(httpServer);

httpServer.listen(PORT, () => {
  console.log(`APP STARTED AT PORT ${PORT}`);
});
