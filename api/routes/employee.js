const express = require('express');

const router = express.Router();
const checkAuth = require('./middleware/check-auth');
const EmployeeController=require('../controller/employee_controller')




router.post('/signup', EmployeeController.employee_signup)

router.post('/signin',EmployeeController.employee_signin)

router.delete('/:userId',checkAuth, EmployeeController.delete_employee)

router.patch('/updateOrderStatus',checkAuth,EmployeeController.update_order_status)

router.get('/orders',checkAuth,EmployeeController.get_all_orders)

    module.exports=router