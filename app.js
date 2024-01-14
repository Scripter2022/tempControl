var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var testRouter = require("./routes/test");
var mq = require("./lib/mq.js");

mq.mq();

var {tempHot}=require('./lib/mq.js');

app.listen(80); 

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "lib")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/test", testRouter);
app.get('/data', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
    res.write('<!DOCTYPE html>');
    res.write('<html>');
    res.write('<head>');
    res.write('<title>Hello Node.js</title>');
    res.write('<meta charset="utf-8" />');
    res.write('</head>');
    res.write(tempHot, ()=>{
      console.log(tempHot)
    });
    res.write('</html>');
    res.end();
 
 })
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
 handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
module.exports = app;





