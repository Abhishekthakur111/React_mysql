const db = require("../../models");
const helper = require("../../helper/helper");
const { Op } = require("sequelize");


db.bookings.belongsTo(db.users, {
    foreignKey: "user_id",
    as: "user",
});
db.bookings.belongsTo(db.products, {
    foreignKey: "product_id",
    as: "products",
});
db.products.hasMany(db.productImages, {
    foreignKey: "product_id",
    as: "productImagess",
});
db.products.belongsTo(db.categories, {
    foreignKey: "category_id",
    as: "cat"
})

module.exports = {
    bookinglist: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const search = req.query.search ? req.query.search.trim() : "";

            let whereClause = {};
            if (search) {
                whereClause = {
                    [Op.or]: [
                        { "$user.name$": { [Op.like]: `%${search}%` } },
                        { "$products.name$": { [Op.like]: `%${search}%` } },
                        { price: { [Op.like]: `%${search}%` } },
                    ],
                };
            }

            const { count, rows } = await db.bookings.findAndCountAll({
                include: [
                    { model: db.users, as: "user" },
                    {
                        model: db.products,
                        as: "products",
                        include: [
                            { model: db.productImages, as: "productImagess" },
                            { model: db.categories, as: "cat" },
                        ],
                    },
                ],
                where: whereClause,
                subQuery: false,   
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
                    {
                        model: db.products, as: "products",
                        include: [
                            { model: db.productImages, as: "productImagess" },
                            { model: db.categories, as: "cat" },
                        ]
                    },
                ],
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
