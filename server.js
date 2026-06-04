require ('dotenv').config();  
const app = require('./src/app');  //import the Express app from src/app.js
const connectDB = require('./src/db/db');  //import the database connection function from src/db/db.js


connectDB(); //connect to the database before starting the server

app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
})



