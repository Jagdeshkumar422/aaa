const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create upload directories if they don't exist
const createFolderIfNotExists = (folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder;
    if (file.fieldname === "thumbnail" || file.fieldname === "img") {
      folder = "uploads/thumbnails/";
    } else if (file.fieldname === "video") {
      folder = "uploads/videos/";
    } else {
      return cb(new Error(`Unexpected field: ${file.fieldname}`));
    }

    createFolderIfNotExists(folder);
    cb(null, folder);
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const imageTypes = [".jpg", ".jpeg", ".png", ".webp"];
  const videoTypes = [".mp4", ".mov", ".avi", ".mkv"];
  const ext = path.extname(file.originalname).toLowerCase();

  if ((file.fieldname === "thumbnail" || file.fieldname === "img") && imageTypes.includes(ext)) {
    cb(null, true);
  } else if (file.fieldname === "video" && videoTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for field: ${file.fieldname}`));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
