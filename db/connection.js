const mongoose = require("mongoose");
const DB=process.env.DATABASE;
//const DB='mongodb+srv://geetanjali:Geetanjali_1815@cluster0.n2gzcpm.mongodb.net/Amazonweb?retryWrites=true&w=majority';
mongoose.connect(DB).then(()=>console.log("data base connected")).catch((error)=>console.log("error"+error.message));