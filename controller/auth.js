const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user");

exports.postSignUp = async (req, res, next)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    try{
        let user = await User.findOne({email: email})
        if(user){
            const error = new Error("Email Already Exit");
            error.statusCode = 409;
            throw error;
        }
        let hashedPass = await bcrypt.hash(password, 12);
        const newUser = new User({
            name: name,
            email: email,
            password: hashedPass
        });
        let result = await newUser.save();
            res.status(201).json({
                message: "Sign In Success",
                result : result
            });
        }catch(err){
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        }
}

exports.postLogin = async (req, res, next)=>{
    const email = req.body.email;
    const password = req.body.password;

    try{
        let user = await User.findOne({email: email});
        if(!user){
            const error = new Error("User Not Found");
            error.statusCode = 404;
            throw error;
        }
        let isEqual = await bcrypt.compare(password, user.password);
            if(!isEqual){
                const error = new Error("Wrong Password");
                error.statusCode = 401;
                throw error;
            }

        const token = jwt.sign({
            email: user.email,
            userId: user._id.toString()
        },
        'thisissupersupersecretkey',
        {expiresIn: '1h'}
        );
        res.status(200).json({
            message: "Login Successful",
            token: token, 
            userId: user._id.toString() 
        });
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}