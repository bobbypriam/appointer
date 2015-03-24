module.exports = function (req, res, next) {
  res.locals.baseurl = 'http://localhost:3000';
  next();
}