const db = require("../../models");
const helper = require("../../helper/helper");
const { Op } = require("sequelize");


module.exports = {
    userlist_get: async (req, res) => {
        try {
            let { page, limit, search } = req.query;
            page = parseInt(page) || 1;
            limit = parseInt(limit) || 10;
            const offset = (page - 1) * limit;

            const Op = db.Sequelize.Op;
            const whereCondition = { role: "1" };

            if (search && search.trim() !== "") {
                whereCondition[Op.or] = [
                    { name: { [Op.like]: `%${search}%` } },
                    { email: { [Op.like]: `%${search}%` } },
                ];
            }

            const { count, rows } = await db.users.findAndCountAll({
                where: whereCondition,
                offset,
                limit,
                order: [["id", "DESC"]],
            });

            return helper.success(res, "All Users Detail", {
                data: rows,
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                totalUsers: count,
            });
        } catch (error) {
            return helper.error(res, error.message);
        }
    },
    userDetail: async (req, res) => {
        try {
            let view = await db.users.findOne({ where: { id: req.params.id } });
            return helper.success(res, "data", view);
        } catch (error) {
            return helper.error(res, error.message);
        }
    },
    userStatus: async (req, res) => {
        try {
            const { id, status } = req.body;
            const user = await db.users.findOne({ where: { id } });
            await db.users.update({ status }, { where: { id } });
            const updatedUser = await db.users.findOne({ where: { id } });
            return helper.success(res, "User status updated successfully", { id: updatedUser.id, status: updatedUser.status });
        } catch (error) {
            return helper.error(res, error.message);
        }
    },
    userDelete: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await db.users.findOne({ where: { id } });

            if (!user) {
                return helper.error(res, "User not found", 404);
            }
            await db.users.destroy({ where: { id } });
            return helper.success(res, "User deleted successfully");
        } catch (error) {
            return helper.error(res, error.message);
        }
    },
}