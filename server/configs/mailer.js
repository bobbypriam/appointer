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
  _sender: 'appointer@ppl-b02.cs.ui.ac.id',
  _templatePath: path.join(__dirname, '../views/emails'),

  sendAskForReschedule: function (to, reason, token, calendar) {
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

  sendNewBooking: function (appointmentMaker, calendarMaker, slot, appointment, calendar) {
    // send mail to appointment maker
    this._transporter.sendMail({
      from: this._sender,
      to: appointmentMaker,
      subject: '[Appointer - ' + calendar.title + '] You have made a new appointment!',
      html: '<h1>Successfully made appointment for ' + calendar.title + '</h1>' +
            (calendar.appointeeNotification ? '<p>' + calendar.appointeeNotification + '</p>' : '') +
            '<p>Here are the details</p>' +
            '<ul>' +
            '<li><strong>Date:</strong> ' + slot.date.toISOString().split('T')[0] + '</li>' +
            '<li><strong>Time:</strong> ' + slot.time.split(':').splice(0,2).join(':') + '</li>' +
            '<li><strong>Name:</strong> ' + appointment.name + '</li>' +
            '<li><strong>Email:</strong> ' + appointment.email + '</li>' +
            '<li><strong>Phone:</strong> ' + appointment.phone + '</li>' +
            '</ul>' +
            '<p>For cancelling, visit' +
            '<a href="http://ppl-b02.cs.ui.ac.id/appointer/cancel/'+appointment.token+'">' +
              'http://ppl-b02.cs.ui.ac.id/appointer/cancel/'+appointment.token+'' +
            '</a>' +
            '</p>' +
            '<p>For reschedule, visit' +
            '<a href="http://ppl-b02.cs.ui.ac.id/appointer/reschedule/'+appointment.token+'">' +
              'http://ppl-b02.cs.ui.ac.id/appointer/reschedule/'+appointment.token+'' +
            '</a>' +
            '</p>'
    }, function(err, info) {
      if (err) console.log(err);
      else console.log('Message sent:', info.response);
    });
    // send mail to calendar maker
    this._transporter.sendMail({
      from: this._sender,
      to: calendarMaker,
      subject: '[Appointer - ' + calendar.title + ': New Booking] ' + appointment.name,
      html: '<h1>' + appointment.name + ' has made a booking for ' + calendar.title + '.</h1>' +
            (calendar.userNotification ? '<p>' + calendar.userNotification + '</p>' : '') +
            '<p>Here are the details</p>' +
            '<ul>' +
             '<li><strong>Date:</strong> ' + slot.date.toISOString().split('T')[0] + '</li>' +
             '<li><strong>Time:</strong> ' + slot.time.split(':').splice(0,2).join(':') + '</li>' +
             '<li><strong>Name:</strong> ' + appointment.name + '</li>' +
             '<li><strong>Email:</strong> ' + appointment.email + '</li>' +
             '<li><strong>Phone:</strong> ' + appointment.phone + '</li>' +
            '</ul>'
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
      subject: '[Appointer - ' + calendar.title + '] You have cancelled your appointment',
      html: '<h1>Cancelled your appointment for ' + calendar.title + '</h1>' +
            '<p>Your appointment record has been deleted.</p>'
    }, function(err, info) {
      if (err) console.log(err);
      else console.log('Message sent:', info.response);
    });
    // send mail to calendar maker
    this._transporter.sendMail({
      from: this._sender,
      to: calendarMaker,
      subject: '[Appointer - ' + calendar.title + ': Cancel Booking] ' + appointment.name,
      html: '<h1>' + appointment.name + ' has cancelled their booking on  ' + calendar.title + ' calendar.</h1>'
    }, function(err, info) {
      if (err) console.log(err);
      else console.log('Message sent:', info.response);
    });
  },

  sendReschedule: function (appointmentMaker, calendarMaker, calendar, slot, appointment) {
    // send mail to appointment maker
    this._transporter.sendMail({
      from: this._sender,
      to: appointmentMaker,
      subject: '[Appointer - ' + calendar.title + '] You have rescheduled your appointment',
      html: '<h1>Rescheduled your appointment for ' + calendar.title + '</h1>' +
            '<p>Here are the details</p>' +
            '<ul>' +
             '<li><strong>Date:</strong> ' + slot.date.toISOString().split('T')[0] + '</li>' +
             '<li><strong>Time:</strong> ' + slot.time.split(':').splice(0,2).join(':') + '</li>' +
             '<li><strong>Name:</strong> ' + appointment.name + '</li>' +
             '<li><strong>Email:</strong> ' + appointment.email + '</li>' +
             '<li><strong>Phone:</strong> ' + appointment.phone + '</li>' +
            '</ul>' +
            '<p>For cancelling, visit' +
             '<a href="http://ppl-b02.cs.ui.ac.id/appointer/cancel/'+appointment.token+'">' +
               'http://ppl-b02.cs.ui.ac.id/appointer/cancel/'+appointment.token+'' +
             '</a>' +
            '</p>' +
            '<p>For reschedule, visit' +
             '<a href="http://ppl-b02.cs.ui.ac.id/appointer/reschedule/'+appointment.token+'">' +
               'http://ppl-b02.cs.ui.ac.id/appointer/reschedule/'+appointment.token+'' +
             '</a>' +
            '</p>'
    }, function(err, info) {
      if (err) console.log(err);
      else console.log('Message sent:', info.response);
    });
    // send mail to calendar maker
    this._transporter.sendMail({
      from: this._sender,
      to: calendarMaker,
      subject: '[Appointer - ' + calendar.title + ': Reschedule] ' + appointment.name,
      html: '<h1>' + appointment.name + ' has made a reschedule for ' + calendar.title + '.</h1>' +
            '<p>Here are the details</p>' +
            '<ul>' +
             '<li><strong>Date:</strong> ' + slot.date.toISOString().split('T')[0] + '</li>' +
             '<li><strong>Time:</strong> ' + slot.time.split(':').splice(0,2).join(':') + '</li>' +
             '<li><strong>Name:</strong> ' + appointment.name + '</li>' +
             '<li><strong>Email:</strong> ' + appointment.email + '</li>' +
             '<li><strong>Phone:</strong> ' + appointment.phone + '</li>' +
            '</ul>'
    }, function(err, info) {
      if (err) console.log(err);
      else console.log('Message sent:', info.response);
    });
  },

  sendFeedback: function (feedback) {
    this._transporter.sendMail({
      from: this._sender,
      to: 'bobby.priambodo@gmail.com',
      subject: '[Appointer] New feedback!',
      html: '<h1>Somebody posted a new feedback!</h1>' +
            '<p>Here are the details</p>' +
            '<ul>' +
             '<li><strong>Name:</strong> ' + feedback.name + '</li>' +
             '<li><strong>Email:</strong> ' + feedback.email + '</li>' +
             '<li><strong>Content:</strong> ' + feedback.content + '</li>' +
            '</ul>'
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