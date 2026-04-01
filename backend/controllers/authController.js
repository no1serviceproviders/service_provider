const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {newusermodel} = require('../models/Model')
require("dotenv").config()

exports.register=async(req,res)=>
{
    const {username,phone,email,password} = req.body
    try
    {
        const exist = await newusermodel.findOne({email:email})
        if(exist)
        {
            console.log('exist')
            return res.status(400).json({msg:"user already exist"})
        }
        const hashpassword = await bcrypt.hash(password,10)
        await newusermodel.create({
            username:username,phone:phone,email:email,password:hashpassword
        })
        console.log('saved')
        res.json({msg:"registered successfully"})
        res.status(200)
    }
    catch
    {
        res.status(500).json({msg:"can not register"})
    }
}

exports.login=async(req,res)=>
{
    const {email,password} = req.body
    try
    {
        const data = await newusermodel.findOne({email:email})
        if(!data) return res.status(400).json({msg:"user not found"})
        const match = await bcrypt.compare(password,data.password) 
        if(!match) return res.status(402).json({msg:"invalid password"})
        
        const token = jwt.sign(
            {id:data._id},
            process.env.JWT_KEY,
            {expiresIn:"1hr"}
        )
        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"Strict",
            maxAge:60*60*1000
        })
        res.status(200).json({msg:"log in successfully"})
    }
    catch
    {
        res.status(500).json({msg:"can not login"})
    }
}

exports.verify=(req,res)=>
{
    res.json({success:true,user:req.data})
}

exports.logout=(req,res)=>
{
    res.clearCookie("token")
    res.json({ msg: "Logged out" });
}