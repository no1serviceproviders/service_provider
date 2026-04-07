const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { usermodel,paymentModel } = require('../models/Model')
const razorpay = require('../config/razorpay')
const crypto = require('crypto')
require("dotenv").config()


exports.register = async (req, res) => {
  const { username, phone, email, password } = req.body

  try {
    const exist = await newusermodel.findOne({ email })

    if (exist) {
      return res.status(400).json({ msg: "User already exists" })
    }

    const hashpassword = await bcrypt.hash(password, 10)

    await usermodel.create({
      username,
      phone,
      email,
      password: hashpassword
    })

    return res.status(200).json({ msg: "Registered successfully ✅" })

  } catch (err) {
    return res.status(500).json({ msg: "Cannot register ❌" })
  }
}


exports.login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await usermodel.findOne({ email })

    if (!user) {
      return res.status(400).json({ msg: "Email is invalid" })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ msg: "Password is invalid" })
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_KEY,
      { expiresIn: "1d" }   
    )

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path:"/"
    })

    return res.status(200).json({ msg: "Login success",mail:user.email })

  } catch (err) {
    return res.status(500).json({ msg: "Server error",err:err })
  }
}


exports.verify = (req, res) => {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ msg: "No token" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY)

    return res.json({
      msg: "Valid user",
      user: decoded   // ✅ FIX
    })

  } catch {
    return res.status(401).json({ msg: "Invalid token" })
  }
}

exports.profile = async(req,res) => {
  try {
    const user = await usermodel.findById(req.user.id).select("-password")
    res.status(200).json({
      success:true,
      user
    })
  }
  catch(err) {
    res.status(500).json({msg:err.message})
  }
}

// DASHBOARD (FIX: verify token here)
exports.dashboard = (req, res) => {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ msg: "No token" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY)

    return res.json({
      msg: "Dashboard data",
      user: decoded   
    })

  } catch {
    return res.status(401).json({ msg: "Invalid token" })
  }
}

exports.createOrder = async(req, res) => {
  try
  {
    const {amount} = req.body;
    const options = {
      amount:amount*100,
      currency:"INR",
      receipt:"receipt_"+Date.now()
    }
    const order = await razorpay.orders.create(options)
    res.json(order)
  }
  catch(err)
  {
    console.log(err)
    res.status(500).json({error:"failed to create order"})
  }
}

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Save to DB
      await paymentModel.create({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        amount: req.body.amount,
        status: "success",
      });

      return res.json({ success: true });
    } else {
      return res.status(400).json({ success: false });
    }
  } catch (err) {
    res.status(500).json({ error: "Verification failed" });
  }
};

exports.logout = (req, res) => {
  console.log("logout calling")
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path:"/"
  })
  res.json({ msg: "Logged out" })
}
