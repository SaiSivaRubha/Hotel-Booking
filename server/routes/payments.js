import express from "express";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";
const router=express.Router();
router.post("/orders",async(req,res)=>{
    try{
        const instance=new Razorpay({
            key_id:process.env.KEY_ID,
            key_secret:process.env.KEY_SECRET
        })
        const options={
            amount:req.body.amount*100,
            currency:"INR",
            receipt:crypto.randomBytes(10).toString("hex")
        }
        instance.orders.create(options,(error,order)=>{
            if(error){ 
                return res.status(500).json({message:"Something went wrong"})
            }
            else{
                return res.status(200).json({order})
            }
        })

    }catch(error){
        return res.status(500).json({message:"Intenal server error"})
    }
})
router.post("/verify",async(req,res)=>{
    try{
        const{
            razorpay_orderID,
            razorpay_paymentID,
            razorpay_signature
        }=req.body
        const sign=razorpay_orderID+"|"+razorpay_paymentID
        const resultSign=crypto.createHmac("sha256",process.env.KEY_SECRET).update(sign.toString()).digest("hex");
        if(razorpay_signature==resultSign){
            return res.status(200).json({message:"Payment verified successfully"})
        }
        else{
            return res.status(500).json({message:"Payment failed"})
        }
       
    }
    catch(error){
        console.log(error);
        res.status(400).json({message:"Internal Server Error"})
    }
})
export default router;
