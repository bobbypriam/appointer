var models = require('../models');

var DashboardController = {
  getIndex: function (req, res, next) {
    res.render('dashboard/index', {
      title: 'Dashboard | Appointer',
      user: req.session.user || { id: 1, username: 'widyanto.bagus', email: 'bobby.priambodo@gmail.com' }
    });
  },
  getCalendar: function (req, res, next) {
    // not needed
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
    // not needed
  },
  getEditCalendar: function (req, res, next) {
    // not needed
  },
  postEditCalendar: function (req, res, next) {
    var newCal = req.body.calendar;
    models.Calendar.find({ where: { id: newCal.id } })
      .then(function (oldCal) {
        oldCal.update(newCal).then(function () {
          res.json({ ok: true });
        });
      });
  },
  getManageSlots: function (req, res, next) {
    // not needed
  },
  postManageSlots: function (req, res, next) {
    var calendarID = req.body.calendarID;
    models.Slot.destroy({
      where: { CalendarId: calendarID, status: false }
    }).then(function() {
      req.body.slots.forEach(function (slot) {
        if (!slot.status) {
          slot.CalendarId = calendarID;
          models.Slot.create(slot);
        }
      });
    });
    models.Calendar.find(calendarID)
      .then(function (calendar) {
        calendar.update({
          published: req.body.published
        }).then(function (cal) {
          res.json({ ok: true });
        });
      });
  },
  postDeleteCalendar: function (req, res, next) {
    models.Calendar.find({
      where: { id: req.body.id }
    }).then(function (calendar) {
      if (calendar && calendar.title === req.body.title)
        calendar.destroy().then(function () {
          res.json({ ok: true });
        });
    });
  },
  getAppointmentList: function (req, res, next) {
    models.Slot.findAll({
      where: {
        CalendarId: req.params.id,
        status: true
      },
      order: 'date',
      include: [ models.Appointment ]
    }).then(function (slots) {
      res.json({ ok: true, slots: slots });
    });
  },
  postAskForReschedule: function (req, res, next) {

  },
  postDeleteAppointment: function (req, res, next) {
    var appointmentToDelete = req.body.appointment;
    models.Appointment.find({ where: { id: appointmentToDelete.id } })
      .then(function (appointment) {
        if (appointment)
          appointment.destroy().then(function () {
            models.Slot.find({ where: { id: appointmentToDelete.SlotId } }).
              then(function (slot) {
                slot.update({ status: false })
                  .then(function () {
                    res.json({ ok: true });
                  });
              });
          });
      });
  },
  getSettings: function (req, res, next) {
    // not needed
  },
  postSettings: function (req, res, next) {
    var email = req.body.details.email;
    models.User.find({ where: { id: req.session.user.id } })
      .then(function (user) {
        user.update({
          email: email
        }).then(function (usr) {
          req.session.user = usr;
          res.json({ ok: true });
        });
      });
  },
  getPartial: function (req, res, next) {
    res.render('dashboard/partials/' + req.params.name);
  },
  getAllCalendars: function (req, res, next) {
    var currentUser = req.session.user || ( req.session.user = { id: 1, username: 'widyanto.bagus', email: 'bobby.priambodo@gmail.com' });
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
  },
  getSlots: function (req, res, next) {
    var formattedSlots = [];
    models.Slot.findAll({
      where: { CalendarId: req.params.id }
    }).then(function (slots) {
      slots.forEach(function (slotData) {
        var slot = slotData.dataValues;
        formattedSlots.push({
          date: slot.date,
          time: slot.time,
          status: slot.status
        });
      });
      res.json({ ok: true, slots: formattedSlots });
    });
  }
}

module.exports = DashboardController;