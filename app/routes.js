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
router.get('/dashboard/partials/:name', DashboardController.getPartial);

// json api calls
router.get('/dashboard/calendars', DashboardController.getAllCalendars);
router.get('/dashboard/user', DashboardController.getUser);
router.post('/dashboard/user', DashboardController.postSettings);
router.post('/dashboard/checkurl', DashboardController.checkUrl);
router.post('/dashboard/calendars/new', DashboardController.postNewCalendar);
router.post('/dashboard/calendars/edit', DashboardController.postEditCalendar);
router.post('/dashboard/calendars/delete', DashboardController.postDeleteCalendar);
router.get('/dashboard/slots/get/:id', DashboardController.getSlots);
router.post('/dashboard/slots/post', DashboardController.postManageSlots);
router.get('/dashboard/appointments/get/:id', DashboardController.getAppointmentList);
router.post('/dashboard/appointments/delete', DashboardController.postDeleteAppointment);

router.get('/dashboard/*', DashboardController.redirectIndex);

// public calendar routes
router.get('/partials/:name', PublicCalendarController.getPartial);
router.get('/calendar/:name', PublicCalendarController.getCalendar);
router.post('/create-appointment', PublicCalendarController.postBooking);

// cancel routes
router.get('/cancel/:token', PublicCalendarController.getCancel);
router.post('/cancel/:token', PublicCalendarController.postCancel);

router.get('/:name', PublicCalendarController.get);

router.get('/:name/*', PublicCalendarController.redirectIndex);

module.exports = router;