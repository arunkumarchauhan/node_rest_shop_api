const express = require('express');

const router = express.Router();
const mongoose = require("mongoose")
const multer = require('multer');
const checkAuth=require('./middleware/check-auth')
const ProductCOntroller=require('../controller/product_controller')

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

router.get("/", ProductCOntroller.get_all_products);

router.get("/:productId", ProductCOntroller.get_product_by_id)

router.post("/", checkAuth,upload.single('productImage'),ProductCOntroller.create_new_product);
module.exports = router