const Product = require("../routes/models/product_model")
const mongoose = require("mongoose")

exports.get_all_products=(req, res, next) => {
    Product.find().select("name price _id productImage").exec().then(
        result => {
            res.status(200).json({
                count: result.length,
                products: result.map(doc => {
                    return {
                        name: doc.name, price: doc.price, _id: doc._id,
                        productImage:doc.productImage,
                        request: {
                            type: "GET", url: "http://localhost:3000/products/" + doc._id
                        }
                    }
                })
            })
        }
    ).catch(err => {
        res.status(500).json(error)
    })

}

exports.get_product_by_id=(req, res, next) => {
    const id = req.params.productId;

    Product.findById(id)
    .select("name price _id productImage")    
    .exec() 
        .then(result => {
            console.log(result)
            if (result)
                res.status(200).json({product:result})
            else res.status(404).json({ message: "Product not found." })
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })

}

exports.create_new_product=(req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.filename
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
            name: result.name,
            price: result.price,
            _id: result._id,
            productImage:result.productImage,
            request: {
                type: 'GET',
                url: "http://localhost:3000/products/" + result._id
            }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}