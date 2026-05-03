const orderModel = require("../../models/orderProductModel");
const userModel = require("../../models/userModel");

const allOrderController = async (request, response) => {
    try {
        const userId = request.userId;

        const user = await userModel.findById(userId);

        if (!user || user.role !== "ADMIN") {
            return response.status(403).json({
                success: false,
                error: true,
                message: "Access denied. Admin only.",
            });
        }

        const allOrders = await orderModel
            .find()
            .sort({ createdAt: -1 });

        return response.status(200).json({
            success: true,
            error: false,
            message: "All Razorpay orders fetched successfully",
            data: allOrders,
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message || "Failed to fetch orders",
        });
    }
};

module.exports = allOrderController;