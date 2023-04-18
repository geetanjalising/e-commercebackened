require("dotenv").config();
const express = require("express");
const app = express();
const mongoose=require("mongoose");
require("./db/connection");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const path=require('path');

//const port = 8005;
const port = process.env.PORT || 8005;


const Products = require("./model/productsSchema");
const DefaultData=require("./defaultdata");
const cors=require("cors");
const router=require("./routes/router");

//for deployment
// if(process.env.NODE_ENV == "production"){
//     app.use(express.static("client/build"));
// }

app.use(express.json());//We export our data in json format
app.use(cookieParser(""));
app.use(cors());
app.use(router);

//deployment
app.use(express.static(path.join(__dirname,'./client/build')))

app.get('*', function(req,res){
 res.sendFile(path.join(__dirname,'./client/build/index.html'));
});

app.listen(port,()=>{
    console.log(`server is running on port number ${port}`)
});

DefaultData();