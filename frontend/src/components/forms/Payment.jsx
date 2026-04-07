import React from 'react'
import instance from '../api/axios'

const Payment = () => {
    
    const payNow = async()=>
    {
        try
        {
            const {data:order} = await instance.post("/api/service/payment/create")
            const options = {
                key:"rzp_test_SWjsMZ52d9oTcb",
                amount:order.amount,
                currency:"INR",
                name:"service providers payment",
                desciption:"₹5",
                order_id:order.id,

                handler:async function (response) {
                    const res = await instance.post("/api/service/payment/verify",response)
                    if(res.data.success)
                    {
                        alert("payment successfull")
                    }
                    else
                    {
                        alert("payment failed")

                    }
                },
                prefill:
                {
                    name:"test user"
                },
                theme:
                {
                    color:"#3399cc"
                }
                
            }
            const rzp = new window.Razorpay(options);
            rzp.open()
        }
        catch
        {
            console.log('error in loading')
        }
    }
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Pay ₹500</h2>
      <button onClick={payNow}>Pay Now</button>
    </div>
  )
}

export default Payment
