const mongoose = require('mongoose')

const newuserschema = new mongoose.Schema(
    {
        username:String,
        phone:Number,
        email:String,
        password:String
    }
)

const newusermodel = mongoose.model("user",newuserschema,"user")


const paymentschema = new mongoose.Schema(
    {
        orderId:String,
        mail:String,
        service:String,
        paymentId:String,
        amount:Number,
        status:String,
    },{timestamps:true}
)

const paymentModel = mongoose.model("servicepayment",paymentschema,"servicepayment")

module.exports = {newusermodel,paymentModel}