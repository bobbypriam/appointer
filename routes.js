var express = require('express');
var router = express.Router();

var HomeController = require('./controllers/Home');
var DashboardController = require('./controllers/Dashboard');
var PublicCalendarController = require('./controllers/PublicCalendar');

// public routes
router.get('/', HomeController.getIndex);
router.get('/login', HomeController.getLogin);
router.get('/sso-login', HomeController.doLogin);
router.get('/logout', HomeController.getLogout);
router.get('/register', HomeController.getRegister);
router.post('/register', HomeController.postRegister);

// dashboard routes
router.get('/dashboard', DashboardController.getIndex);

// public calendar routes
router.get('/:name', PublicCalendarController.get);

module.exports = router;