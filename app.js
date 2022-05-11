const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const cors = require("cors");

const URI = "mongodb+srv://root:root@cluster0.hl7kn.mongodb.net/ChatApp?retryWrites=true&w=majority"
const PORT = 8080 || process.env.PORT;

const authRoutes = require("./routes/auth");
const msgRoutes = require("./routes/message");

const app = express();

app.use(express.json());
app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})

app.use("/auth", authRoutes);
app.use("/message", msgRoutes);



app.use((error, req, res, next)=>{
    // console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data: data});
})

mongoose.connect(URI)
    .then((result) => {
        app.listen(PORT);
        console.log("Connected!");
    }).catch((err) => {
        console.log(err);
    });