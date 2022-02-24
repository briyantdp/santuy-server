const isLogin = (req, res, next) => {
    if (req.session.users === null || req.session.users === undefined) {
        req.flash("alertMessage", "Session anda telah berakhir, silahkan sign in");
        req.flash("alertStatus", "danger");
        res.redirect("/admin/sign-in");
    } else {
        next();
    }
}

module.exports = isLogin;