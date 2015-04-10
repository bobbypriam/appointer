var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 2525,
  ignoreTLS: true
});

module.exports = function (req, res, next) {
  res.locals.mailer = transporter;
  res.locals.sender = 'no-reply@ppl-b02.cs.ui.ac.id';
  next();
};