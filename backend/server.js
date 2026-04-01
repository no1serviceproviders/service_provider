const express = require('express')
const mongoose = require('mongoose')
const cookieparser = require('cookie-parser')
const cors = require('cors')
const payment = require('./routes/paymentRoute')
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


app.use('/api/user',require('./routes/MemberRegister'))
app.use('/api/service/payment',require('./routes/paymentRoute'))

app.listen(process.env.PORT,()=>
{
    console.log("server is started")
})