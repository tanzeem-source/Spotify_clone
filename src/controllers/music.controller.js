const musicModel = require('../models/music.model');
const jwt = require("jsonwebtoken");

//API for creating music
async function createMusic(req, res){
  
  const token = req.cookies.token;     //accessing token from cookies

  if(!token){
    return res.status(401).json({      //if token doesn't exists, unauthorized message will be sent
        message: "Unauthorized"
    })
  }


  try{
   const decoded = jwt.verify(token, process.env.JWT_SECRET)   //verifying token 

   if(decoded.role!=="artist"){
    return res.status(403).json({message: "You don't have an access to create music"})
   }

} catch(err){
    return res.status(401).json({message: "Unauthorized"})
}

  const {title} = req.body;
  const file = req.file;


}