// const jwt = require('jsonwebtoken')
// const bcrypt = require('bcryptjs')
// const {newusermodel} = require('../models/Model')
// require("dotenv").config()

// exports.register=async(req,res)=>
// {
//     const {username,phone,email,password} = req.body
//     try
//     {
//         const exist = await newusermodel.findOne({email:email})
//         if(exist)
//         {
//             console.log('exist')
//             return res.status(400).json({msg:"user already exist"})
//         }
//         const hashpassword = await bcrypt.hash(password,10)
//         await newusermodel.create({
//             username:username,phone:phone,email:email,password:hashpassword
//         })
//         console.log('saved')
//         res.json({msg:"registered successfully"})
//         res.status(200)
//     }
//     catch
//     {
//         res.status(500).json({msg:"can not register"})
//     }
// }

// exports.login=async(req,res)=>
// {
//     const {email,password} = req.body
//         try
//         {
//             console.log(email,password)
//             const user = await newusermodel.findOne({email:email})
//             console.log(user)
//             if(!user)
//             {
//                 console.log('no mail')
//                 return res.status(400).json({msg:"mail is invalid"})
//             }
//             const passwordverify = await bcrypt.compare(password,user.password)
//             if(!passwordverify)
//             {
//                 console.log('mismatch')
//                 return res.status(401).json({msg:"password is invalid"})
//             }
//             const token = jwt.sign(
//                 {id:user._id},
//                 process.env.JWT_KEY,
//             )
//             res.cookie("token",token,
//                 {
//                     httpOnly:true,
//                     secure:false,
//                     sameSite:"strict",
//                 }
//             )
//             res.status(200).json({msg:'login'})
//         }
//         catch
//         {
//             console.log('error')
//         }
// }

// exports.verify=(req,res)=>
// {
//     res.json({success:true,user:req.data})
// }

// exports.logout=(req,res)=>
// {
//     res.clearCookie("token")
//     res.json({ msg: "Logged out" });
// }

// exports.dashboard=(req,res)=>
// {
//     res.json(
//         {
//             msg:"dashboard",
//             user:req.user
//         }
//     )
// }

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { newusermodel,paymentModel } = require('../models/Model')
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

    await newusermodel.create({
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
    const user = await newusermodel.findOne({ email })

    if (!user) {
      return res.status(400).json({ msg: "Email is invalid ❌" })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ msg: "Password is invalid ❌" })
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_KEY
    )

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None"
    })

    return res.status(200).json({ msg: "Login success ✅" })

  } catch (err) {
    return res.status(500).json({ msg: "Server error ❌" })
  }
}


exports.verify = (req, res) => {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ msg: "No token" })
  }

  try {
    jwt.verify(token, process.env.JWT_KEY)
    res.json({ msg: "Valid user" })
  } catch {
    res.status(401).json({ msg: "Invalid token" })
  }
}


exports.logout = (req, res) => {
  res.clearCookie("token",{
    httpOnly: true,
    secure: true,
    sameSite: "None"
  })
  res.json({ msg: "Logged out" })
}


exports.dashboard = (req, res) => {
  res.json({
    msg: "Dashboard data",
    user: req.user
  })
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
