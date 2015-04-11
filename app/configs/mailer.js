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

  sendNewBooking: function (appointmentMaker, calendarMaker, appointment) {
    // send mail to appointment maker
    this._transporter.sendMail({
      from: this._sender,
      to: appointmentMaker,
      subject: '[Appointer] You have made a new appointment!',
      html: '<h1>Successfully made appointment</h1>\
             <p>Here are the details</p>\
             <p>For cancelling, visit\
              <a href="http://ppl-b02.cs.ui.ac.id/appointer/cancel/'+appointment.token+'">\
                http://ppl-b02.cs.ui.ac.id/appointer/cancel/'+appointment.token+'\
              </a>\
             </p>\
             <p>For reschedule, visit\
              <a href="http://ppl-b02.cs.ui.ac.id/appointer/reschedule/'+appointment.token+'">\
                http://ppl-b02.cs.ui.ac.id/appointer/reschedule/'+appointment.token+'\
              </a>\
             </p>'
    }, function(err, info) {
      if (err) console.log(err);
      else console.log('Message sent:', info.response);
    });
    // send mail to calendar maker
    this._transporter.sendMail({
      from: this._sender,
      to: calendarMaker,
      subject: '[Appointer - New Booking] ' + appointment.name,
      html: '<h1>' + appointment.name + ' has made a booking.</h1><p>Here are the details</p>'
    }, function(err, info) {
      if (err) console.log(err);
      else console.log('Message sent:', info.response);
    });
  },

  sendCancel: function (appointmentMaker, calendarMaker, calendar, appointment) {
    // send mail to appointment maker
    this._transporter.sendMail({
      from: this._sender,
      to: appointmentMaker,
      subject: '[Appointer] You have cancelled your appointment',
      html: '<h1>Cancelled your appointment</h1>\
             <p>Your appointment record for ' + calendar.title + ' calendar has been deleted.</p>'
    }, function(err, info) {
      if (err) console.log(err);
      else console.log('Message sent:', info.response);
    });
    // send mail to calendar maker
    this._transporter.sendMail({
      from: this._sender,
      to: calendarMaker,
      subject: '[Appointer - Cancel Booking] ' + appointment.name,
      html: '<h1>' + appointment.name + ' has cancelled their booking on  ' + calendar.title + ' calendar.</h1>'
    }, function(err, info) {
      if (err) console.log(err);
      else console.log('Message sent:', info.response);
    });
  },

  sendReschedule: function (appointmentMaker, calendarMaker, calendar, appointment) {
    // send mail to appointment maker
    this._transporter.sendMail({
      from: this._sender,
      to: appointmentMaker,
      subject: '[Appointer] A reschedule has been done',
      html: '<h1>Reschedule done</h1>\
             <p>For cancelling, visit\
              <a href="http://ppl-b02.cs.ui.ac.id/appointer/cancel/'+appointment.token+'">\
                http://ppl-b02.cs.ui.ac.id/appointer/cancel/'+appointment.token+'\
              </a>\
             </p>\
             <p>For reschedule, visit\
              <a href="http://ppl-b02.cs.ui.ac.id/appointer/reschedule/'+appointment.token+'">\
                http://ppl-b02.cs.ui.ac.id/appointer/reschedule/'+appointment.token+'\
              </a>\
             </p>'
    }, function(err, info) {
      if (err) console.log(err);
      else console.log('Message sent:', info.response);
    });
    // send mail to calendar maker
    this._transporter.sendMail({
      from: this._sender,
      to: calendarMaker,
      subject: '[Appointer - Reschedule] ' + appointment.name,
      html: '<h1>' + appointment.name + ' has made a reschedule.</h1><p>Here are the details</p>'
    }, function(err, info) {
      if (err) console.log(err);
      else console.log('Message sent:', info.response);
    });
  }
};

module.exports = function (req, res, next) {
  res.locals.mailer = mailer;
  res.locals.sender = 'no-reply@ppl-b02.cs.ui.ac.id';
  next();
};