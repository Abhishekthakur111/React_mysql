const db = require("../../models");
const helper = require("../../helper/helper");
const { Validator } = require("node-input-validator");

module.exports = {
    createCategory: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                name: "required|string",
                image: "string",
            });

            let errorsResponse = await helper.checkValidation(v);
            if (errorsResponse) {
                return helper.error(res, errorsResponse);
            }
            const existingCategory = await db.categories.findOne({ where: { name: req.body.name } });
            if (existingCategory) {
                return helper.error(res, "Category already exists with that name");
            }
            if (req.files && req.files.image) {
                let imagePath = await helper.fileUpload(req.files.image);
                req.body.image = imagePath;
            }
            const newCategory = await db.categories.create({
                name: req.body.name,
                image: req.body.image || null,
                status: req.body.status || "0",
            });

            return helper.success(res, "Category Created Successfully", { data: newCategory });
        } catch (error) {
            return helper.error(res, error.message);
        }
    },
    Categorylist: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const totalCategories = await db.categories.count();
            const categories = await db.categories.findAll({
                offset: offset,
                limit: limit,
                order: [["id", "DESC"]],
            });

            return helper.success(res, "All category details", {
                data: categories,
                total: totalCategories,
                page,
                limit,
                totalPages: Math.ceil(totalCategories / limit),
            });
        } catch (error) {
            return helper.error(res, error.message);
        }
    },
    categoryDetail: async (req, res) => {
        try {
            const category = await db.categories.findOne({ where: { id: req.params.id } });
            if (!category) {
                return helper.error(res, "Category not found");
            }
            return helper.success(res, "Category details", category);
        } catch (error) {
            return helper.error(res, error.message);
        }
    },
    categoryStatus: async (req, res) => {
        try {
            const { id, status } = req.body;
            const category = await db.categories.findOne({ where: { id } });
            if (!category) {
                return helper.error(res, "Category not found");
            }

            await db.categories.update({ status }, { where: { id } });

            return helper.success(res, "Category status updated successfully", { id, status });
        } catch (error) {
            return helper.error(res, error.message);
        }
    },
    categoryDelete: async (req, res) => {
        try {
            const { id } = req.params;
            const category = await db.categories.findOne({ where: { id } });
            if (!category) {
                return helper.error(res, "Category not found");
            }
            await db.subcategories.destroy({ where: { category_id: id } });
            await db.categories.destroy({ where: { id } });
            return helper.success(res, "Category deleted successfully");
        } catch (error) {
            return helper.error(res, error.message);
        }
    },
    categoryUpdate: async (req, res) => {
        try {
            const { id } = req.params;
            const v = new Validator(req.body, {
                name: "required|string",
                image: "string",
            });

            let errorsResponse = await helper.checkValidation(v);
            if (errorsResponse) {
                return helper.error(res, errorsResponse);
            }
            const category = await db.categories.findOne({ where: { id } });
            if (!category) {
                return helper.error(res, "Category not found");
            }
            const existingCategory = await db.categories.findOne({
                where: { name: req.body.name, id: { [db.Sequelize.Op.ne]: id } }
            });
            if (existingCategory) {
                return helper.error(res, "Another category already exists with that name");
            }

            if (req.files && req.files.image) {
                let imagePath = await helper.fileUpload(req.files.image);
                req.body.image = imagePath;
            }
            await db.categories.update(
                { name: req.body.name, image: req.body.image || category.image },
                { where: { id } }
            );
            const updatedCategory = await db.categories.findOne({ where: { id } });
            return helper.success(res, "Category updated successfully", { data: updatedCategory });
        } catch (error) {
            return helper.error(res, error.message);
        }
    },
};
