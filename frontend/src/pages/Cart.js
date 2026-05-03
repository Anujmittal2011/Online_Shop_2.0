import React, { useContext, useEffect, useState } from 'react'
import SummaryApi from '../common'
import Context from '../context'
import displayINRCurrency from '../helpers/displayCurrency'
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
// import {loadStripe} from '@stripe/stripe-js';

const Cart = () => {
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(false)
    const context = useContext(Context)
    const navigate = useNavigate();
    const loadingCart = new Array(4).fill(null)


    const fetchData = async() =>{
        
        const response = await fetch(SummaryApi.addToCartProductView.url,{
            method : SummaryApi.addToCartProductView.method,
            credentials : 'include',
            headers : {
                "content-type" : 'application/json'
            },
        })
       

        const responseData = await response.json()

        if(responseData.success){
            setData(responseData.data)
        }


    }

    const handleLoading = async() =>{
        await fetchData()
    }

    useEffect(()=>{
        setLoading(true)
        handleLoading()
         setLoading(false)
    },[])


    const increaseQty = async(id,qty) =>{
        const response = await fetch(SummaryApi.updateCartProduct.url,{
            method : SummaryApi.updateCartProduct.method,
            credentials : 'include',
            headers : {
                "content-type" : 'application/json'
            },
            body : JSON.stringify(
                {   
                    _id : id,
                    quantity : qty + 1
                }
            )
        })

        const responseData = await response.json()


        if(responseData.success){
            fetchData()
        }
    }


    const decraseQty = async(id,qty) =>{
       if(qty >= 2){
            const response = await fetch(SummaryApi.updateCartProduct.url,{
                method : SummaryApi.updateCartProduct.method,
                credentials : 'include',
                headers : {
                    "content-type" : 'application/json'
                },
                body : JSON.stringify(
                    {   
                        _id : id,
                        quantity : qty - 1
                    }
                )
            })

            const responseData = await response.json()


            if(responseData.success){
                fetchData()
            }
        }
    }

    const deleteCartProduct = async(id)=>{
        const response = await fetch(SummaryApi.deleteCartProduct.url,{
            method : SummaryApi.deleteCartProduct.method,
            credentials : 'include',
            headers : {
                "content-type" : 'application/json'
            },
            body : JSON.stringify(
                {   
                    _id : id,
                }
            )
        })

        const responseData = await response.json()

        if(responseData.success){
            fetchData()
            context.fetchUserAddToCart()
        }
    }

   

    // const handlePayment = async () => {
    // try {
    //     const response = await fetch(SummaryApi.payment.url, {
    //         method: SummaryApi.payment.method,
    //         credentials: "include",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //             cartItems: data,
    //         }),
    //     });

    //     const responseData = await response.json();

    //     if (!responseData.success) {
    //         alert(responseData.message || "Unable to create order");
    //         return;
    //     }

    //     const options = {
    //         key: responseData.key,
    //         amount: responseData.order.amount,
    //         currency: responseData.order.currency,
    //         name: "Online Shop",
    //         description: "Complete Your Purchase",
    //         image: "/logo192.png",
    //         order_id: responseData.order.id,

    //         handler: async function (paymentResponse) {
    //             const verifyResponse = await fetch(
    //                 SummaryApi.verifyPayment.url,
    //                 {
    //                     method: "POST",
    //                     credentials: "include",
    //                     headers: {
    //                         "Content-Type": "application/json",
    //                     },
    //                     body: JSON.stringify({
    //                         ...paymentResponse,
    //                         cartItems: data,
    //                     }),
    //                 }
    //             );

    //             const verifyData = await verifyResponse.json();

    //             if (verifyData.success) {
    //                 alert("Payment Successful!");
    //                 fetchData();
    //                 context.fetchUserAddToCart();
    //                 window.location.href = "/success";
    //             } else {
    //                 alert("Payment Verification Failed!");
    //             }
    //         },

    //         prefill: {
    //             name: responseData.user?.name || "",
    //             email: responseData.user?.email || "",
    //             contact: responseData.user?.phone || "",
    //         },

    //         notes: {
    //             address: "Online Shop Order",
    //         },

    //         theme: {
    //             color: "#2563eb",
    //         },

    //         modal: {
    //             ondismiss: function () {
    //                 console.log("Payment popup closed");
    //             },
    //         },
    //     };

    //     const razorpay = new window.Razorpay(options);
    //     razorpay.open();

    // } catch (error) {
    //     console.error("Razorpay Error:", error);
    //     alert("Payment Failed. Please try again.");
    // }
    // };


    // Add this function above handlePayment
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";

            script.onload = () => {
                resolve(true);
            };

            script.onerror = () => {
                resolve(false);
            };

            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        try {
            // Load Razorpay SDK
            const isLoaded = await loadRazorpayScript();

            if (!isLoaded) {
                alert("Razorpay SDK failed to load.");
                return;
            }

            const response = await fetch(SummaryApi.payment.url, {
                method: SummaryApi.payment.method,
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    cartItems: data,
                }),
            });

            const responseData = await response.json();

            if (!responseData.success) {
                alert(responseData.message || "Payment failed");
                return;
            }

            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: responseData.order.amount,
                currency: responseData.order.currency,
                name: "Online Shop",
                description: "Order Payment",
                image: "https://cdn.razorpay.com/logos/GhRQcyean79PqE_medium.png",
                order_id: responseData.order.id,

    //             handler: async function (paymentResponse) {
    
    // console.log("Payment Successful:", paymentResponse);

    // try {
    //     // Clear cart data from backend
    //     for (const item of data) {
    //         await fetch(SummaryApi.deleteCartProduct.url, {
    //             method: SummaryApi.deleteCartProduct.method,
    //             credentials: "include",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 _id: item._id,
    //             }),
    //         });
    //     }

    //     // Refresh cart
    //     await fetchData();
    //     await context.fetchUserAddToCart();

    //     // Redirect to success page
    //     navigate("/success");
    // } catch (error) {
    //     console.error("Post-payment error:", error);

    //     // Even if cart clearing fails, payment was successful
    //     navigate("/success");
    // }
    //             },



                handler: async function (response) {
                    try {
                        const verifyResponse = await fetch(
                            SummaryApi.verifyPayment.url,
                            {
                                method: SummaryApi.verifyPayment.method,
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                credentials: "include",
                                body: JSON.stringify({
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                    cartItems: data
                                }),
                            }
                        );

                        const verifyData = await verifyResponse.json();

                        if (verifyData.success) {
                            fetchData();
                            context.fetchUserAddToCart();
                            navigate("/success");
                        } else {
                            navigate("/cancel");
                        }

                    } catch (error) {
                        console.error("Payment Verification Error:", error);
                        navigate("/cancel");
                    }
                },
                modal: {
                    ondismiss: function () {
                        navigate("/cancel");
                    },
                },
                prefill: {
                    name: responseData.user?.name || "",
                    email: responseData.user?.email || "",
                    contact: responseData.user?.phone || "",
                },

                notes: {
                    address: "Online Shop Purchase",
                },

                theme: {
                    color: "#dc2626",
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error("Razorpay Error:", error);
            alert("Something went wrong. Please try again.");
        }
    };

    const totalQty = data.reduce((previousValue,currentValue)=> previousValue + currentValue.quantity,0)
    const totalPrice = data.reduce((preve,curr)=> preve + (curr.quantity * curr?.productId?.sellingPrice) ,0)
  return (
    <div className='container mx-auto'>
        
        <div className='text-center text-lg my-3'>
            {
                data.length === 0 && !loading && (
                    <p className='bg-white py-5'>No Data</p>
                )
            }
        </div>

        <div className='flex flex-col lg:flex-row gap-10 lg:justify-between p-4'>   
                {/***view product */}
                <div className='w-full max-w-3xl'>
                    {
                        loading ? (
                            loadingCart?.map((el,index) => {
                                return(
                                    <div key={el+"Add To Cart Loading"+index} className='w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded'>
                                    </div>
                                )
                            })
                             
                        ) : (
                          data.map((product,index)=>{
                           return(
                            <div key={product?._id+"Add To Cart Loading"} className='w-full bg-white h-32 my-2 border border-slate-300  rounded grid grid-cols-[128px,1fr]'>
                                <div className='w-32 h-32 bg-slate-200'>
                                    <img src={product?.productId?.productImage[0]} className='w-full h-full object-scale-down mix-blend-multiply' />
                                </div>
                                <div className='px-4 py-2 relative'>
                                    {/**delete product */}
                                    <div className='absolute right-0 text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer' onClick={()=>deleteCartProduct(product?._id)}>
                                        <MdDelete/>
                                    </div>

                                    <h2 className='text-lg lg:text-xl text-ellipsis line-clamp-1'>{product?.productId?.productName}</h2>
                                    <p className='capitalize text-slate-500'>{product?.productId.category}</p>
                                    <div className='flex items-center justify-between'>
                                            <p className='text-red-600 font-medium text-lg'>{displayINRCurrency(product?.productId?.sellingPrice)}</p>
                                            <p className='text-slate-600 font-semibold text-lg'>{displayINRCurrency(product?.productId?.sellingPrice  * product?.quantity)}</p>
                                    </div>
                                    <div className='flex items-center gap-3 mt-1'>
                                        <button className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded ' onClick={()=>decraseQty(product?._id,product?.quantity)}>-</button>
                                        <span>{product?.quantity}</span>
                                        <button className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded ' onClick={()=>increaseQty(product?._id,product?.quantity)}>+</button>
                                    </div>
                                </div>    
                            </div>
                           )
                          })
                        )
                    }
                </div>


                {/***summary  */}
                {
                    data[0] && (
                        <div className='mt-5 lg:mt-0 w-full max-w-sm'>
                        {
                            loading ? (
                            <div className='h-36 bg-slate-200 border border-slate-300 animate-pulse'>
                                
                            </div>
                            ) : (
                                <div className='h-36 bg-white'>
                                    <h2 className='text-white bg-red-600 px-4 py-1'>Summary</h2>
                                    <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                                        <p>Quantity</p>
                                        <p>{totalQty}</p>
                                    </div>

                                    <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                                        <p>Total Price</p>
                                        <p>{displayINRCurrency(totalPrice)}</p>    
                                    </div>

                                    <button className='bg-blue-600 p-2 text-white w-full mt-2' onClick={handlePayment}>Payment</button>

                                </div>
                            )
                        }
                        </div>
                    )
                }
                
        </div>
    </div>
  )
}

export default Cart



