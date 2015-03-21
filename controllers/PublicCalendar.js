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

  }
}

module.exports = PublicCalendarController;