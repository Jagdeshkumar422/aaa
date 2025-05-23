const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const Image = require("../models/Image");
const mongoose = require("mongoose");


router.get("/ralatedimage", async (req, res) => {
  try {
    const { tag } = req.query;

    if (tag) {
      const images = await Image.find({ tag });
      res.json(images);
    } else {
      const allImages = await Image.find();
      res.json(allImages);
    }
  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// POST /api/images - Upload image
router.post(
  "/image",
  upload.fields([{ name: "img", maxCount: 1 }]),
  async (req, res) => {
    try {
      const { title, description, tag, resolution, locked, premium, like, view } = req.body;
      const imgFile = req.files["img"]?.[0];

      if (!imgFile) {
        return res.status(400).json({ message: "Image file is required" });
      }

      // Correct image folder path based on your upload.js
      const imageUrl = `/uploads/thumbnails/${imgFile.filename}`;

      const newImage = new Image({
        title,
        description,
        tag,
        resolution,
        locked: false,
        premium: true,
        like: Number(like) || 0,
        view: Number(view) || 0,
        imageUrl,
      });

      await newImage.save();
      res.status(201).json({ message: "Image uploaded successfully", image: newImage });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error uploading image" });
    }
  }
);

// GET /api/images - Fetch all images
router.get("/image", async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.status(200).json(images);
  } catch (err) {
    res.status(500).json({ message: "Error fetching images" });
  }
});

// GET /api/images/:id - Get single image
router.get("/image/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid image ID" });
  }

  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ message: "Image not found" });
    res.status(200).json(image);
  } catch (err) {
    res.status(500).json({ message: "Error fetching image" });
  }
});

// PUT /api/images/:id - Update image (text fields only)
router.put("/image/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid image ID" });
  }

  try {
    const { title, description, tag, resolution, locked, premium, like, view } = req.body;

    const updatedImage = await Image.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        tag,
        resolution,
        locked: false,
        premium: true,
        like: Number(like) || 0,
        view: Number(view) || 0,
      },
      { new: true }
    );

    if (!updatedImage) return res.status(404).json({ message: "Image not found" });

    res.status(200).json({ message: "Image updated", image: updatedImage });
  } catch (err) {
    res.status(500).json({ message: "Error updating image" });
  }
});

// DELETE /api/images/:id - Delete image
router.delete("/image/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid image ID" });
  }

  try {
    const deleted = await Image.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Image not found" });
    res.status(200).json({ message: "Image deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting image" });
  }
});

module.exports = router;
