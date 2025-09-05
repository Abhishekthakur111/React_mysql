const db = require("../../models");
const helper = require("../../helper/helper");
const { Op, Sequelize } = require("sequelize");

db.transactions.belongsTo(db.users, { as: "userr", foreignKey: "user_id" });
db.transactions.belongsTo(db.users, { as: "lenderr", foreignKey: "lender_id" });
db.transactions.belongsTo(db.bookings, { as: "booking", foreignKey: "booking_id" });
db.bookings.belongsTo(db.products, { as: "productss", foreignKey: "product_id" });
db.products.belongsTo(db.categories, { as: "cate", foreignKey: "category_id" });
db.products.hasMany(db.productImages, { as: "prodimage", foreignKey: "product_id" });


module.exports = {
    transactionList: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const search = req.query.search ? req.query.search.trim() : "";

            let whereClause = {};
            if (search) {
                whereClause = {
                    [Op.or]: [
                        { "$userr.name$": { [Op.like]: `%${search}%` } },
                        { "$lenderr.name$": { [Op.like]: `%${search}%` } },
                        { "$booking.productss.name$": { [Op.like]: `%${search}%` } },
                    ],
                };
            }

            const { count, rows } = await db.transactions.findAndCountAll({
                include: [
                    { model: db.users, as: "userr" },
                    { model: db.users, as: "lenderr" },
                    {
                        model: db.bookings,
                        as: "booking",
                        include: [
                            {
                                model: db.products,
                                as: "productss",
                                include: [
                                    { model: db.productImages, as: "prodimage" },
                                    { model: db.categories, as: "cate" },
                                ],
                            },
                        ],
                    },
                ],
                where: whereClause,
                subQuery: false, 
                limit,
                offset,
                order: [["id", "DESC"]],
            });

            return helper.success(res, "All transactions Details", {
                data: rows,
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit),
            });
        } catch (error) {
            return helper.error(res, error.message);
        }
    },
    transactionDetail: async (req, res) => {
        try {
            let transaction = await db.transactions.findOne({
                where: { id: req.params.id },
                include: [
                    { model: db.users, as: "userr", },
                    { model: db.users, as: "lenderr" },
                    {
                        model: db.bookings, as: "booking",
                        include: [
                            {
                                model: db.products, as: "productss",
                                include: [
                                    { model: db.productImages, as: "prodimage" },
                                    { model: db.categories, as: "cate" }
                                ]
                            }
                        ],
                    },
                ],
            });
            return helper.success(res, "data", transaction);
        } catch (error) {
            return helper.error(res, error.message);
        }
    },
    transactionDelete: async (req, res) => {
        try {
            let view = await db.transactions.destroy({
                where: { id: req.params.id },
            });
            return helper.success(res, "Transaction deleted successfully", view);
        } catch (error) {
            return helper.error(res, error.message);
        }
    }

};
