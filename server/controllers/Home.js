var cas = require('../configs/cas');
var gcal = require('../configs/google-calendar')
var User = require('../models').User;
var Feedback = require('../models').Feedback;

var HomeController = {

  getIndex: function (req, res, next) {
    res.render('index', { title: 'Appointer' });
  },

  getLogin: function (req, res, next) {
    res.render('login', { title: 'SSO Login | Appointer' });
  },

  doLogin: function (req, res, next) {
    if (req.session.user) {
      if (req.session.user.email === '')
        res.redirect(res.locals.baseurl+'register');
      else
        res.redirect(res.locals.baseurl+'dashboard');
    } else {
      var ticket = req.query.ticket;
      if (ticket) {
        cas.validate(ticket, function (err, status, username) {
          if (err) {
            res.send({error: err});
          } else {
            User.findOrCreate({
              where: { username: username },
              defaults: { email: '' }
            }).spread(function (user, created) {
              req.session.user = user;
              if (created || user.email === '') {
                res.redirect(res.locals.baseurl+'register');
              } else {
                res.redirect(res.locals.baseurl+'dashboard');
              }
            });
          }
        });
      }
      else {
        res.redirect(cas.redirectURL);
      }
    }
  },

  getLogout: function (req, res, next) {
    delete req.session.user;
    res.redirect(cas.logoutURL);
  },

  getRegister: function (req, res, next) {
    if (!req.session.user)
      res.redirect(res.locals.baseurl+'login');
    else if (req.session.user.email !== '')
      res.redirect(res.locals.baseurl+'dashboard');
    else
      res.render('register', {
        title: 'Thank you for registering! | Appointer'
      });
  },

  postRegister: function (req, res, next) {
    var email = req.body.email;
    User.find({ where: { id: req.session.user.id } })
      .then(function (user) {
        user.update({
          email: email
        }).then(function () {
          req.session.user = user;
          res.redirect(res.locals.baseurl+'dashboard');
        });
      });
  },

  getUsageDemo: function (req, res, next) {
    res.render('usage-demo', {
      title: 'Getting Started - Usage Demonstration | Appointer'
    });
  },

  getFeedback: function (req, res, next) {
    var message = req.session.message;
    delete req.session.message;
    res.render('feedback', {
      title: 'Give Feedback | Appointer',
      captcha: req.recaptcha,
      message: message
    });
  },

  postFeedback: function (req, res, next) {
    if (!req.recaptcha.error) {
      var feedback = req.body;
      Feedback.create(feedback)
        .then(function () {
          req.session.message = { type: 'success', content: 'Response recorded! Thank you.' };
          res.redirect(res.locals.baseurl+'feedback');
        });
    } else {
      req.session.message = { type: 'danger', content: 'Whoops! Wrong recaptcha.' };
      res.redirect(res.locals.baseurl+'feedback');
    }
  },

  handleOAuth: function (req, res, next) {
    if (!req.session.user)
      return res.redirect(res.locals.baseurl+'login');

    var code = req.query.code;
    if (!code) {
      gcal.getAuthUrl(function (url) {
        res.redirect(url);
      });
    } else {
      gcal.getToken(code, function (err, tokens) {
        if (err) return res.json(err);
        User.find({ where: { id: req.session.user.id } })
          .then(function (user) {
            user.update({
              accessToken: tokens.access_token
            }).then(function () {
              res.json({ ok:true });
            });
          });
      });
    }
  },

  test: function (req, res, next) {
    User.find({ where: { id: req.session.user.id } })
      .then(function (user) {
        gcal.getCalendarList(user.accessToken, function (err, calendars) {
          if (err) return res.json(err);

          var calendarList = [];
          calendars.items.forEach(function (calendar) {
            calendarList.push({ id: calendar.id });
          });

          var today = new Date();
          var yesterday = new Date();
          yesterday.setDate(today.getDate() - 20);
          var resource = {
            timeMin: yesterday,
            timeMax: today,
            timeZone: 'Asia/Jakarta',
            items: calendarList
          }
          gcal.getCalendarFreebusy(resource, user.accessToken, function (err, freebusy) {
            if (err) return res.json(err);
            var busy = [];
            for (var calendar in freebusy.calendars)
              busy = busy.concat(freebusy.calendars[calendar].busy);
            res.json(busy);
          });
        });
      });
  }
};

module.exports = HomeController;