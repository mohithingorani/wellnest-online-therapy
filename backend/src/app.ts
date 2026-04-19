import express from 'express';
import dotenv from "dotenv"
import { ping } from './controllers/ping.controller';
dotenv.config();
const app = express();

app.use(express.json());

app.use("/ping",ping);

const PORT = process.env.PORT || 3001;

function startApp() {
    app.listen(PORT,()=>{
        console.log(`APP STARTED AT PORT ${PORT}`);
    })
}

startApp();
