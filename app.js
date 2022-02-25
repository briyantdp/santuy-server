var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const flash = require('connect-flash');
const session = require('express-session')
const cors = require('cors');

mongoose.connect('mongodb+srv://bryant:santuy@cluster0.uxdim.mongodb.net/db_santuy?retryWrites=true&w=majority', {  
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
// Router admin
const adminRouter = require("./routes/admin");
// Router API
const apiRouter = require("./routes/api")

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    maxAge : 60000,
    sameSite : "lax",
  }
}));
app.use(flash());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/sb-admin-2",
  express.static(path.join(__dirname, "node_modules/startbootstrap-sb-admin-2"))
);
app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use(cors());

// Endpoint admin
app.use("/admin", adminRouter);
app.use("/api/v1/customer", apiRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
