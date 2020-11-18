const express=require('express');
const checkAuth = require('./middleware/check-auth');
const router=express.Router();
const OrderController=require('../controller/order_controller')

router.get("/",checkAuth,OrderController.get_all_orders)

router.get("/:orderId",checkAuth,OrderController.get_order_detail_by_id)

router.delete("/:orderId",checkAuth,OrderController.delete_order)

router.post("/",checkAuth,OrderController.create_new_order)

module.exports=router