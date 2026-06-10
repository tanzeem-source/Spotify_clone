const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");
const { uploadFile } = require("../services/storage.services");
const jwt = require("jsonwebtoken");

// API for creating music
async function createMusic(req, res) {
  // 3. Validate file existence
  if (!req.file) {
    return res.status(400).json({ message: "No music file uploaded" });
  }

  const { title } = req.body;
  const file = req.file;

  // 4. Upload file to storage service
  const result = await uploadFile(file.buffer.toString("base64"));

  // 5. Create database entry (decoded is accessible here now)
  const music = await musicModel.create({
    uri: result.url,
    title,
    artist: req.user.id,
  });

  // 6. Send success response
  return res.status(201).json({
    message: "Music created successfully",
    music: {
      id: music._id,
      uri: music.uri,
      title: music.title,
      artist: music.artist,
    },
  });
}

//API for creating album
async function createAlbum(req, res) {
  const { title, musics } = req.body;

  const album = await albumModel.create({
    title,
    artist: req.user.id,
    musics: musics,
  });

  res.status(201).json({
    message: "Album Created successfully",
    album: {
      id: album._id,
      title: album.title,
      artist: album.artist,
      musics: album.musics,
    },
  });
}

//API to get all musics

async function getAllMusics(req, res) {
  const musics = await musicModel
    .find()
    .skip(1)    //it skips some number of songs and fetch afterwards
    .limit(2)   //it limits the number of songs fetched, bcoz there are millions of song available
    .populate("artist", "username email");

  res.status(200).json({
    message: "Music fetched successfully",
    musics: musics,
  });
}

//API to get all Albums

async function getAllAlbums(req, res) {
  const albums = await albumModel
    .find()
    .select("title artist")
    .populate("musics")
    .populate("artist");

  res.status(200).json({
    message: "Albums fetched successfully",
    albums: albums,
  });
}

async function getAlbumById(req, res) {
  const albumId = req.params.albumId;

  const album = await albumModel
    .findById(albumId)
    .populate("artist", "username email")
    .populate("musics");

  res.status(200).json({
    message: "Albums fetched successfully",
    album: album,
  });
}

module.exports = {
  createMusic,
  createAlbum,
  getAllMusics,
  getAllAlbums,
  getAlbumById,
};
