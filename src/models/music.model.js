const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({

    uri: {
        type: String,
        required: true,
    },

    title:{
        type: String,
        required: true,
    },

    artist: {
        type: mongoose.Schema.Types.ObjectId,   //reference to the user who uploaded the music
        ref: "user",              //reference to the user model, this will allow us to populate the artist field with the user's information when we query the music collection    
        required: true,
    }
})

const musicModel = mongoose.model('music', musicSchema);

module.exports = musicModel;