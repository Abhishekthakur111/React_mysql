const db = require("../../models");
const helper = require("../../helper/helper");
const { Validator } = require("node-input-validator");
const { Op } = require('sequelize');

db.products.belongsTo(db.categories, {
    foreignKey: "category_id", as: "category",
});
db.products.hasMany(db.productImages, {
    foreignKey: "product_id", as: "images",
});
db.products.belongsTo(db.users, {
    foreignKey: "lender_id", as: "lender",
});

module.exports = {
    productCreate: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                name: "required|string",
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

            const newSubCategory = await db.products.create({
                name: req.body.name,
                hour: req.body.hour || "0",
                day: req.body.day || "0",
                week: req.body.week || "0",
                secuirtyDeposit: req.body.secuirtyDeposit || "",
                variants: req.body.variants || 0,
                description: req.body.description || "",
                category_id: req.body.category_id,
                status: req.body.status || "0",
            });

            if (req.files && req.files.images) {
                let imageFiles = req.files.images;

                if (!Array.isArray(imageFiles)) {
                    imageFiles = [imageFiles];
                }

                const imageData = await Promise.all(
                    imageFiles.map(async (imageFile) => {
                        const uploadedImagePath = await helper.fileUpload(imageFile);
                        return {
                            image: uploadedImagePath,
                            product_id: newSubCategory.id
                        };
                    })
                );

                await db.productImages.bulkCreate(imageData);
            }

            return helper.success(res, "Subcategory Created Successfully", { data: newSubCategory });
        } catch (error) {
            console.error("Error in subCategoryCreate:", error);
            return helper.error(res, error.message);
        }
    },
    productList: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || "";
            const offset = (page - 1) * limit;

            let queryOptions = {
                include: [
                    {
                        model: db.categories,
                        as: "category",
                        attributes: ['id', 'name']
                    },
                    {
                        model: db.users,
                        as: "lender",
                        attributes: ['id', 'name', 'email']
                    }
                ],
                limit,
                offset,
                order: [["id", "DESC"]],
                distinct: true
            };
            if (search) {
                queryOptions.where = {
                    [Op.or]: [
                        { name: { [Op.like]: `%${search}%` } },
                        { '$category.name$': { [Op.like]: `%${search}%` } },
                        { '$lender.name$': { [Op.like]: `%${search}%` } }
                    ]
                };
            }

            const { count, rows } = await db.products.findAndCountAll(queryOptions);

            return helper.success(res, "All product details", {
                data: rows,
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit),
            });
        } catch (error) {
            console.error("Error in productList:", error);
            return helper.error(res, "Something went wrong", error.message);
        }
    },
    productDetail: async (req, res) => {
        try {
            const subcategory = await db.products.findOne({
                where: { id: req.params.id },
                include: [
                    {
                        model: db.categories,
                        as: "category",
                    },
                    {
                        model: db.productImages,
                        as: "images",
                    },
                    { model: db.users, as: "lender" }
                ],
            });

            if (!subcategory) {
                return helper.error(res, "Product not found",);
            }
            return helper.success(res, "Product retrieved successfully", { data: subcategory });
        } catch (error) {
            return helper.error(res, "Something went wrong", error.message);
        }
    },
    productDelete: async (req, res) => {
        try {
            const { id } = req.params;
            const deletedProduct = await db.products.destroy({ where: { id } });

            if (!deletedProduct) {
                return helper.error(res, "Product not found",);
            }
            return helper.success(res, "Product deleted successfully");
        } catch (error) {
            return helper.error(res, "Something went wrong", error.message);
        }
    },
    updateProductStatus: async (req, res) => {
        try {
            const { id, status } = req.body;
            const updatedSubcategory = await db.products.update(
                { status },
                { where: { id } }
            );
            return helper.success(res, "Product status updated successfully");
        } catch (error) {
            return helper.error(res, "Something went wrong", error.message);
        }
    },
    updateSubcategory: async (req, res) => {
        try {
            const { id } = req.params;
            const subcategory = await db.products.findOne({ where: { id } });

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
            const updatedSubcategory = await db.products.update(
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
