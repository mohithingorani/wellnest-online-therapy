import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import therapistRoutes from "./routes/therapists";
import pingRoutes from "./routes/ping";
import specialityRoutes from "./routes/specialties";
import userRoutes from "./routes/users";
import adminRoutes from "./routes/admin";
import { openApiSpec } from "./swagger";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://mohit.systems:5173",
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

const PORT = process.env.PORT || 3000;

function startApp() {
  app.listen(PORT, () => {
    console.log(`APP STARTED AT PORT ${PORT}`);
  });
}

startApp();
