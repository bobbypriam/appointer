var models = require('../models');

var DashboardController = {
  getIndex: function (req, res, next) {
    res.render('dashboard/index', {
      title: 'Dashboard | Appointer',
      user: req.session.user || { id: 1, username: 'widyanto.bagus', email: 'bobby.priambodo@gmail.com' }
    });
  },
  getCalendar: function (req, res, next) {

  },
  postNewCalendar: function (req, res, next) {

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
    var currentUser = req.session.user = { id: 1, username: 'widyanto.bagus', email: 'bobby.priambodo@gmail.com' };
    models.User.find({
      where: ['id', currentUser.id],
      include: [ models.Calendar ]
    }).then(function (user) {
      res.json({ calendars: user.Calendars });
    });
  },
  redirectIndex: function (req, res, next) {
    res.redirect('/dashboard');
  },
  getUser: function (req, res, next) {
    var user = {};
    user.id = req.session.user.id;
    user.username = req.session.user.username;
    user.email = req.session.user.email;
    res.json(user);
  }
}

module.exports = DashboardController;