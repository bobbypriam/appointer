var express = require('express');
var router = express.Router();

var recaptcha = require('./configs/recaptcha');

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
router.get('/getting-started', HomeController.getUsageDemo);
router.get('/feedback', recaptcha.middleware.render, HomeController.getFeedback);
router.post('/feedback', recaptcha.middleware.verify, HomeController.postFeedback);
router.get('/oauth', HomeController.handleOAuth);
router.get('/test', HomeController.test);

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
router.get('/dashboard/slots/busy/:id', DashboardController.getBusyTimes);
router.post('/dashboard/slots/post', DashboardController.postManageSlots);
router.get('/dashboard/appointments/get/:id?', DashboardController.getAppointmentList);
router.post('/dashboard/appointments/delete', DashboardController.postDeleteAppointment);
router.post('/dashboard/appointments/reschedule', DashboardController.postAskForReschedule);

router.get('/dashboard/*', DashboardController.redirectIndex);

// public calendar routes
router.get('/partials/:name', PublicCalendarController.getPartial);
router.get('/calendar/:name', PublicCalendarController.getCalendar);
router.post('/create-appointment', PublicCalendarController.postBooking);
router.post('/reschedule-appointment', PublicCalendarController.postReschedule);

// cancel routes
router.get('/cancel/success', PublicCalendarController.getCancelSuccess);
router.get('/cancel/:token', PublicCalendarController.getCancel);
router.post('/cancel/:token', PublicCalendarController.postCancel);

// reschedule routes
router.get('/reschedule/:token', PublicCalendarController.getReschedule);

router.get('/:name', PublicCalendarController.get);

router.get('/:name/*', PublicCalendarController.redirectIndex);

module.exports = router;