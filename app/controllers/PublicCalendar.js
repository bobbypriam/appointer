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
              res.locals.mailer.sendNewBooking(app.email, s.Calendar.User.email, app);
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
        res.locals.mailer.sendCancel(appointment.email,
              appointment.Slot.Calendar.User.email,
              appointment.Slot.Calendar, appointment);
        appointment.destroy().then(function () {
          res.redirect(res.locals.baseurl+'cancel/success');
        });
      });
    });
  },
  postReschedule: function (req, res, next) {
    var newSlot = req.body.slot;
    var oldAppointmentId = req.body.appointmentId;
    models.Appointment.find({
      where: { id: oldAppointmentId },
      include: [ 
        { model: models.Slot, include: [
          { model: models.Calendar, include: [
            { model: models.User }
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
        models.Slot.find({
          where: newSlot,
          include: [
            { model: models.Calendar, include: [ models.User ] }
          ]
        }).then(function(slot) {
          // set new slot to true
          slot.update({
            status: true
          }).then(function (s) {
            data.SlotId = s.id;
            data.token = s.id + '' +
              require('crypto').randomBytes(30).toString('hex');
            models.Appointment.create(data)
              .then(function(app) {
                res.locals.mailer.sendReschedule(app.email, s.Calendar.User.email, s.Calendar, app);
                res.json({ ok: true });
              });
          });
        });
      });
    });
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
  getReschedule: function (req, res, next) {
    var token = req.params.token;
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
      if (appointment)
        res.render('public-calendar/reschedule', {
          title: 'Reschedule Appointment | Appointer',
          appointment: appointment
        });
      else
        next();
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