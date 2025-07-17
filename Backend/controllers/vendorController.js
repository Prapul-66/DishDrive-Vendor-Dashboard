const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotEnv = require('dotenv');

dotEnv.config();

const secretKey = process.env.Whatisyourname;

// ✅ Register Vendor
const vendorController = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const vendorEmail = await Vendor.findOne({ email });
    if (vendorEmail) {
      return res.status(400).json({ message: 'Vendor already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newVendor = new Vendor({
      username,
      email,
      password: hashedPassword,
    });

    await newVendor.save();
    res.status(201).json({ message: 'Vendor registered successfully' });
    console.log('✅ Vendor registered successfully');

  } catch (error) {
    console.error('❌ Error registering vendor:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Login Vendor
const vendorLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const vendor = await Vendor.findOne({ email });

    if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
      return res.status(400).json({ message: 'Vendor not found or invalid password' });
    }

    const token = jwt.sign({ vendorId: vendor._id }, secretKey, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Vendor logged in successfully',
      token,
      vendorID: vendor._id
    });

    console.log(email, "this is a token", token);

  } catch (error) {
    console.error('❌ Error logging in vendor:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Get All Vendors
const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate('firm');
    res.status(200).json(vendors);
  } catch (error) {
    console.error('❌ Error fetching vendors:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Get Vendor By ID (Fixed)
const getVendorById = async (req, res) => {
  const vendorId = req.params.id;
  try {
    const vendor = await Vendor.findById(vendorId).populate('firm');

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const vendorFirmID = vendor.firm && vendor.firm.length > 0 ? vendor.firm[0]._id : null;

    res.status(200).json({ vendorID: vendor._id, vendorFirmID });
    console.log("✅ Vendor ID:", vendor._id, "| Firm ID:", vendorFirmID);

  } catch (error) {
    console.error('❌ Error fetching vendor:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  vendorController,
  vendorLogin,
  getAllVendors,
  getVendorById
};
