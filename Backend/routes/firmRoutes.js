const express = require('express');
const path = require('path');
const multer = require('multer');
const verifyToken = require('../middlewares/verifyToken.js');
const firmController = require('../controllers/firmController.js');

const router = express.Router();

// ✅ Define multer config inline (no separate file needed)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// ✅ Add Firm route (upload → token → controller)
router.post('/add-firm', upload.single('firmImage'), verifyToken, firmController.addFirm);

// ✅ Serve uploaded images if needed
router.get('/uploads/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  res.setHeader('Content-Type', 'image/jpeg');
  res.sendFile(path.join(__dirname, '..', 'uploads', imageName));
});

// Delete firm route
router.delete('/:firmId', firmController.deleteFirmByID);

module.exports = router;
