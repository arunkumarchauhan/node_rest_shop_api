const express= require('express');
const app=express();
const productRoutes=require("./api/routes/products");
const orderRoutes=require("./api/routes/orders");
const morgan =require("morgan")
const bodyParser=require("body-parser")
const userRoutes=require('./api/routes/user')
const empRoutes=require('./api/routes/employee')

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false   }))
app.use(bodyParser.json())

app.use((req,res,next)=>{
    res.header("Allow-Control-Allow-Origin",'*')
    res.header("Allow-Control-Allow-Headers","Origin, X-Requested-With, Content-Type,Accept,Authorization")
    if(req.method=="OPTIONS"){
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE')
        return res.status(200).json({});
    }
    next();
})

app.use('/uploads',express.static('uploads'))

app.use('/users',userRoutes)
app.use("/products",productRoutes);
app.use("/orders",orderRoutes);
app.use("/employees",empRoutes);
app.use((req,res,next)=>{
    const error= Error("Not Found");
    error.status=404;
    next(error);
})

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:error.message,
        status:error.status
    })
})
module.exports=app;