module.exports = function (req, res, next) {
  res.locals.baseurl = '/appointer/'; // Don't forget to add slash at the end!
  next();
}