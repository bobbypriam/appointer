module.exports = function (req, res, next) {
  res.locals.baseurl = '/appointer/';
  next();
}