var models = require('../models');

var DashboardController = {
  getIndex: function (req, res, next) {
    res.render('dashboard/index', {
      title: 'Dashboard | Appointer',
      user: req.session.user //|| { id: 1, username: 'widyanto.bagus', email: 'bobby.priambodo@gmail.com' }
    });
  },
  getCalendar: function (req, res, next) {

  },
  postNewCalendar: function (req, res, next) {
    var calendar = {
      title: req.body.title,
      description: req.body.description,
      url: req.body.url,
      duration: req.body.duration,
      startDate: req.body.start,
      endDate: req.body.end,
      published: false,
      UserId: req.session.user.id
    }
    models.Calendar.create(calendar)
      .then(function(cal) {
        res.json({ ok: true, calendar: cal.dataValues });
      });
  },
  togglePublish: function (req, res, next) {

  },
  getEditCalendar: function (req, res, next) {

  },
  postEditCalendar: function (req, res, next) {

  },
  getManageSlots: function (req, res, next) {

  },
  postManageSlots: function (req, res, next) {
    var calendarID = req.body.calendarID;
    console.log(calendarID);
    models.Slot.destroy({
      where: { CalendarId: calendarID }
    }).then(function() {
      req.body.slots.forEach(function (slot) {
        models.Slot.create(slot);
      });
    });
    res.json({ ok: true });
  },
  postDeleteCalendar: function (req, res, next) {

  },
  getAppointmentList: function (req, res, next) {

  },
  postAskForReschedule: function (req, res, next) {

  },
  postDeleteAppointment: function (req, res, next) {

  },
  getSettings: function (req, res, next) {

  },
  postSettings: function (req, res, next) {

  },
  getPartial: function (req, res, next) {
    res.render('dashboard/partials/' + req.params.name);
  },
  getAllCalendars: function (req, res, next) {
    var currentUser = req.session.user;// || ( req.session.user = { id: 1, username: 'widyanto.bagus', email: 'bobby.priambodo@gmail.com' });
    models.User.find({
      where: { id: currentUser.id },
      include: [ models.Calendar ]
    }).then(function (user) {
      res.json({ calendars: user.Calendars });
    });
  },
  redirectIndex: function (req, res, next) {
    res.redirect(res.locals.baseurl+'/dashboard');
  },
  getUser: function (req, res, next) {
    var user = {};
    user.id = req.session.user.id;
    user.username = req.session.user.username;
    user.email = req.session.user.email;
    res.json(user);
  },
  checkUrl: function (req, res, next) {
    var url = req.body.url;
    models.Calendar.find({
      where: { url: url }
    }).then(function (calendar) {
      var ok = !calendar ? true : false;
      res.json({ ok: ok });
    });
  }
}

module.exports = DashboardController;