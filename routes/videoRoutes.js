const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const Video = require("../models/videos");

// POST /api/video - Upload video
router.post(
  "/video",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, description, tags, duration } = req.body;

      const thumbnailFile = req.files["thumbnail"]?.[0];
      const videoFile = req.files["video"]?.[0];

      if (!thumbnailFile || !videoFile) {
        return res.status(400).json({ message: "Thumbnail and video are required" });
      }

      const thumbnailUrl = `/uploads/thumbnails/${thumbnailFile.filename}`;
      const videoUrl = `/uploads/videos/${videoFile.filename}`;

      const newVideo = new Video({
        title,
        description,
        tags: tags?.split(",").map((tag) => tag.trim()),
        thumbnailUrl,
        videoUrl,
        duration,
        // isPremium: isPremium === "true",
      });

      await newVideo.save();
      res.status(201).json({ message: "Video uploaded successfully", video: newVideo });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error uploading video" });
    }
  }
);

// GET /api/videos - Fetch all videos
router.get("/videos", async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json({ message: "Error fetching videos" });
  }
});

// GET /api/video/:id - Get single video
router.get("/video/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });
    res.status(200).json(video);
  } catch (err) {
    res.status(500).json({ message: "Error fetching video" });
  }
});

// PUT /api/video/:id - Update video (text fields only)
router.put("/video/:id", async (req, res) => {
  try {
    const { title, description, tags, duration } = req.body;

    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        tags: tags?.split(",").map((tag) => tag.trim()),
        duration,
      },
      { new: true }
    );

    if (!updatedVideo) return res.status(404).json({ message: "Video not found" });

    res.status(200).json({ message: "Video updated", video: updatedVideo });
  } catch (err) {
    res.status(500).json({ message: "Error updating video" });
  }
});

// DELETE /api/video/:id - Delete video
router.delete("/video/:id", async (req, res) => {
  try {
    const deleted = await Video.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Video not found" });
    res.status(200).json({ message: "Video deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting video" });
  }
});

module.exports = router;
