const express = require('express')
const mongoose = require('mongoose')
const cookieparser = require('cookie-parser')
const bcrypt = require('bcryptjs')
const cors = require('cors')
const { newusermodel } = require('./models/Model')
require("dotenv").config()

const app = express()

app.use(express.json())
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials:true
    }
))
app.use(cookieparser())

mongoose.connect(process.env.MONGO_URL)
.then(()=>
{
    console.log("mongo db is connected")
})
.catch((err)=>
{
    console.log("error in db connection",err)
})

app.post('/api/user/login',async(req,res)=>
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
        res.status(200).json({msg:'login'})
    }
    catch
    {
        console.log('error')
    }
})

app.use('/api/user',require('./routes/MemberRegister'))

app.listen(process.env.PORT,()=>
{
    console.log("server is started")
})