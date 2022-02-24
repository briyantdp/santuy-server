const Bank = require("../models/Bank");
const Category = require("../models/Category");
const Item = require("../models/Item");
const Image = require("../models/Image");
const Facilities = require("../models/Facilities");
const SimilarRooms = require("../models/SimilarRooms");
const Booking = require("../models/Booking");
const Customer = require("../models/Customer");
const Users = require("../models/Users");

const fs = require('fs-extra');
const path = require('path');
const bcrypt = require('bcryptjs');

module.exports = {
    viewLogin : async (req, res) => {
        try {
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = {message : alertMessage, status : alertStatus};
            const title = "Santuy | Login";
            if (req.session.users === null || req.session.users === undefined) {
                res.render("index", {alert, title});
            } else {
                res.redirect("/admin/dashboard");
            }
        } catch (error) {
            res.redirect("/admin/sign-in");
        }
    },
    actionLogin : async (req, res) => {
        const {username, password} = req.body;
        try {
            const users = await Users.findOne({username : username});
            if(!users) {
                req.flash("alertMessage", "Username anda salah / tidak ada !");
                req.flash("alertStatus", "danger");
                return res.redirect("/admin/sign-in");
            }

            const isPasswordMatch = await bcrypt.compare(password, users.password);
            if(!isPasswordMatch) {
                req.flash("alertMessage", "Password anda salah !");
                req.flash("alertStatus", "danger");
                return res.redirect("/admin/sign-in");
            }

            req.session.users = {
                id : users._id,
                username : users.username,
                password : users.password
            }

            res.redirect("/admin/dashboard");
        } catch (error) {
            console.log(error)
            res.redirect("/admin/sign-in");
        }
    },
    actionLogout : (req, res) => {
        req.session.destroy();
        res.redirect("/admin/sign-in");
    },
    viewDashboard : async (req, res) => {
        try {
            const customer = await Customer.find();
            const booking = await Booking.find();
            const item = await Item.find();
            const title = "Santuy | Dashboard";
            res.render("admin/dashboard/view_dashboard", {title, users: req.session.users, customer, booking, item});
        } catch (error) {
            res.redirect("/admin/dashboard")
        }
    },
    viewCategory : async (req, res) => {
        try {
            const category = await Category.find();
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = {message : alertMessage, status : alertStatus};
            const title = "Santuy | Category";
            res.render("admin/category/view_category", {category, alert, title, users: req.session.users});
        } catch (error) {
            res.redirect("/admin/category");
        }
    },
    createCategory : async (req,res) => {
        try {
            const {name} = req.body;
            await Category.create({name});
            req.flash("alertMessage", "Berhasil menambah data kategori");
            req.flash("alertStatus", "success");
            res.redirect("/admin/category");
        } catch (error) {
            req.flash("alertMessage", `Gagal menambah data kategori, ${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/admin/category");
        }
    },
    updateCategory : async (req,res) => {
        try {
            const {id, name} = req.body;
            const category = await Category.findOne({_id : id});
            console.log(category);
            category.name = name;
            await category.save();
            req.flash("alertMessage", "Berhasil mengubah data kategori");
            req.flash("alertStatus", "success");
            res.redirect("/admin/category");
        } catch (error) {
            req.flash("alertMessage", `Gagal mengubah data kategori, ${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/admin/category");
        }
    },
    deleteCategory : async (req, res) => {
        try {
            const {id} = req.params;
            const category = await Category.findOne({_id : id});
            await category.remove();
            req.flash("alertMessage", "Berhasil menghapus data kategori");
            req.flash("alertStatus", "success");
            res.redirect("/admin/category");
        } catch (error) {
            req.flash("alertMessage", `Gagal menghapus data kategori, ${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/admin/category");
        }
    },
    viewItem : async (req, res) => {
        try {
            const item = await Item.find()
                        .populate({path : "imageId", select : "id imageUrl"})
                        .populate({path : "categoryId", select : "id name"});
            const category = await Category.find();
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = {message : alertMessage, status : alertStatus};
            const title = "Santuy | Item";
            res.render("admin/item/view_item", {item, category, title, alert, action : "view", users: req.session.users});
        } catch (error) {
            res.redirect("/admin/item");
        }
    },
    showImageItem : async (req, res) => {
        try {
            const {id} = req.params;
            const item = await Item.findOne({_id : id})
                        .populate({path : "imageId", select : "id imageUrl"})
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = {message : alertMessage, status : alertStatus};
            const title = "Santuy | Show Image";
            res.render("admin/item/view_item", {item, title, alert, action : "showImage", users: req.session.users});
        } catch (error) {
            res.redirect("/admin/item");
        }
    },
    showEditItem : async (req, res) => {
        try {
            const {id} = req.params;
            const item = await Item.findOne({_id : id})
                        .populate({path : "imageId", select : "id imageUrl"})
                        .populate({path : "categoryId", select : "id name"});
            const category = await Category.find();
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = {message : alertMessage, status : alertStatus};
            const title = "Santuy | Edit Item";
            res.render("admin/item/view_item", {item, category, title, alert, action : "editItem", users: req.session.users});
        } catch (error) {
            res.redirect("/admin/item");
        }
    },
    createItem : async (req, res) => {
        try {
            const {title, categoryId, price, city, country, description} = req.body;
            if (req.files.length > 0) {
                const category = await Category.findOne({_id : categoryId});
                const newItem = {
                    title,
                    categoryId : category._id,
                    price,
                    city,
                    country,
                    description
                };
                const item = await Item.create(newItem);
                category.itemId.push({_id : item._id});
                await category.save();
                for (let i = 0; i < req.files.length; i++) {
                    const image = await Image.create({imageUrl : `images/${req.files[i].filename}`})
                    item.imageId.push({_id : image._id});
                    await item.save();
                }
            }
            req.flash("alertMessage", "Berhasil menambah data item");
            req.flash("alertStatus", "success");
            res.redirect("/admin/item");
        } catch (error) {
            req.flash("alertMessage", `Gagal menambah data item, ${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/admin/item");
        }
    },
    updateItem : async (req, res) => {
        try {
            const {id} = req.params;
            const {title, categoryId, price, city, country, description} = req.body;
            const item = await Item.findOne({_id : id})
                                .populate({path : "imageId", select : "id imageUrl"})
                                .populate({path : "categoryId", select : "id name"});
            if (req.files.length > 0) {
                for (let i = 0; i < req.files.length; i++) {
                    const image = await Image.findOne({_id : item.imageId[i]._id});
                    await fs.unlink(path.join(`public/${image.imageUrl}`));
                    image.imageUrl = `images/${req.files[i].filename}`;
                    await image.save();
                }
                item.title = title;
                item.categoryId = categoryId;
                item.price = price;
                item.city = city;
                item.country = country;
                item.description = description;
                await item.save();
                req.flash("alertMessage", "Berhasil mengubah data item");
                req.flash("alertStatus", "success");
                res.redirect("/admin/item");
            } else {
                item.title = title;
                item.categoryId = categoryId;
                item.price = price;
                item.city = city;
                item.country = country;
                item.description = description;
                await item.save();
                req.flash("alertMessage", "Berhasil mengubah data item");
                req.flash("alertStatus", "success");
                res.redirect("/admin/item");
            }
        } catch (error) {
            req.flash("alertMessage", `Gagal mengubah data item, ${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/admin/item");
        }
    },
    deleteItem : async (req, res) => {
        try {
            const {id} = req.params;
            const item = await Item.findOne({_id : id})
                                .populate("imageId");
            for (let i = 0; i < item.imageId.length; i++) {
                Image.findOne({_id : item.imageId[i]._id})
                    .then((image) => {
                        fs.unlink(path.join(`public/${image.imageUrl}`));
                        image.remove();
                    })
                    .catch((error) => {
                        req.flash("alertMessage", `${error.message}`);
                        req.flash("alertStatus", "danger");
                        res.redirect("/admin/item");
                    });
            }
            await item.remove();
            req.flash("alertMessage", "Berhasil menghapus data item");
            req.flash("alertStatus", "success");
            res.redirect("/admin/item");
        } catch (error) {
            req.flash("alertMessage", `Gagal menghapus data item, ${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/admin/item");
        }
    },
    viewDetailItem : async (req, res) => {
        const {itemId} = req.params;
        try {
            const facilities = await Facilities.find();
            const similarRooms = await SimilarRooms.find();
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = {message : alertMessage, status : alertStatus};
            const title = "Santuy | Detail Item";
            res.render("admin/item/detail_item/view_detail_item", {title, alert, itemId, facilities, similarRooms, users: req.session.users});
        } catch (error) {
            res.redirect(`/admin/item/detail-item/${itemId}`);
        }
    },
    createFacilities : async (req, res) => {
        const {qty, name, itemId} = req.body;
        const imageUrl = req.file.filename;
        try {
            if(!req.file) {
                req.flash("alertMessage", "Gambar tidak ditemukan");
                req.flash("alertStatus", "danger");
                res.redirect(`/admin/item/detail-item/${itemId}`);
            }
            const facilities = await Facilities.create({
                name,
                imageUrl : `images/${imageUrl}`,
                qty,
                itemId 
            });
            const item = await Item.findOne({_id : itemId});
            item.facilitiesId.push({_id : facilities._id});
            await item.save();
            req.flash("alertMessage", "Berhasil menambah data fasilitas");
            req.flash("alertStatus", "danger");
            res.redirect(`/admin/item/detail-item/${itemId}`);
        } catch (error) {
            req.flash("alertMessage", `Gagal menambah data fasilitas, ${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect(`/admin/item/detail-item/${itemId}`);
        }
    },
    updateFacilities : async (req, res) => {
        const {itemId} = req.params;
        const {id, name, qty} = req.body;
        try {
            const facilities = await Facilities.findOne({_id : id});
            if (req.file === undefined) {
                facilities.name = name;
                facilities.qty = qty;
                await facilities.save();
                req.flash("alertMessage", "Berhasil mengubah data fasilitas");
                req.flash("alertStatus", "success");
                res.redirect(`/admin/item/detail-item/${itemId}`);
            } else {
                await fs.unlink(path.join(`public/${facilities.imageUrl}`));
                facilities.name = name;
                facilities.qty = qty;
                facilities.imageUrl = `images/${req.file.filename}`;
                await facilities.save();
                req.flash("alertMessage", "Berhasil mengubah data fasilitas");
                req.flash("alertStatus", "success");
                res.redirect(`/admin/item/detail-item/${itemId}`);
            }
        } catch (error) {
            req.flash("alertMessage", `Gagal mengubah data fasilitas, ${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect(`/admin/item/detail-item/${itemId}`);
        }
    },
    deleteFacilities : async (req, res) => {
        const {id, itemId} = req.params;
        try {
            const facilities = await Facilities.findOne({_id : id});
            const item = await Item.findOne({_id : itemId}).populate("facilitiesId");
            for (let i = 0; i < item.facilitiesId.length; i++) {
                if (item.facilitiesId[i]._id.toString() === facilities._id.toString()) {
                    item.facilitiesId.pull({_id : facilities._id});
                    await item.save();
                }
            }
            await fs.unlink(path.join(`public/${facilities.imageUrl}`));
            await facilities.remove();
            req.flash("alertMessage", "Berhasil menghapus data fasilitas");
            req.flash("alertStatus", "success");
            res.redirect(`/admin/item/detail-item/${itemId}`);
        } catch (error) {
            req.flash("alertMessage", `Gagal menghapus data fasilitas, ${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect(`/admin/item/detail-item/${itemId}`);
        }
    },
    createSimilarRooms : async (req, res) => {
        const {itemId} = req.params;
        const {title, price, city, country} = req.body;
        const imageUrl = req.file.filename;
        try {
            if(!req.file) {
                req.flash("alertMessage", "Gambar tidak ditemukan");
                req.flash("alertStatus", "danger");
                res.redirect(`/admin/item/detail-item/${itemId}`);
            }
            const similarRooms = await SimilarRooms.create({
                title,
                imageUrl : `images/${imageUrl}`,
                price,
                city,
                country 
            });
            const item = await Item.findOne({_id : itemId});
            item.similarRoomsId.push({_id : similarRooms._id});
            await item.save();
            req.flash("alertMessage", "Berhasil menambah data kamar sejenis");
            req.flash("alertStatus", "success");
            res.redirect(`/admin/item/detail-item/${itemId}`);
        } catch (error) {
            req.flash("alertMessage", `Gagal menambah data kamar sejenis, ${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect(`/admin/item/detail-item/${itemId}`);
        }
    },
    updateSimilarRooms : async (req, res) => {
        const {itemId} = req.params;
        const {id, title, price, city, country} = req.body;
        try {
            const similarRooms = await SimilarRooms.findOne({_id : id});
            if (req.file === undefined) {
                similarRooms.title = title;
                similarRooms.price = price;
                similarRooms.city = city;
                similarRooms.country = country;
                await similarRooms.save();
                req.flash("alertMessage", "Berhasil mengubah data kamar sejenis");
                req.flash("alertStatus", "success");
                res.redirect(`/admin/item/detail-item/${itemId}`);
            } else {
                await fs.unlink(path.join(`public/${similarRooms.imageUrl}`));
                similarRooms.title = title;
                similarRooms.price = price;
                similarRooms.city = city;
                similarRooms.country = country;
                similarRooms.imageUrl = `images/${req.file.filename}`;
                await similarRooms.save();
                req.flash("alertMessage", "Berhasil mengubah data kamar sejenis");
                req.flash("alertStatus", "success");
                res.redirect(`/admin/item/detail-item/${itemId}`);
            }
        } catch (error) {
            req.flash("alertMessage", `Gagal mengubah data kamar sejenis, ${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect(`/admin/item/detail-item/${itemId}`);
        }
    },
    deleteSimilarRooms : async (req, res) => {
        const {id, itemId} = req.params;
        try {
            const similarRooms = await SimilarRooms.findOne({_id : id});
            const item = await Item.findOne({_id : itemId}).populate("similarRoomsId");
            for (let i = 0; i < item.similarRoomsId.length; i++) {
                if (item.similarRoomsId[i]._id.toString() === similarRooms._id.toString()) {
                    item.similarRoomsId.pull({_id : similarRooms._id});
                    await item.save();
                }
            }
            await fs.unlink(path.join(`public/${similarRooms.imageUrl}`));
            await similarRooms.remove();
            req.flash("alertMessage", "Berhasil menghapus data kamar sejenis");
            req.flash("alertStatus", "success");
            res.redirect(`/admin/item/detail-item/${itemId}`);
        } catch (error) {
            req.flash("alertMessage", `Gagal menghapus data kamar sejenis, ${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect(`/admin/item/detail-item/${itemId}`);
        }
    },
    viewBank : async (req, res) => {
        try {
            const bank = await Bank.find();
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = {message : alertMessage, status : alertStatus};
            const title = "Santuy | Bank";
            res.render("admin/bank/view_bank", {bank, alert, title, users: req.session.users});
        } catch (error) {
            res.redirect("/admin/bank");
        }
    },
    createBank : async (req, res) => {
        try {
            const {bankName, bankNumber, accountHolder} = req.body;
            const imageUrl = req.file.filename;
            await Bank.create({bankName, bankNumber, accountHolder, imageUrl : `images/${imageUrl}`});
            req.flash("alertMessage", "Berhasil menambah data bank");
            req.flash("alertStatus", "success");
            res.redirect("/admin/bank");
        } catch (error) {
            req.flash("alertMessage", `Gagal menambah data bank, ${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/admin/bank");
        }
    },
    updateBank : async(req, res) => {
        const {id, bankName, bankNumber, accountHolder} = req.body;
        try {
            const bank = await Bank.findOne({_id : id});
            if (req.file === undefined) {
                bank.bankName = bankName;
                bank.bankNumber = bankNumber;
                bank.accountHolder = accountHolder;
                await bank.save();
                req.flash("alertMessage", "Berhasil mengubah data bank");
                req.flash("alertStatus", "success");
                res.redirect("/admin/bank");
            } else {
                await fs.unlink(path.join(`public/${bank.imageUrl}`));
                bank.bankName = bankName;
                bank.bankNumber = bankNumber;
                bank.accountHolder = accountHolder;
                bank.imageUrl = `images/${req.file.filename}`;
                await bank.save();
                req.flash("alertMessage", "Berhasil mengubah data bank");
                req.flash("alertStatus", "success");
                res.redirect("/admin/bank");
            }
        } catch (error) {
            req.flash("alertMessage", `Gagal mengubah data bank, ${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/admin/bank");
        }
    },
    deleteBank : async (req, res) => {
        const {id} = req.params;
        try {
            const bank = await Bank.findOne({_id : id});
            await fs.unlink(path.join(`public/${bank.imageUrl}`));
            await bank.remove();
            req.flash("alertMessage", "Berhasil menghapus data bank");
            req.flash("alertStatus", "success");
            res.redirect("/admin/bank");
        } catch (error) {
            req.flash("alertMessage", `Gagal menghapus data bank, ${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/admin/bank");
        }
    },
    viewBooking : async (req, res) => {
        try {
            const booking = await Booking.find().populate("customerId").populate("bankId");
            const title = "Santuy | Booking";
            res.render("admin/booking/view_booking", {booking, title, users: req.session.users});
        } catch (error) {
            res.redirect("/admin/booking");
        }
    },
    viewDetailBooking : async (req, res) => {
        const {id} = req.params;
        try {
            const booking = await Booking.findOne({_id : id}).populate("customerId").populate("bankId");
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = {message : alertMessage, status : alertStatus};
            const title = "Santuy | Detail Booking";
            res.render("admin/booking/detail_booking/view_detail_booking", {booking, title, users: req.session.users, alert});
        } catch (error) {
            res.redirect("/admin/booking");
        }
    },
    actionConfirm : async (req, res) => {
        const {id} = req.params;
        try {
            const booking = await Booking.findOne({_id : id});
            booking.payments.status = "Terima";
            await booking.save();
            req.flash("alertMessage", "Berhasil terima pembayaran");
            req.flash("alertStatus", "success");
            res.redirect(`/admin/booking/${id}`);
        } catch (error) {
            res.redirect(`/admin/booking/${id}`);
        }
    },
    actionReject : async (req, res) => {
        const {id} = req.params;
        try {
            const booking = await Booking.findOne({_id : id});
            booking.payments.status = "Tolak";
            await booking.save();
            req.flash("alertMessage", "Berhasil tolak pembayaran");
            req.flash("alertStatus", "success");
            res.redirect(`/admin/booking/${id}`);
        } catch (error) {
            res.redirect(`/admin/booking/${id}`);
        }
    }
}