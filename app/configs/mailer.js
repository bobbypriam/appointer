var jade = require('jade');
var path = require('path');

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 2525,
  ignoreTLS: true
});

var mailer = {
  _transporter: transporter,
  _sender: 'no-reply@ppl-b02.cs.ui.ac.id',
  _templatePath: path.join(__dirname, '../views/emails'),

  sendAskForReschedule: function (to, reason, token) {
    this._transporter.sendMail({
      from: this._sender,
      to: to,
      subject: '[Appointer] You have been asked for a reschedule',
      html: '<h1>You have been asked for a reschedule</h1>\
             <p>The reason is: </p>\
             <p><blockquote>' + reason + '</blockquote></p>\
             <p>For reschedule, visit\
              <a href="http://ppl-b02.cs.ui.ac.id/appointer/reschedule/' + token + '">\
                http://ppl-b02.cs.ui.ac.id/appointer/reschedule/' + token + '\
              </a>\
             </p>'
    }, function(err, info) {
      if (err) console.log(err);
      else console.log('Message sent:', info.response);
    });
  },


};

module.exports = function (req, res, next) {
  res.locals.mailer = mailer;
  res.locals.sender = 'no-reply@ppl-b02.cs.ui.ac.id';
  next();
};