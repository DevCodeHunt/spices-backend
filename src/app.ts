import express, { Application } from "express";
import * as dotenv from 'dotenv'
import cors from "cors"
import helmet from "helmet"

dotenv.config()

const app: Application = express();
app.use(helmet()); 
app.use(cors()); 

app.get("/", (req, res) => {
    res.status(200).json({
        status: 200,
        message: "Application successfully loaded"
    })
})

export default app