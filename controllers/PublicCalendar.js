var models = require('../models');

var PublicCalendarController = {
  get: function (req, res, next) {
    models.Calendar.find({
      where: { url: req.params.name }
    }).then(function (calendar) {
      res.render('public-calendar/index', {
        title: calendar.title + ' | Appointer',
        calendar: calendar
      });
    });
  },
  postBooking: function (req, res, next) {
    var appointment = req.body.appointment;
    models.Slot.find({ where: appointment.slot })
      .then(function(slot) {
        slot.update({
          status: true
        }).then(function (s) {
          appointment.appointment.SlotId = s.id;
          models.Appointment.create(appointment.appointment)
            .then(function(app) {
              res.json({ ok: true, appointment: appointment });
            });
        });
      });
  },
  postCancel: function (req, res, next) {

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
  redirectIndex: function (req, res, next) {
    res.redirect(res.locals.baseurl+'/'+req.params.name);
  },
  getPartial: function (req, res, next) {
    res.render('public-calendar/partials/' + req.params.name);
  }
}

module.exports = PublicCalendarController;