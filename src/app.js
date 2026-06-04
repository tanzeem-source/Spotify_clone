const express = require('express');
const cookieParser = require('cookie-parser');


const app = express();  //creates instance of server

app.use(express.json());  //middleware to parse JSON request bodies
app.use(cookieParser());  //middleware to parse cookies from incoming requests





module.exports = app;