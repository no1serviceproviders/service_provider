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


const servicepaymentschema = new mongoose.Schema(
    {
        orderId: String,
        paymentId: String,
        amount: Number,
        status: String,
        createdAt: {
            type: Date,
            default: Date.now,
        }
    }
)

const servicepaymentmodel = mongoose.model("servicepayment",servicepaymentschema,"servicepayment")

module.exports = {newusermodel,servicepaymentmodel}