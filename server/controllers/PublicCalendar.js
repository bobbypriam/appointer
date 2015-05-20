var models = require('../models');
var User = models.User;
var Calendar = models.Calendar;
var Slot = models.Slot;
var Appointment = models.Appointment;

var PublicCalendarController = {

  get: function (req, res, next) {
    Calendar.find({
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

  getCalendar: function (req, res, next) {
    Calendar.find({
      where: { url: req.params.name },
      include: [ Slot ]
    }).then(function (calendar) {
      res.json(calendar);
    });
  },

  postBooking: function (req, res, next) {
    var appointment = req.body.appointment;
    Slot.find({
      where: appointment.slot,
      include: [
        { model: Calendar, include: [ User ] }
      ]
    }).then(function(slot) {
        slot.update({
          status: true
        }).then(function (s) {
          appointment.appointment.SlotId = s.id;
          appointment.appointment.token = s.id + '' +
              require('crypto').randomBytes(30).toString('hex');
          Appointment.create(appointment.appointment)
            .then(function(app) {
              res.locals.mailer.sendNewBooking(app.email, s.Calendar.User.email, s, app, s.Calendar);
              res.json({ ok: true, appointment: appointment });
            });
        });
      });
  },

  getCancel: function (req, res, next) {
    var token = req.params.token;
    Appointment.find({
      where: { token: token },
      include: [ Slot ]
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

  postCancel: function (req, res, next) {
    var token = req.body.token;
    Appointment.find({
      where: { token: token },
      include: [ 
        { model: Slot, include: [
          { model: Calendar, include: [
            { model: User }
          ]} 
        ]}
      ]
    }).then(function (appointment) {
      appointment.Slot.update({
        status: false
      }).then(function () {
        res.locals.mailer.sendCancel(appointment.email,
              appointment.Slot.Calendar.User.email,
              appointment.Slot.Calendar, appointment);
        appointment.destroy().then(function () {
          res.redirect(res.locals.baseurl+'cancel/success');
        });
      });
    });
  },

  getReschedule: function (req, res, next) {
    var token = req.params.token;
    Appointment.find({
      where: { token: token },
      include: [ 
        { model: Slot, include: [
          { model: Calendar, include: [
            { model: User }
          ]} 
        ]}
      ]
    }).then(function (appointment) {
      if (appointment)
        res.render('public-calendar/reschedule', {
          title: 'Reschedule Appointment | Appointer',
          appointment: appointment
        });
      else
        next();
    });
  },

  postReschedule: function (req, res, next) {
    var newSlot = req.body.slot;
    var oldAppointmentId = req.body.appointmentId;
    Appointment.find({
      where: { id: oldAppointmentId },
      include: [ 
        { model: Slot, include: [
          { model: Calendar, include: [
            { model: User }
          ]} 
        ]}
      ]
    }).then(function (appointment) {
      var slot = appointment.Slot;
      // set old slot to false
      slot.update({
        status: false
      }).then(function() {
        // save old appointment data
        var data = {
          name: appointment.name,
          email: appointment.email,
          phone: appointment.phone
        };
        // delete appointment
        appointment.destroy();

        // find new slot
        Slot.find({
          where: newSlot,
          include: [
            { model: Calendar, include: [ User ] }
          ]
        }).then(function(slot) {
          // set new slot to true
          slot.update({
            status: true
          }).then(function (s) {
            data.SlotId = s.id;
            data.token = s.id + '' +
              require('crypto').randomBytes(30).toString('hex');
            Appointment.create(data)
              .then(function(app) {
                res.locals.mailer.sendReschedule(app.email, s.Calendar.User.email, s.Calendar, s, app);
                res.json({ ok: true });
              });
          });
        });
      });
    });
  },
  
  getPartial: function (req, res, next) {
    res.render('public-calendar/partials/' + req.params.name);
  },

  redirectIndex: function (req, res, next) {
    res.redirect(res.locals.baseurl+req.params.name);
  }
};

module.exports = PublicCalendarController;