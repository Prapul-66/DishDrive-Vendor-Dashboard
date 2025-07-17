const Product = require("../models/Product");
const multer = require("multer");
const Firm = require("../models/Firm");
const path = require("path");

// Multer configuration to store uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Folder to save uploaded images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename using timestamp
  },
});

const upload = multer({ storage: storage });

// Add a new product to a specific firm
const addProduct = async (req, res) => {
  try {
    const { productName, price, category, description } = req.body;
    const image = req.file ? req.file.filename : null;

    // Find the firm by ID
    const firmID = req.params.firmId;
    const firm = await Firm.findById(firmID);
    if (!firm) {
      return res.status(404).json({ message: "Firm not found" });
    }

    // Create and save the product
    const product = new Product({
      productName,
      price,
      category,
      description,
      image,
      firm: firm._id,
    });

    const savedProduct = await product.save();

    // Add product reference to the firm's product array
    firm.products.push(savedProduct._id);
    await firm.save();

    return res.status(201).json({
      message: "Product added successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error adding product", error: error.message });
  }
};

// Get all products belonging to a firm
const getProductByFirm = async (req, res) => {
  try {
    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId).populate("products");

    if (!firm) {
      return res.status(404).json({ message: "Firm not found" });
    }

    const restaurantName = firm.firmName;
    console.log("Restaurant Name:", restaurantName);

    const products = await Product.find({ firm: firmId });

    res.status(200).json({ restaurantName, products });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

// Delete a product by its ID
const deleteProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Send success response
    res.status(200).json({ message: "Product deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};

// Export the handlers
module.exports = {
  addProduct: [upload.single("image"), addProduct],
  getProductByFirm,
  deleteProductById,
};
