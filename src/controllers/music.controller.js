const musicModel = require('../models/music.model');
const { uploadFile } = require("../services/storage.services");
const jwt = require("jsonwebtoken");

// API for creating music
async function createMusic(req, res) {
  const token = req.cookies.token; // Accessing token from cookies

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  try {
    // 1. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2. Check RBAC (Role-Based Access Control)
    if (decoded.role !== "artist") {
      return res.status(403).json({ message: "You don't have access to create music" });
    }

    // 3. Validate file existence
    if (!req.file) {
      return res.status(400).json({ message: "No music file uploaded" });
    }

    const { title } = req.body;
    const file = req.file;

    // 4. Upload file to storage service
    const result = await uploadFile(file.buffer.toString('base64'));

    // 5. Create database entry (decoded is accessible here now)
    const music = await musicModel.create({
      uri: result.url,
      title,
      artist: decoded.id, 
    });

    // 6. Send success response
    return res.status(201).json({
      message: "Music created successfully",
      music: {
        id: music._id,
        uri: music.uri,
        title: music.title,
        artist: music.artist,
      }
    });

  } catch (err) {
    console.error("Error creating music:", err);
    // If JWT verification fails, it throws an error which lands here
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = { createMusic };