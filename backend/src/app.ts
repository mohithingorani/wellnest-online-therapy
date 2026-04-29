import express from 'express';
import dotenv from "dotenv"
import therapistRoutes from './routes/therapists';
import pingRoutes from './routes/ping';
import specialityRoutes from './routes/specialties';
dotenv.config();
const app = express();

app.use(express.json());
app.use("/api/therapists", therapistRoutes);
app.use("/api/ping", pingRoutes);
app.use("/api/specialties", specialityRoutes);

const PORT = process.env.PORT || 3001;

function startApp() {
    app.listen(PORT,()=>{
        console.log(`APP STARTED AT PORT ${PORT}`);
    })
}

startApp();
