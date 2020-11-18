
const http= require('http');
const app= require('./app');

const port=  process.env.port || 3000;
const server =http.createServer(app);
const mongoose=require('mongoose')

server.listen(port,()=>{

    console.log("Server Started ...");
});

const url="mongodb://localhost:27017/shop_db"
mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true},err => err?console.log(err):console.log('Successfully connected to MongoDB'))
const con=mongoose.connection

con.on('open',()=>{console.log("connected ...")})