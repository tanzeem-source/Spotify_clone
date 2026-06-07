const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');  //import authentication routes
const musicRoutes = require('./routes/music.routes');  //import music routes

const app = express();  //creates instance of server

app.use(express.json());  //middleware to parse JSON request bodies
app.use(cookieParser());  //middleware to parse cookies from incoming requests
app.use('/api/auth', authRoutes);  //mount authentication routes at /api/auth
app.use('/api/music', musicRoutes);  //mount music routes at /api/music




module.exports = app;