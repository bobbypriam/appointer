
var models = require('../models');

var PublicCalendarController = {
  get: function (req, res, next) {
    models.Calendar.find({
      where: { url: req.params.name, published: true }
    }).then(function (calendar) {
      if (calendar)
        res.render('public-calendar/index', {
          title: calendar.title + ' | Appointer',
          calendar: calendar
        });
      else {
        next();
      }
    });
  },
  postBooking: function (req, res, next) {
    var appointment = req.body.appointment;
    models.Slot.find({
      where: appointment.slot,
      include: [
        { model: models.Calendar, include: [ models.User ] }
      ]
    }).then(function(slot) {
        slot.update({
          status: true
        }).then(function (s) {
          appointment.appointment.SlotId = s.id;
          appointment.appointment.token = s.id + '' +
              require('crypto').randomBytes(30).toString('hex');
          models.Appointment.create(appointment.appointment)
            .then(function(app) {
              // send mail to appointment maker
              res.locals.mailer.sendMail({
                from: res.locals.sender,
                to: app.email,
                subject: '[Appointer] You have made a new appointment!',
                html: '<h1>Successfully made appointment</h1>\
                       <p>Here are the details</p>\
                       <p>For cancelling, visit\
                        <a href="http://ppl-b02.cs.ui.ac.id/appointer/cancel/'+app.token+'">\
                          http://ppl-b02.cs.ui.ac.id/appointer/cancel/'+app.token+'\
                        </a>\
                       </p>\
                       <p>For reschedule, visit\
                        <a href="http://ppl-b02.cs.ui.ac.id/appointer/reschedule/'+app.token+'">\
                          http://ppl-b02.cs.ui.ac.id/appointer/reschedule/'+app.token+'\
                        </a>\
                       </p>'
              }, function(err, info) {
                if (err) console.log(err);
                else console.log('Message sent:', info.response);
              });
              // send mail to calendar maker
              res.locals.mailer.sendMail({
                from: res.locals.sender,
                to: s.Calendar.User.email,
                subject: '[Appointer - New Booking] ' + app.name,
                html: '<h1>' + app.name + ' has made a booking.</h1><p>Here are the details</p>'
              }, function(err, info) {
                if (err) console.log(err);
                else console.log('Message sent:', info.response);
              });
              res.json({ ok: true, appointment: appointment });
            });
        });
      });
  },
  postCancel: function (req, res, next) {
    var token = req.body.token;
    models.Appointment.find({
      where: { token: token },
      include: [ 
        { model: models.Slot, include: [
          { model: models.Calendar, include: [
            { model: models.User }
          ]} 
        ]}
      ]
    }).then(function (appointment) {
      appointment.Slot.update({
        status: false
      }).then(function () {
        // send mail to appointment maker
        res.locals.mailer.sendMail({
          from: res.locals.sender,
          to: appointment.email,
          subject: '[Appointer] You have cancelled your appointment',
          html: '<h1>Cancelled your appointment</h1>\
                 <p>Your appointment record for ' + appointment.Slot.Calendar.title + ' calendar has been deleted.</p>'
        }, function(err, info) {
          if (err) console.log(err);
          else console.log('Message sent:', info.response);
        });
        // send mail to calendar maker
        res.locals.mailer.sendMail({
          from: res.locals.sender,
          to: appointment.Slot.Calendar.User.email,
          subject: '[Appointer - Cancel Booking] ' + appointment.name,
          html: '<h1>' + appointment.name + ' has cancelled their booking on  ' + appointment.Slot.Calendar.title + ' calendar.</h1>'
        }, function(err, info) {
          if (err) console.log(err);
          else console.log('Message sent:', info.response);
        });
        appointment.destroy().then(function () {
          res.redirect(res.locals.baseurl+'cancel/success');
        });
      });
    });
  },
  postReschedule: function (req, res, next) {

  },
  getCalendar: function (req, res, next) {
    models.Calendar.find({
      where: { url: req.params.name },
      include: [ models.Slot ]
    }).then(function (calendar) {
      res.json(calendar);
    });
  },
  getCancel: function (req, res, next) {
    var token = req.params.token;
    models.Appointment.find({
      where: { token: token },
      include: [ models.Slot ]
    }).then(function (appointment) {
      res.render('public-calendar/cancel', {
        title: 'Cancel Appointment | Appointer',
        appointment: appointment
      });
    });
  },
  getCancelSuccess: function (req, res, next) {
    res.render('public-calendar/cancel-success', {
      title: 'Success | Appointer'
    });
  },
  redirectIndex: function (req, res, next) {
    res.redirect(res.locals.baseurl+req.params.name);
  },
  getPartial: function (req, res, next) {
    res.render('public-calendar/partials/' + req.params.name);
  }
};

module.exports = PublicCalendarController;