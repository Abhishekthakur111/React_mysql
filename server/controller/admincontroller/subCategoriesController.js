const db = require("../../models");
const helper = require("../../helper/helper");
const { Validator } = require("node-input-validator");

db.subcategories.belongsTo(db.categories, {
    foreignKey: "category_id", as: "category",
});

module.exports = {
    subCategoryCreate: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                name: "required|string",
                price: "numeric",
                category_id: "required|string"
            });

            let errorsResponse = await helper.checkValidation(v);
            if (errorsResponse) {
                return helper.error(res, errorsResponse);
            }

            const category = await db.categories.findOne({ where: { id: req.body.category_id } });
            if (!category) {
                return helper.error(res, "Category not found", 404);
            }

            let imagePath = null;
            if (req.files && req.files.image) {
                imagePath = await helper.fileUpload(req.files.image);
            }

            const newSubCategory = await db.subcategories.create({
                name: req.body.name,
                price: req.body.price || 0,
                image: imagePath,
                category_id: req.body.category_id,
                status: req.body.status || "0",
            });

            return helper.success(res, "Subcategory Created Successfully", { data: newSubCategory });
        } catch (error) {
            return helper.error(res, error.message);
        }
    },

    subCategoryList: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const totalServices = await db.subcategories.count();
            const services = await db.subcategories.findAll({
                include: [
                    {
                        model: db.categories,
                        as: "category",
                    },
                ],
                offset,
                limit,
                order: [["id", "DESC"]],
            });
            return helper.success(res, "All subcategory details", {
                data: services,
                total: totalServices,
                page,
                limit,
                totalPages: Math.ceil(totalServices / limit),
            });
        } catch (error) {
            return helper.error(res, "Something went wrong", error.message);
        }
    },
    subCategoryDetail: async (req, res) => {
        try {
            const subcategory = await db.subcategories.findOne({
                where: { id: req.params.id },
                include: [
                    {
                        model: db.categories,
                        as: "category",
                    },
                ],
            });

            if (!subcategory) {
                return helper.error(res, "Subcategory not found",);
            }
            return helper.success(res, "Subcategory retrieved successfully", { data: subcategory });
        } catch (error) {
            return helper.error(res, "Something went wrong", error.message);
        }
    },
    subCategoryDelete: async (req, res) => {
        try {
            const { id } = req.params;
            const deletedSubcategory = await db.subcategories.destroy({ where: { id } });

            if (!deletedSubcategory) {
                return helper.error(res, "Subcategory not found",);
            }
            return helper.success(res, "Subcategory deleted successfully");
        } catch (error) {
            return helper.error(res, "Something went wrong", error.message);
        }
    },
    updateSubcategoryStatus: async (req, res) => {
        try {
            const { id, status } = req.body;
            const updatedSubcategory = await db.subcategories.update(
                { status },
                { where: { id } }
            );
            return helper.success(res, "Subcategory status updated successfully");
        } catch (error) {
            return helper.error(res, "Something went wrong", error.message);
        }
    },
    updateSubcategory: async (req, res) => {
        try {
            const { id } = req.params;
            const subcategory = await db.subcategories.findOne({ where: { id } });

            if (!subcategory) {
                return helper.error(res, "Subcategory not found", 404);
            }
            if (req.body.category_id) {
                const category = await db.categories.findOne({ where: { id: req.body.category_id } });
                if (!category) {
                    return helper.error(res, "Category not found", 404);
                }
            }
            if (req.files && req.files.image) {
                let image = await helper.fileUpload(req.files.image);
                req.body.image = image;
            }
            const updatedSubcategory = await db.subcategories.update(
                {
                    name: req.body.name,
                    price: req.body.price || subcategory.price,
                    image: req.body.image || subcategory.image,
                    category_id: req.body.category_id || subcategory.category_id,
                },
                { where: { id } }
            );
            if (!updatedSubcategory[0]) {
                return helper.error(res, "Failed to update subcategory",);
            }
            return helper.success(res, "Subcategory updated successfully");
        } catch (error) {
            return helper.error(res, "Something went wrong", error.message);
        }
    },
};
