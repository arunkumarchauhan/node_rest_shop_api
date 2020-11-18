const mongoose=require('mongoose')

const orderSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId ,
    product:[{
        productId:{type:mongoose.Schema.Types.ObjectId,ref:'Product',required:true},
        quantity:{type:Number,default:1}
    }],
    userId:{type :mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    ordertime : { type : Date, default: Date.now },
    orderStatus:{type:String,default:"pending"}
});


module.exports=mongoose.model('Order',orderSchema)