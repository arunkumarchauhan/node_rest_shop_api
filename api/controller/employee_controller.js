const Employee = require("../routes/models/employee_model")
const mongoose = require("mongoose")
const bcrypt=require("bcrypt")
const  jwt=require('jsonwebtoken');
const  Order=require('../routes/models/order_model');
const e = require("express");

exports.employee_signup=(req,res,next)=>{
    Employee.find({email:req.body.email}).exec()
    .then(user=>{
    if(user.length>=1){
        return res.status(409).json({message:"E-mail exists"})
    }
    else {
        bcrypt.hash(req.body.password,10,(err,hash)=>{
        if(err)
         return res.status(200).json(err)
        else {
            console.log(hash)
        const  employee=Employee({
                _id:new mongoose.Types.ObjectId(),
                email:req.body.email,
                password:hash})
                user.save()
                .then(result=>{
                   
                    res.status(201)
                    .json({message:"Employee Created",employee:{
                        _id:result._id,
                        email:result.email
                    } })
                })
                .catch(err=>{
                    res.status(500).json(err)
                })
        }
    })
    }
    })
    .catch(err=>{res.status(500).json(err)})
}

exports.employee_signin= (req,res,next)=>{
    Employee.find({email:req.body.email})
    .exec()
    .then(employee=>{
        if(employee.length<1)
        {
          return  res.status(401).json({ message:"Auth Failed"})
        }
      bcrypt.compare(req.body.password,employee[0].password,(err,result)=>{
          if(err)
          {
               return  res.status(401).json({ message:"Auth Failed"  })
          }
          if(result){
              const token= jwt.sign({
                        email:employee[0].email,
                        employeeId:employee[0]._id,
                    },process.env.JWT_KEY,
                    {
                        expiresIn:"1h"
                    }
                    )
              return res.status(200).json({message:"Auth Successful",token:token})
          }
          return  res.status(401).json({  message:"Auth Failed"  })
      })
    })
}

exports.delete_employee=(req,res,next)=>{
    Employee.remove({_id:req.params.employeeId})
    .then(result=>{
        res.status(200).json({message:"user deleted"})
    })
    .catch(err=>{
        res.status(500).json(err)
    })
}

exports.update_order_status=(req,res,next)=>{
                        console.log("HERE")

        const  empId=req.userData.employeeId
        Employee.findById(empId)
        .exec()
        .then(doc=>{
          
                Order.findByIdAndUpdate(req.body.orderId,{orderStatus:req.body.orderStatus})
                .exec()
                .then((order)=>{
                     return res.status(200).json({
                        message:"Order status updated successfully",
                        order:order,
                        request:{
                            type:"GET",
                            url:"http://localhost:3000/order/"+order._id
                        }

                    })
               }
                )
                .catch(err=>{
                 return  res.status(404).json({message:'Order Not Founsd',error:err})

                })


        })
        .catch(err=>{
            return res.status(500).json({message:"Internal Server Error",error:err})
        })
}

exports.get_all_orders=(req,res,next)=>{

    Order.find().select("product quantity _id ordertime orderStatus")
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
