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