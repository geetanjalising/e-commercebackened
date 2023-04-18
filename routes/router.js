const express = require("express");
const router = new express.Router();
const Products = require("../model/productsSchema");
const USER = require("../model/userSchema");
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");

//get products api
router.get("/getproducts", async (req, res) => {
    
    try { 
        const productsdata = await Products.find();
        // res.send("console the data"+productsdata);
        //  console.log("api created");
        res.status(201).json(productsdata);
    }     
    catch (error) {
        console.log("error" + error.message);
    }
});


//register(create account) data
router.post("/register", async (req, res) => {
    //console.log(req.body);
    const { fname, email, mobile, password, cpassword } = req.body;
    if (!fname || !email || !mobile || !password || !cpassword) {
        res.status(422).json({ error: "fill all the data" });
        console.log("not data available");
    };

    try {
        const preuser = await USER.findOne({ email: email });
        if (preuser) {
            res.status(422).json({ error: "this user is already present" })
        }
        else if (password !== cpassword) {
            res.status(422).json({ error: "password and cpassword not match" })
        }
        else {
            const finaluser = new USER({
                fname, email, mobile, password, cpassword
            });

            //password hashing process goes here

            const storedata = await finaluser.save();

            console.log(storedata);
            res.status(201).json(storedata);

        }
    }
    catch (error) {

    }
});


//login user api
router.post("/login", async (req, res) => {
    
    const { email, password } = req.body;
    if (!email || !password) {
        req.status(400).json({ error: "fill all the data" })
    };
    try {
          
        const userlogin = await USER.findOne({ email: email });
        console.log(userlogin);
        if (userlogin) {
            
            const isMatch = await bcrypt.compare(password, userlogin.password);
            console.log(isMatch + " password match ");
          
            //token generate
            const token = await userlogin.generateAuthtoken();
            //console.log(token);
            res.cookie("Amazonweb", token, {
                expires: new Date(Date.now() + 9900000),
                httpOnly: true
            })
            
            if (!isMatch) {
                res.status(400).json({ error: "invalid details" })

            }
            else {
                res.status(201).json({ userlogin })
            }
        } else {
            res.status(400).json({ error: "invalid details" });
        }
    }
    catch (error) {
        res.status(400).json({ error: "invalid details" })
    }
})

//get individual data
router.get("/getproductsone/:id", async (req, res) => {
    
    try {
        const { id } = req.params;
        //console.log(id); 
        const individualdata = await Products.findOne({ id: id });
        //console.log(individualdata+"individual data");
        res.status(201).json(individualdata);
    }
    catch (error) {
        res.status(400).json(error);
        // console.log("error"+error.message);
    }
});

//adding the data into cart

router.post("/addcart/:id", authenticate, async (req, res) => {
  
    try {
     
        const { id } = req.params;
        const cart = await Products.findOne({ id: id });
        console.log(cart + "cart value");

        const UserContact = await USER.findOne({_id: req.userID});
        console.log(UserContact);
          
        if(UserContact){    
            const cartData = await UserContact.addcartdata(cart);

            await UserContact.save();
            console.log(cartData);
            res.status(201).json(UserContact);
            //console.log("Usercontact valid");
        }
        else{
            res.status(401).json({error:"invalid user1"});
        }
    } catch (error) {
        res.status(401).json({error:"invalid user2"});

    }
})
   
// get cart details
router.get("/cartdetails", authenticate,async (req,res) => {
    //console.log("router pr a gya");
    try{
       // console.log("try pr a gya");
        const buyuser = await USER.findOne({_id: req.userID});
        //console.log(buyuser + "user hain buy pr");
        await buyuser.save();
        res.status(201).json(buyuser);
        //console.log("buyuser pr a gya");
    }catch(error){
    console.log(error + "error for buynow");
    }  
})

//get valid user
router.get("/validuser", authenticate,async (req,res) => {
    try{
        const validuserone = await USER.findOne({_id: req.userID});
       // await buyuser.save();
        res.status(201).json(validuserone);
     }catch(error){
    console.log(error + "error for buynow");
    }  
})

//remove item from cart
router.delete("/remove/:id", authenticate,async (req,res) => {
    try{
       const {id}=req.params;

       req.rootUser.carts = req.rootUser.carts.filter((currval)=>{
        return currval.id!=id;
       });

       req.rootUser.save();
       res.status(201).json(req.rootUser);
       console.log("item remove");
     }catch(error){
    console.log(error + "error");
    res.status(400).json(error);
    }  
})

//for user logout

router.get("/logout", authenticate, async (req, res) => {
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
            return curelem.token !== req.token
        });

        res.clearCookie("Amazonweb", { path: "/" });
        req.rootUser.save();
        res.status(201).json(req.rootUser.tokens);
        console.log("user logout");

    } catch (error) {
        console.log(error + "jwt provide then logout");
    }
});
module.exports = router;

  