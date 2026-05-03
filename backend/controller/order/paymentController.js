// const razorpay = require("../../config/Razorpay");
// const userModel = require("../../models/userModel");

// const paymentController = async (request, response) => {
//     try {
//         const { cartItems } = request.body;

//         const user = await userModel.findOne({
//             _id: request.userId,
//         });

//         const totalAmount = cartItems.reduce((total, item) => {
//             return total + item.productId.sellingPrice * item.quantity;
//         }, 0);

//         const options = {
//             amount: totalAmount * 100, // Amount in paise
//             currency: "INR",
//             receipt: `receipt_${Date.now()}`,
//             notes: {
//                 userId: request.userId,
//                 customerName: user.name,
//                 customerEmail: user.email,
//                 products: JSON.stringify(
//                     cartItems.map((item) => {
//                         return {
//                             productId: item.productId._id,
//                             productName: item.productId.productName,
//                             price: item.productId.sellingPrice,
//                             quantity: item.quantity,
//                             image: item.productId.productImage[0],
//                         };
//                     })
//                 ),
//             },
//         };

//         const order = await razorpay.orders.create(options);

//         return response.status(200).json({
//             success: true,
//             error: false,
//             message: "Razorpay order created successfully",
//             key: process.env.RAZORPAY_KEY_ID,
//             order,
//             user: {
//                 name: user.name,
//                 email: user.email,
//                 contact: user.mobile || "",
//             },
//         });
//     } catch (error) {
//         return response.status(500).json({
//             message: error?.message || error,
//             error: true,
//             success: false,
//         });
//     }
// };

// module.exports = paymentController;


// const Razorpay = require("razorpay");
// const userModel = require("../../models/userModel");

// const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// const paymentController = async (req, res) => {
//     try {
//         const { cartItems } = req.body;

//         if (!cartItems || cartItems.length === 0) {
//             return res.status(400).json({
//                 message: "Cart is empty",
//                 success: false,
//             });
//         }

//         const user = await userModel.findById(req.userId);

//         const totalAmount = cartItems.reduce((total, item) => {
//             return total + (
//                 item.quantity * item.productId.sellingPrice
//             );
//         }, 0);

//         const options = {
//             amount: totalAmount * 100, // paise
//             currency: "INR",
//             receipt: `receipt_${Date.now()}`,
//         };

//         const order = await razorpay.orders.create(options);

//         res.status(200).json({
//             success: true,
//             order,
//             user,
//             key: process.env.RAZORPAY_KEY_ID,
//         });

//     } catch (error) {
//         console.error("Razorpay Checkout Error:", error);

//         res.status(500).json({
//             message: error.message,
//             success: false,
//             error: true,
//         });
//     }
// };

// module.exports = paymentController;

const Razorpay = require("razorpay");
const userModel = require("../../models/userModel");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const paymentController = async (req, res) => {
    try {
        const { cartItems } = req.body;

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({
                message: "Cart is empty",
                success: false,
            });
        }

        const user = await userModel.findById(req.userId);

        const totalAmount = cartItems.reduce((total, item) => {
            return total + item.quantity * item.productId.sellingPrice;
        }, 0);

        const options = {
            amount: totalAmount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: {
                userId: req.userId,
                email: user.email,
            },
        };

        const order = await razorpay.orders.create(options);

        return res.status(200).json({
            success: true,
            message: "Order created successfully",
            order,
            user: {
                name: user.name,
                email: user.email,
            },
            key: process.env.RAZORPAY_KEY_ID,
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        });
    } catch (error) {
        console.error("Razorpay Error:", error);

        return res.status(500).json({
            message: error.message || "Payment initialization failed",
            success: false,
            error: true,
        });
    }
};

module.exports = paymentController;