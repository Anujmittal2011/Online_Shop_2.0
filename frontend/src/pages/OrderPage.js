// import React, { useEffect, useState } from 'react'
// import SummaryApi from '../common'
// import moment from 'moment'
// import displayINRCurrency from '../helpers/displayCurrency'

// const OrderPage = () => {
//   const [data,setData] = useState([])

//   const fetchOrderDetails = async()=>{
//     const response = await fetch(SummaryApi.getOrder.url,{
//       method : SummaryApi.getOrder.method,
//       credentials : 'include'
//     })

//     const responseData = await response.json()

//     setData(responseData.data)
//     console.log("order list",responseData)
//   }

//   useEffect(()=>{
//     fetchOrderDetails()
//   },[])

//   return (
//     <div>
//       {
//          !data[0] && (
//           <p>No Order available</p>
//          )
//       }

//       <div className='p-4 w-full'>
//           {
//             data.map((item,index)=>{
//               return(
//                 <div key={item.userId+index}>
//                    <p className='font-medium text-lg '>{moment(item.createdAt).format('LL')}</p> 
//                    <div className='border rounded'>
//                         <div className='flex flex-col lg:flex-row justify-between'>
//                             <div className='grid gap-1'>
//                               {
//                                 item?.productDetails.map((product,index)=>{
//                                   return(
//                                     <div key={product.productId+index} className='flex  gap-3 bg-slate-100'>
//                                         <img 
//                                           src={product.image[0]}
//                                           className='w-28 h-28 bg-slate-200 object-scale-down p-2'
//                                         />
//                                         <div>
//                                           <div className='font-medium text-lg text-ellipsis line-clamp-1'>{product.name}</div>
//                                           <div className='flex items-center gap-5 mt-1'>
//                                             <div className='text-lg text-red-500'>{displayINRCurrency(product.price)}</div>
//                                             <p>Quantity : {product.quantity}</p>
//                                           </div>
//                                         </div>
//                                     </div>
//                                   )
//                                 })
//                               }
//                             </div>
//                             <div className='flex flex-col gap-4 p-2 min-w-[300px]'>
//                               <div>
//                                   <div className='text-lg font-medium'>Payment Details : </div>
//                                   <p className=' ml-1'>Payment method : {item.paymentDetails.payment_method_type[0]}</p>
//                                   <p className=' ml-1'>Payment Status : {item.paymentDetails.payment_status}</p>
//                               </div>
//                               <div>
//                                 <div className='text-lg font-medium'>Shipping Details :</div>
//                                 {
//                                   item.shipping_options.map((shipping,index)=>{
//                                     return(
//                                       <div key={shipping.shipping_rate} className=' ml-1'>
//                                         Shipping Amount : {shipping.shipping_amount}
//                                       </div>
//                                     )
//                                   })                      
//                                 }
//                               </div>
//                             </div>
//                         </div>

//                       <div className='font-semibold ml-auto w-fit lg:text-lg'>
//                         Total Amount : {item.totalAmount}
//                       </div>
//                    </div>
//                 </div>
//               )
//             })
//           }
//       </div>
//     </div>
//   )
// }

// export default OrderPage




import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import moment from 'moment';
import displayINRCurrency from '../helpers/displayCurrency';

const OrderPage = () => {
    const [data, setData] = useState([]);

    const fetchOrderDetails = async () => {
        try {
            const response = await fetch(
                SummaryApi.orderProduct.url, // Correct API
                {
                    method: SummaryApi.orderProduct.method,
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            const responseData = await response.json();

            if (responseData.success) {
                setData(responseData.data);
            }

            console.log("Order Data:", responseData);
        } catch (error) {
            console.error("Order Fetch Error:", error);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, []);

    return (
        <div className='container mx-auto p-4'>
            {!data.length && (
                <p className='text-center text-lg'>No Orders Available</p>
            )}

            <div className='space-y-6'>
                {data.map((item, index) => (
                    <div
                        key={item._id || index}
                        className='border rounded-lg shadow-md p-4 bg-white'
                    >
                        <p className='font-semibold text-lg mb-4'>
                            Order Date: {moment(item.createdAt).format('LL')}
                        </p>

                        <div className='space-y-4'>
                            {item.productDetails.map((product, i) => (
                                <div
                                    key={product.productId || i}
                                    className='flex gap-4 bg-slate-50 p-4 rounded'
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className='w-24 h-24 object-contain bg-slate-200 rounded'
                                    />

                                    <div className='flex-1'>
                                        <h3 className='font-medium text-lg'>
                                            {product.name}
                                        </h3>

                                        <div className='flex gap-6 mt-2'>
                                            <span className='text-red-600 font-semibold'>
                                                {displayINRCurrency(product.price)}
                                            </span>

                                            <span>
                                                Quantity: {product.quantity}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className='mt-6 grid md:grid-cols-2 gap-6 border-t pt-4'>
                            <div>
                                <h3 className='font-semibold text-lg mb-2'>
                                    Payment Details
                                </h3>
                                <p>
                                    Method: {item.paymentDetails?.payment_method_type}
                                </p>
                                <p>
                                    Status: {item.paymentDetails?.payment_status}
                                </p>
                                <p>
                                    Payment ID: {item.paymentDetails?.paymentId}
                                </p>
                            </div>

                            <div className='text-right'>
                                <h3 className='font-semibold text-xl'>
                                    Total Amount
                                </h3>
                                <p className='text-2xl text-green-600 font-bold mt-2'>
                                    {displayINRCurrency(item.totalAmount)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderPage;