const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


//API for user registration
async function registerUser(req, res){

    const {username, email, password, role='user'}= req.body;

    const isUserAlreadyExists= await userModel.findOne({
        $or: [
            {username},
            {email}
        ]
    })

    if(isUserAlreadyExists){
        return res.status(409).json({message: 'Username or email already exists'});
    }

    const hash = await bcrypt.hash(password, 10);  //hashing the password before storing in database,
   // adding a salt to the password to make it more secure, 10 is the number of rounds for hashing

    const user = await userModel.create({
        username,
        email,
        password: hash,     //storing data in database, password is stored as hash
        role
    })

    const token = jwt.sign({   //gerenating token for the user
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET)

    res.cookie("token", token)   //storing token in cookie
  
    res.status(201).json({
        message: "user registered successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        }
    })


}

//API for user login
async function loginUser(req, res){

    const {username, email, password}= req.body;

    const user = await userModel.findOne({
        $or: [
            {username},
            {email}
        ]
    })

    if(!user){
        return res.status(404).json({message: 'Invalid credentials'});
    }


    const isPasswordValid = await bcrypt.compare(password, user.password); //comparing the password entered by user with the hashed password stored in database

    if(!isPasswordValid){
        return res.status(404).json({message: 'Invalid credentials'});
    }

    const token = jwt.sign({
        id: user._id,
        role: user.role,
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(200).json({
        message: "user logged in successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        }
    })
    
    
}


module.exports = {registerUser, loginUser} 

//exporting the registerUser and loginUser functions to be used in other parts of the application