const orderModel = require("../../models/orderProductModel");

const orderController = async (request, response) => {
    try {
        const currentUserId = request.userId;

        const orderList = await orderModel
            .find({ userId: currentUserId })
            .sort({ createdAt: -1 });

        return response.status(200).json({
            success: true,
            error: false,
            message: "Razorpay order list fetched successfully",
            data: orderList,
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || "Unable to fetch orders",
        });
    }
};

module.exports = orderController;