const crypto = require("crypto");
const orderModel = require("../../models/orderProductModel");
const addToCartModel = require("../../models/cartProduct");

const verifyPayment = async (request, response) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            cartItems,
        } = request.body;

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return response.status(400).json({
                success: false,
                error: true,
                message: "Invalid payment signature",
            });
        }

        const productDetails = cartItems.map((item) => {
            return {
                productId: item.productId._id,
                name: item.productId.productName,
                price: item.productId.sellingPrice,
                quantity: item.quantity,
                image: item.productId.productImage,
            };
        });

        const totalAmount = cartItems.reduce((total, item) => {
            return total + item.productId.sellingPrice * item.quantity;
        }, 0);

        const orderDetails = {
            productDetails,
            email: request.user?.email || "",
            userId: request.userId,
            paymentDetails: {
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                payment_status: "paid",
                payment_method_type: "Razorpay",
                signature: razorpay_signature,
            },
            totalAmount,
        };

        const order = new orderModel(orderDetails);
        const saveOrder = await order.save();

        if (saveOrder?._id) {
            await addToCartModel.deleteMany({
                userId: request.userId,
            });
        }

        return response.status(200).json({
            success: true,
            error: false,
            message: "Payment verified and order placed successfully",
            data: saveOrder,
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || "Payment verification failed",
        });
    }
};

module.exports = verifyPayment;