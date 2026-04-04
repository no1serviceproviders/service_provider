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
            console.log(email,password)
            const exist = await newusermodel.findOne({email:email})
            console.log(exist)
            if(!exist)
            {
                console.log('no mail')
                return res.status(400).json({msg:"mail is invalid"})
            }
            const passwordverify = await bcrypt.compare(password,exist.password)
            if(!passwordverify)
            {
                console.log('mismatch')
                return res.status(401).json({msg:"password is invalid"})
            }
            const token = jwt.sign(
                {id:exist._id},
                process.env.JWT_KEY,
            )
            res.cookie("token",token,
                {
                    httpOnly:true,
                    secure:false,
                    sameSite:"strict",
                }
            )
            res.status(200).json({msg:'login'})
        }
        catch
        {
            console.log('error')
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