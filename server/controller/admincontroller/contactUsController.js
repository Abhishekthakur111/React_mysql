const db = require("../../models");
const helper = require("../../helper/helper");

module.exports = {
    contact_get: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const totalContacts = await db.contactus.count();
            const data = await db.contactus.findAll({ limit, offset });

            return helper.success(res, "All contact details", {
                data,
                total: totalContacts,
                page,
                limit,
                totalPages: Math.ceil(totalContacts / limit),
            });
        } catch (error) {
            return helper.error(res, "Something went wrong", error);
        }
    },
    contact_view: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await db.contactus.findByPk(id);
            return res.status(200).json({ message: true, data });
        } catch (error) {
            return helper.error(res, "Something went wrong", error);
        }
    },
    contact_delete: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await db.contactus.destroy({ where: { id } });
            return res.status(200).json({ message: "Contact deleted successfully" });
        } catch (error) {
            return helper.error(res, "Something went wrong", error);
        }
    },
};
