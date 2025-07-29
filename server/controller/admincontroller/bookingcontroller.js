const db = require("../../models");
const helper = require("../../helper/helper");

db.bookings.belongsTo(db.users, {
    foreignKey: "user_id",
    as: "user",
});
db.bookings.belongsTo(db.subcategories, {
    foreignKey: "subcategory_id",
    as: "subCategory",
});
db.bookings.belongsTo(db.categories, {
    foreignKey: "category_id",
    as: "category",
});

module.exports = {
    bookinglist: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const { count, rows } = await db.bookings.findAndCountAll({
                include: [
                    { model: db.users, as: "user" },
                    { model: db.subcategories, as: "subCategory" },
                    { model: db.categories, as: "category" }
                ],
                limit,
                offset,
                order: [["id", "DESC"]],
            });
            return helper.success(res, "All booking details", {
                data: rows,
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit),
            });
        } catch (error) {
            return helper.error(res, "Something went wrong", error.message);
        }
    },
    bookingDetail: async (req, res) => {
        try {
            const booking = await db.bookings.findByPk(req.params.id, {
                include: [
                    { model: db.users, as: "user" },
                    { model: db.subcategories, as: "subCategory" },
                    { model: db.categories, as: "category" }
                ]
            });
            return helper.success(res, "Booking retrieved successfully", { data: booking });
        } catch (error) {
            return helper.error(res, "Something went wrong", error.message);
        }
    },
    updateBookingStatus: async (req, res) => {
        try {
            const { id, status } = req.body;
            const updatedBooking = await db.bookings.update(
                { status },
                { where: { id } }
            );
            return helper.success(res, "Booking status updated successfully");
        } catch (error) {
            return helper.error(res, "Something went wrong", error.message);
        }
    },
    bookingDelete: async (req, res) => {
        try {
            const { id } = req.params;
            const deletedBooking = await db.bookings.destroy({ where: { id } });
            return helper.success(res, "Booking deleted successfully");
        } catch (error) {
            return helper.error(res, "Something went wrong", error.message);
        }
    }
};
