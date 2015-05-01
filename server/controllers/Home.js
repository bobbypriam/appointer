var cas = require('../configs/cas');
var User = require('../models').User;

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
  }
};

module.exports = HomeController;