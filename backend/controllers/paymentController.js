const razorpay = require('../config/config')
const crypto = require('crypto')
const {servicepaymentmodel} = require('../models/Model')

const amount = 50000

exports.createOrder = async(req,res)=>
{
  console.log("CREATE ORDER API HIT");
    try
    {
        const order = await razorpay.orders.create(
            {
                amount:amount,
                currency:"INR",
                receipt:"receipt_"+Date.now(),
            }
        )
        res.json(order)
    }
    catch(err){
        console.log('errror in payment')
        res.status(500).json({error:err.message})
    }
}

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      await servicepaymentmodel.create({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        amount: FIXED_AMOUNT / 100,
        status: "Success",
      });

      res.json({ success: true });
    } else {
      res.status(400).json({ success: false });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};