const express = require('express')
const mongoose = require('mongoose')
const cookieparser = require('cookie-parser')
const cors = require('cors')
require("dotenv").config()

const app = express()

app.use(express.json())
app.use(cors(
    {
        origin: "https://service-provider-henna.vercel.app",
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


app.use('/api',require('./routes/routes'))

app.listen(process.env.PORT,()=>
{
    console.log("server is started")
})
