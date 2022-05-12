const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const URI = "mongodb+srv://root:root@cluster0.hl7kn.mongodb.net/ChatApp?retryWrites=true&w=majority"
const PORT = 8080 || process.env.PORT;

const User = require("./model/user");
const authRoutes = require("./routes/auth");
const msgRoutes = require("./routes/message");

const app = express();
const store = new MongoDBStore({
    uri: URI,
    collection: 'sessions'
  });

app.set("view engine", "ejs");
app.set("views", "views");

// app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended : false}));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})

app.use(
    session({
      secret: 'my secret',
      resave: false,
      saveUninitialized: false,
      store: store
    })
);

app.use((req, res, next)=>{
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if(!user){
                return next();
            }
            //console.log(user);
            req.user = user;
            next();
        })
        .catch(err =>{
            next(new Error(err));
        });
});



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
        const server = app.listen(PORT);
        console.log("Connected!");
        const io = require("./socket").init(server);
        io.on('connection', (socket)=>{
            console.log("Client Connected");

            socket.on("chatMessage", msg=>{
                //console.log(msg);
                io.emit("message" ,msg);
            })
        })
    }).catch((err) => {
        console.log(err);
    });