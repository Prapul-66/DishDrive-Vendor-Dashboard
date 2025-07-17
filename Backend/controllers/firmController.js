const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const path = require('path');

const addFirm = async (req, res) => {
  try {
    const { firmName, area, category, region, offer } = req.body;
    const image = req.file ? req.file.filename : null;

    const vendor = await Vendor.findById(req.vendorId);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    
    if(vendor.firm.length > 0) {
      return res.status(400).json({ message: 'Vendor can have only one firm' });
    }

    const firm = new Firm({
      firmName,
      area,
      category,
      region,
      offer,
      image,
      vendor: vendor._id,
    });

    const savedFirm = await firm.save();

    const firmID = savedFirm._id; 


    vendor.firm.push(savedFirm._id);

    await vendor.save();


    res.status(201).json({ message: 'Firm added successfully' , firmID });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding firm', error: error.message });
  }
};

const deleteFirmByID = async (req, res) => {
  try {
    const firmID = req.params.firmId;
    const deletedFirm = await Firm.findByIdAndDelete(firmID);
    if (!deletedFirm) {
      return res.status(404).json({ message: 'Firm not found' });
    }

    res.status(200).json({ message: 'Firm deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting firm', error: error.message });
  }
};

module.exports = { addFirm, deleteFirmByID };