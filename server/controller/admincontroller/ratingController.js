const db = require("../../models");
const helper = require("../../helper/helper");
const { Op, Sequelize } = require("sequelize");


db.ratings.belongsTo(db.users, {
    foreignKey: "user_id",
    as: "ratingby",
});
db.ratings.belongsTo(db.bookings, {
    foreignKey: "booking_id",
    as: "ratingbooking",
});
db.bookings.belongsTo(db.products, {
    foreignKey: "product_id",
    as: "ratingproduct"
})


module.exports = {
    ratingList: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || "";
            const offset = (page - 1) * limit;

            let queryOptions = {
                include: [
                    {
                        model: db.users,
                        as: "ratingby",
                        attributes: ['id', 'name', 'email']
                    },
                    {
                        model: db.bookings,
                        as: "ratingbooking",
                        include: [
                            {
                                model: db.products,
                                as: "ratingproduct",
                                attributes: ['id', 'name']
                            },
                        ]
                    },
                ],
                limit,
                offset,
                order: [["id", "DESC"]],
                distinct: true
            };

            if (search) {
                queryOptions.where = {
                    [Op.or]: [
                        Sequelize.where(Sequelize.col('ratingby.name'), 'LIKE', `%${search}%`),
                        Sequelize.where(Sequelize.col('ratingbooking.ratingproduct.name'), 'LIKE', `%${search}%`)
                    ]
                };
            }

            const { count, rows } = await db.ratings.findAndCountAll(queryOptions);

            return helper.success(res, "All rating details", {
                data: rows,
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit),
            });
        } catch (error) {
            console.error("Error in ratingList:", error);
            return helper.error(res, "Something went wrong", error.message);
        }
    },
    ratingDetail: async (req, res) => {
        try {
            const { id } = req.params;
            const rating = await db.ratings.findOne({
                where: { id },
                include: [
                    { model: db.users, as: "ratingby" },
                    {
                        model: db.bookings, as: "ratingbooking",
                        include: [
                            { model: db.products, as: "ratingproduct" },
                        ]
                    },
                ],
            });
            if (!rating) {
                return helper.error(res, "Rating not found");
            }
            return helper.success(res, "Rating details", rating);
        } catch (error) {
            return helper.error(res, "Something went wrong", error.message);
        }
    },
    ratingDelete: async (req, res) => {
        try {
            const { id } = req.params;
            const rating = await db.ratings.findByPk(id);
            if (!rating) {
                return helper.error(res, "Rating not found");
            }
            await db.ratings.destroy({ where: { id } });
            return helper.success(res, "Rating deleted successfully");
        } catch (error) {
            return helper.error(res, "Something went wrong", error.message);
        }
    }

}
