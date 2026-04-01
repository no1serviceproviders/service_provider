const express = require('express')
const router = express.Router()
const {register,login,logout, verify} = require('../controllers/authController')
const auth = require('../middleware/middleWare')

router.post('/register',register)
router.post('/login',login)
router.get('/verify',auth,verify)
router.post('/logout',logout)

router.get('/dashboard',auth,(req,res)=>
{
    res.json({msg:"welcome user"})
})

module.exports = router;