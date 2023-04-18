const productdata=require("./constant/productdata");
const Products=require("./model/productsSchema");

const DefaultData=async()=>{
    // const storeData=await Products.insertMany(productdata);
    // console.log(storeData);
    // console.log("Hello World");
    try{
      await Products.deleteMany({});
      const storeData=await Products.insertMany(productdata);
      console.log(storeData);
      
    } catch(error){
      console.log("error"+error.message);
    }
    
};

module.exports=DefaultData;