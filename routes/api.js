const router = require('express').Router();
const { landingPage, detailPage, bookingPage } = require('../controller/apiController');


// Middlewares
const {uploadSingle} = require("../middlewares/multer");
// const isLogin = require("../middlewares/auth");

// Endpoint Login
router.get("/landing-page", landingPage);
router.get("/detail-page/:id", detailPage);
router.post("/booking-page", uploadSingle, bookingPage);


module.exports = router;