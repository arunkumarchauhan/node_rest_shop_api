const User = require("../routes/models/user_model")
const mongoose = require("mongoose")
const bcrypt=require("bcrypt")
const  jwt=require('jsonwebtoken');

exports.user_signup=(req,res,next)=>{
    User.find({email:req.body.email}).exec()
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
        const  user=User({
                _id:new mongoose.Types.ObjectId(),
                email:req.body.email,
                password:hash})
                user.save()
                .then(result=>{
                   
                    res.status(201)
                    .json({message:"User Created", })
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

exports.user_signin= (req,res,next)=>{
    User.find({email:req.body.email})
    .exec()
    .then(user=>{
        if(user.length<1)
        {
          return  res.status(401).json({ message:"Auth Failed"})
        }
      bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
          if(err)
          {
               return  res.status(401).json({ message:"Auth Failed"  })
          }
          if(result){
              const token= jwt.sign({
                        email:user[0].email,
                        userId:user[0]._id,
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

exports.delete_user=(req,res,next)=>{
    User.remove({_id:req.params.userId})
    .then(result=>{
        res.status(200).json({message:"user deleted"})
    })
    .catch(err=>{
        res.status(500).json(err)
    })
}