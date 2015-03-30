var models = require('../models');

var PublicCalendarController = {
  get: function (req, res, next) {
    var name = req.params.name;
    res.render('public-calendar/index', {
      title: name + ' | Appointer'
    });
  },
  postBooking: function (req, res, next) {

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
  getPartial: function (req, res, next) {
    res.render('public-calendar/partials/' + req.params.name);
  }
}

module.exports = PublicCalendarController;