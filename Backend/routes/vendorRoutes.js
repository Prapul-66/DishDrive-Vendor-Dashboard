
const vendorController = require('../controllers/vendorController.js');
const express = require('express');
const router = express.Router();

router.post('/register', vendorController.vendorController);
router.post('/login', vendorController.vendorLogin);



router.get('/all-vendors', vendorController.getAllVendors);
router.get('/single-vendor/:id', vendorController.getVendorById);

module.exports = router;