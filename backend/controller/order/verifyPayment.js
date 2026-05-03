const crypto = require("crypto");
const orderModel = require("../../models/orderProductModel");
const addToCartModel = require("../../models/cartProduct");
const userModel = require("../../models/userModel");

const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            cartItems
        } = req.body;

        // Verify payment signature
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                error: true,
                message: "Payment verification failed"
            });
        }

        // Fetch logged-in user
        const user = await userModel.findById(req.userId);

        // Create product details
        const productDetails = cartItems.map(item => ({
            productId: item.productId._id,
            name: item.productId.productName,
            image: item.productId.productImage[0],
            price: item.productId.sellingPrice,
            quantity: item.quantity
        }));

        // Calculate total
        const totalAmount = cartItems.reduce(
            (total, item) =>
                total + item.productId.sellingPrice * item.quantity,
            0
        );

        // Save order
        const newOrder = await orderModel.create({
            userId: req.userId,
            email: user.email,
            productDetails,
            paymentDetails: {
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                signature: razorpay_signature,
                payment_method_type: "Razorpay",
                payment_status: "paid"
            },
            totalAmount
        });

        // Clear cart
        await addToCartModel.deleteMany({ userId: req.userId });

        return res.status(200).json({
            success: true,
            error: false,
            message: "Payment verified successfully",
            data: newOrder
        });

    } catch (error) {
        console.error("Verify Payment Error:", error);
        return res.status(500).json({
            success: false,
            error: true,
            message: error.message
        });
    }
};

module.exports = verifyPayment;