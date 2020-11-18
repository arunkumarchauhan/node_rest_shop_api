const mongoose = require('mongoose');
const Order=require("../routes/models/order_model")
const Product = require('../routes/models/product_model')

exports.get_all_orders=(req,res,next)=>{

    Order.find({userId:req.userData.userId}).select("product quantity _id ordertime orderStatus")
    .populate('product','name price')
    .exec()
    .then(docs=>{
        res.status(200).json(
            {
                count:docs.length,
                orders:docs.map(doc=>{
                    return {
                        _id:doc._id,
                        product:doc.product,
                        quantity:doc.quantity,
                        userId:doc.userId,
                        ordertime:doc.ordertime,
                        orderStatus:doc.orderStatus,
                        request:{
                            type:"GET",
                            url:"http://localhost:3000/orders/"+doc._id
                        }
                    }
                })
                     
                }
            
        )
    })
    .catch(err=>{res.status(500).json(err)})
  
}

exports.get_order_detail_by_id=(req,res,next)=>{
    const id=req.params.orderId;
        console.log("HERE")
        Order.findById(id)
        .select("_id product quantity ordertime orderStatus ordertime")
        .populate('product','name price')
        .exec()
        .then(doc=>{
        if(doc)
        res.status(200).json({order:doc})
        else
        res.status(404).json({message:"Not  Found"})

        })
        .catch(err=>{
            res.status(500).json(err)
        })
   
   
}

exports.delete_order=(req,res,next)=>{
    const id=req.params.orderId;
    Order.remove({_id:id})
    .exec()
    .then(result=>{
        res.status(200).json({
        message: "Order Deleted",
        result:result
    })

    })
    .catch(err=>{
      res.status(500).json(err)  
    })
   
}

exports.create_new_order=(req,res,next)=>{
    Product.find({_id:{$in:req.body.productIds}})
    .exec()
    .then(products=>{
        console.log(products)
      if(products.length!=req.body.productIds.length)
      return res.status(404).json({message:"Products Not Found"})

      const order=new Order(
       { _id:mongoose.Types.ObjectId(),
        quantity:req.body.quantity,
        product:req.body.productIds,
        userId:req.userData.userId
        });
        return order.save()
    })
  .then(result=>{
             res.status(201).json({
        message: "Order Placed.",
        createdOrder:{
            _id:result._id,
            product:result.product,
            quantity:result.quantity,
            ordertime:req.ordertime
        },
        request:{
            type:"GET",
            url:"http://localhost:3000/orders/"+result._id

        }
    })
        })
        .catch(err=>{
            res.status(500).json(err)
        })
   
}