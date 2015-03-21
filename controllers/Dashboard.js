var DashboardController = {
  getIndex: function (req, res, next) {
    res.render('dashboard/index', {
      title: 'Dashboard | Appointer',
      user: req.session.user
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

  }
}

module.exports = DashboardController;