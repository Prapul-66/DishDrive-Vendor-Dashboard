
const express = require('express');
const productController = require('../controllers/productcontroller.js');
// const verifyToken = require('../middlewares/verifyToken.js');


const router = express.Router();


router.post('/add-product/:firmId', productController.addProduct);
router.get('/:firmId/products', productController.getProductByFirm);

router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;

    res.setHeader('Content-Type', 'image/jpeg');
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName));
});

router.delete('/:productId', productController.deleteProductById);

module.exports = router;