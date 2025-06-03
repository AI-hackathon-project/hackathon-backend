import express from "express";
import "dotenv/config";
import { dbConnection } from "./config/db.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import cors from "cors"
import { userRouter } from "./routes/user_route.js";
import expressOasGenerator from "@mickeymond/express-oas-generator";


const app = express();


expressOasGenerator.handleResponses(app, {
    alwaysServeDocs: true,
    tags: ["auth"],
    mongooseModels: mongoose.modelNames(), 
})



// Use Middlewares
app.use(cors({credentials: true, origin: '*'}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true },
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}))

dbConnection();

app.use('/api/v1', userRouter);


app.use((req, res) => res.redirect('/api-docs/'));

const port = process.env.PORT;


//Listen for incoming request
app.listen(port,()=>{
    console.log(`Server is running on Port ${port}`);
});