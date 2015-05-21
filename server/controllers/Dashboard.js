var models = require('../models');
var User = models.User;
var Calendar = models.Calendar;
var Slot = models.Slot;
var Appointment = models.Appointment;

var DashboardController = {
  
  getIndex: function (req, res, next) {
    res.render('dashboard/index', {
      title: 'Dashboard | Appointer',
      user: req.session.user || { id: 1, username: 'widyanto.bagus', email: 'bobby.priambodo@gmail.com' }
    });
  },

  getUser: function (req, res, next) {
    User.find(req.session.user.id)
      .then(function (user) {
        res.json(user);
      });
  },

  getAllCalendars: function (req, res, next) {
    var currentUser = req.session.user || ( req.session.user = { id: 1, username: 'widyanto.bagus', email: 'bobby.priambodo@gmail.com' });
    User.find({
      where: { id: currentUser.id },
      include: [ Calendar ]
    }).then(function (user) {
      res.json({ calendars: user.Calendars });
    });
  },

  checkUrl: function (req, res, next) {
    var url = req.body.url;
    Calendar.find({
      where: { url: url }
    }).then(function (calendar) {
      var ok = !calendar;
      res.json({ ok: ok });
    });
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
      closed: false,
      background: '#fff',
      userNotification: '',
      appointeeNotification: '',
      UserId: req.session.user.id
    };
    Calendar.create(calendar)
      .then(function(cal) {
        res.json({ ok: true, calendar: cal.dataValues });
      });
  },
  
  postEditCalendar: function (req, res, next) {
    var newCal = req.body.calendar;
    Calendar.find({ where: { id: newCal.id } })
      .then(function (oldCal) {
        oldCal.update(newCal).then(function () {
          res.json({ ok: true });
        });
      });
  },
  
  getSlots: function (req, res, next) {
    var formattedSlots = [];
    Slot.findAll({
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
  },

  postManageSlots: function (req, res, next) {
    var calendarID = req.body.calendarID;
    Slot.destroy({
      where: { CalendarId: calendarID, status: false }
    }).then(function() {
      req.body.slots.forEach(function (slot) {
        if (!slot.status) {
          slot.CalendarId = calendarID;
          Slot.create(slot);
        }
      });
    });
    Calendar.find(calendarID)
      .then(function (calendar) {
        calendar.update({
          published: req.body.published
        }).then(function (cal) {
          res.json({ ok: true });
        });
      });
  },

  postDeleteCalendar: function (req, res, next) {
    Calendar.find({
      where: { id: req.body.id }
    }).then(function (calendar) {
      if (calendar && calendar.title === req.body.title)
        calendar.destroy().then(function () {
          res.json({ ok: true });
        });
    });
  },

  getAppointmentList: function (req, res, next) {
    var whereClause = { status: true };
    if (req.params.id)
      whereClause.CalendarId = req.params.id;
    else
      whereClause.date = {
        $like: (new Date()).toISOString().split('T')[0] + '%'
      };

    Slot.findAll({
      where: whereClause,
      order: 'date',
      include: [ Appointment ]
    }).then(function (slots) {
      res.json({ ok: true, slots: slots });
    });
  },

  postAskForReschedule: function (req, res, next) {
    var data = req.body;
    res.locals.mailer.sendAskForReschedule(data.email, data.reason, data.token);
    res.json({ ok: true, data: data });
  },

  postDeleteAppointment: function (req, res, next) {
    var appointmentToDelete = req.body.appointment;
    Appointment.find({ where: { id: appointmentToDelete.id } })
      .then(function (appointment) {
        if (appointment)
          appointment.destroy().then(function () {
            Slot.find({ where: { id: appointmentToDelete.SlotId } }).
              then(function (slot) {
                slot.update({ status: false })
                  .then(function () {
                    res.json({ ok: true });
                  });
              });
          });
      });
  },

  postSettings: function (req, res, next) {
    var email = req.body.details.email;
    User.find({ where: { id: req.session.user.id } })
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

  redirectIndex: function (req, res, next) {
    res.redirect(res.locals.baseurl+'dashboard');
  }
};

module.exports = DashboardController;