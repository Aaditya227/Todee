const redisClient = require("../config/redis");
const User = require("../models/user");
const validate = require("../utils/validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



const register = async (req,res)=>{

    try{
        
       // validate the data: Name, email, password
       validate(req.body);
       
       const {firstName, emailId, password} = req.body;

       // Paasword ko hash code me krne wale hai
       req.body.password = await bcrypt.hash(password, 10);
       req.body.role = "user";
 
       // User Register ke sath token    
       const user = await User.create(req.body);

       // Token create for Register
       const token = jwt.sign({_id: user._id, emailId: emailId, role:'user'}, process.env.JWT_KEY , {expiresIn: 60*60});    // 1 hour = 60 mon = 3600 sec    // Generate a Random JWT Secret Key : website name 

       // Set token in Cookie
       res.cookie('token',token,{maxAge: 60*60*1000});   // maxAge == expire  // MiniSecond 

       // Send responce
       res.status(201).send("User Register Successfully")

    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}


const login = async (req,res) => {

    try{

        const {emailId, password} = req.body;

        if(!emailId)
            throw new Error("Invalid Creadentials");

        if(!password)
            throw new Error("Invalid Creadentials");

        const user = await User.findOne({emailId});

        const match = await bcrypt.compare(password, user.password);

        if(!match)
            throw new Error('Invalid Creadentials');

        const token = jwt.sign({_id: user._id, emailId: emailId, role:user.role}, process.env.JWT_KEY , {expiresIn: 60*60});
        res.cookie('token',token,{maxAge: 60*60*1000});
        res.status(200).send("Login Successfully");
    }
    catch(err){
    res.status(401).send("Error: "+err);
    }
}


const logout = async (req,res) => {

    try{

        const {token} = req.cookies;

        const payload = jwt.decode(token);

        await redisClient.set(`token:${token}`, 'Blocked');
        await redisClient.expireAt(`token:${token}`, payload.exp);
        // Token add kar denge Redis DB ki blocklist me
        // Cookies ko clear kar dena....

        res.cookie("token",null,{expires: new Date(Date.now())});
        res.send("Logout Successfully");
    }
    catch(err){
        res.status(503).send("Error: "+err);
    }
}



module.exports = {register, login, logout};
