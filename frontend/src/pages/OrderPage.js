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