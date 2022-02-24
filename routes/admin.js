const router = require('express').Router();
const { 
    viewDashboard, 
    viewCategory, 
    viewItem, 
    viewBank, 
    viewBooking, 
    createCategory, 
    updateCategory, 
    deleteCategory, 
    createBank, 
    deleteBank, 
    updateBank, 
    createItem, 
    showImageItem,
    showEditItem,
    updateItem,
    deleteItem,
    viewDetailItem,
    createFacilities,
    deleteFacilities,
    updateFacilities,
    viewSimilarRooms,
    createSimilarRooms,
    updateSimilarRooms,
    deleteSimilarRooms,
    viewLogin,
    actionLogin,
    actionLogout,
    viewDetailBooking,
    actionConfirm,
    actionReject
} = require('../controller/adminController');

// Middlewares
const {uploadSingle, uploadMultiple} = require("../middlewares/multer");
const isLogin = require("../middlewares/auth")

// Endpoint Login
router.get("/sign-in", viewLogin);
router.post("/sign-in", actionLogin);
router.use(isLogin);
router.get("/dashboard", viewDashboard);

// Endpoint Logout
router.get("/log-out", actionLogout);


// Endpoint CRUD Category
router.get("/category", viewCategory);
router.post("/category", createCategory);
router.put("/category", updateCategory);
router.delete("/category/:id", deleteCategory);

// Endpoint CRUD Item
router.get("/item", viewItem);

// Endpoint CRUD Bank
router.get("/bank", viewBank);
router.post("/bank", uploadSingle, createBank);
router.put("/bank",uploadSingle, updateBank);
router.delete("/bank/:id",deleteBank);

// Endpoint CRUD Item
router.get("/item", viewItem);
router.get("/item/show-image/:id", showImageItem);
router.get("/item/:id",showEditItem);
router.post("/item", uploadMultiple ,createItem);
router.put("/item/:id",uploadMultiple,updateItem);
router.delete("/item/:id", deleteItem);

// Endpoint Read Detail Item
router.get("/item/detail-item/:itemId", viewDetailItem);

// Endpoint CRUD Detail Item (Facilities)
router.post("/item/detail-item/:itemId/facilities", uploadSingle ,createFacilities);
router.put("/item/detail-item/:itemId/facilities", uploadSingle ,updateFacilities);
router.delete("/item/detail-item/:itemId/facilities/:id", deleteFacilities);

// Endpoint CRUD Detail Item (Similar Rooms)
router.post("/item/detail-item/:itemId/similar-rooms", uploadSingle ,createSimilarRooms);
router.put("/item/detail-item/:itemId/similar-rooms", uploadSingle ,updateSimilarRooms);
router.delete("/item/detail-item/:itemId/similar-rooms/:id", deleteSimilarRooms);

// Endpoint CRUD Booking
router.get("/booking",viewBooking);
router.get("/booking/:id",viewDetailBooking);
router.put("/booking/:id/confirm",actionConfirm);
router.put("/booking/:id/reject",actionReject);

module.exports = router;