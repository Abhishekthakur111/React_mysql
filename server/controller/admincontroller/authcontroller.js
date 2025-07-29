const db = require('../../models');
const bcrypt = require('bcryptjs');
const helper = require('../../helper/helper');
const { Validator } = require('node-input-validator');
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

module.exports = {
    signup: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                name: "required|string",
                email: "required|email",
                password: "required|string|minLength:6",
                phonenumber: "required|numeric",
                location: "string",
                image: "string"
            });

            let errorsResponse = await helper.checkValidation(v);
            if (errorsResponse) {
                return helper.error(res, errorsResponse);
            }

            const { name, email, password, role, phonenumber, image, location } = req.body;

            if (req.files && req.files.image) {
                let images = await helper.fileUpload(req.files.image);
                req.body.image = images;
            }

            const existingUser = await db.users.findOne({ where: { email } });
            if (existingUser) {
                return helper.error(res, "Email already exists.");
            }

            const hashedPassword = bcrypt.hashSync(password, 10);

            const newUser = await db.users.create({
                name,
                email,
                password: hashedPassword,
                role,
                phonenumber,
                image: req.body.image || null,
                location
            });

            const token = jwt.sign(
                { id: newUser.id, email: newUser.email },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            return helper.success(res, "User created successfully", {
                ...newUser.toJSON(),
                token: token
            });

        } catch (error) {
            return helper.error(res, error.message);
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return helper.error(res, "Email and Password are required");
            }
            const userData = await db.users.findOne({ where: { email, role: "0" } });

            if (!userData) {
                return helper.error(res, "Invalid Email");
            }
            const isPasswordValid = await bcrypt.compare(password, userData.password);
            if (!isPasswordValid) {
                return helper.error(res, "Incorrect Password");
            }
            const secret = process.env.JWT_SECRET;
            const token = jwt.sign(
                { id: userData.id, name: userData.name, email: userData.email },
                secret,
                { expiresIn: "10h" }
            );
            const userResponse = { ...userData.toJSON() };
            delete userResponse.password;
            return helper.success(res, "Login successful", {
                ...userData.toJSON(),
                token
            });

        } catch (error) {
            return helper.error(res, error.message);
        }
    },
    profile: async (req, res) => {
        try {
            const userId = req.admin.id;
            const find_user = await db.users.findByPk(userId, {
                attributes: ["name", "email", "location", "phonenumber", "image"]
            });
            return helper.success(res, "Profile fetched successfully", find_user);
        } catch (error) {
            return helper.error(res, error.message);
        }
    },
    edit_profile: async (req, res) => {
        try {
            const userId = req.admin.id;
            const find_user = await db.users.findByPk(userId);
            if (!find_user) {
                return helper.error(res, "User not found", 403);
            }
            let imagePath = find_user.image;
            if (req.files && req.files.image) {
                imagePath = await helper.fileUpload(req.files.image);
            }
            await db.users.update(
                {
                    name: req.body.name || find_user.name,
                    location: req.body.location || find_user.location,
                    phonenumber: req.body.phonenumber || find_user.phonenumber,
                    image: imagePath,
                },
                { where: { id: userId } }
            );
            const updatedProfile = await db.users.findByPk(userId, {
                attributes: ["name", "location", "phonenumber", "image"],
            });

            return helper.success(res, "Profile updated successfully", updatedProfile);
        } catch (error) {
            return helper.error(res, error.message);
        }
    },
    reset_password: async (req, res) => {
        try {
            const { password, newPassword } = req.body;
            const token = req.headers.authorization?.split(' ')[1];
    
            if (!token) {
                return helper.error(res, "No token provided");
            }
    
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;
    
            const find_data = await db.users.findByPk(userId);
            if (!find_data) {
                return helper.error(res, "User not found");
            }
    
            const isPasswordMatch = await bcrypt.compare(password, find_data.password);
            if (!isPasswordMatch) {
                return helper.error(res, "Old password is incorrect");
            }
            const isNewSameAsOld = await bcrypt.compare(newPassword, find_data.password);
            if (isNewSameAsOld) {
                return helper.error(res, "New password cannot be the same as the old password");
            }
    
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            await db.users.update(
                { password: hashedNewPassword },
                { where: { id: userId } }
            );
    
            return helper.success(res, "Password changed successfully");
        } catch (error) {
            return helper.error(res, error.message);
        }
    },    
    logout: async (req, res) => {
        try {
            return helper.success(res, "Logged out successfully. Please clear the token on the client side.");
        } catch (error) {
            return helper.error(res, error.message);
        }
    },
    dashboard: async (req, res) => {
        try {
            let userCount = await db.users.count({ where: { role: "1" } });
            let data = await db.categories.count();
            let subdata = await db.subcategories.count();
            let databooking = await db.bookings.count();
            let datacontact = await db.contactus.count();

            return helper.success(res, "Dashboard data fetched successfully", {
                userCount,
                data,
                subdata,
                databooking,
                datacontact,
            });
        } catch (error) {
            return helper.error(res, "Error fetching dashboard data", error);
        }
    },
    chartData: async (req, res) => {
        try {
            const currentYear = new Date().getFullYear();
            const categories = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const data = await Promise.all(
                categories.map(async (_, index) => {
                    const startOfMonth = new Date(currentYear, index, 1);
                    const endOfMonth = new Date(currentYear, index + 1, 0, 23, 59, 59);

                    const userCount = await db.users.count({
                        where: {
                            role: "1",
                            createdAt: {
                                [Op.between]: [startOfMonth, endOfMonth],
                            },
                        },
                    });

                    return userCount;
                })
            );

            res.json({
                data,
                categories,
            });
        } catch (error) {
            return helper.error(res, "Error fetching chart data", error);
        }
    },

}