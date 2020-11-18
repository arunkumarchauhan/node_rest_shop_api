const express = require('express');

const router = express.Router();
const checkAuth = require('./middleware/check-auth');
const UserController=require('../controller/user_cotroller')

router.post('/signup', UserController.user_signup)

router.post('/signin',UserController.user_signin)

router.delete('/:userId',checkAuth, UserController.delete_user)


module.exports=router