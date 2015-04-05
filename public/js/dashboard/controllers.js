'use strict';

/* Controllers */

angular.module('appointer.controllers', [])

  .controller('MainCtrl', ['$scope', '$location', 'CalendarService',
    function MainCtrl($scope, $location, CalendarService) {
      CalendarService.getCalendars(function (calendars) {});
      $scope.calendars = CalendarService.calendars;

      $scope.form = {};
      var step = $scope.step = 1;
      
      $scope.next = function () {
        if ($scope.urlStatus !== 'Available')
          return;

        if (step == 1) {
          step++;
          update(step);
        } else {
          CalendarService.postCalendar($scope.form, function (data) {
            if (data.ok) {
              CalendarService.getCalendars(function (calendar) {
                $scope.restartForm();
                $location.path('dashboard/' + data.calendar.url + '/slots');
                $('.modal').modal('toggle');
                $('.modal-backdrop').remove();
              });
            }
          });
        }
      };

      $scope.back = function () {
        step--;
        update(step);
      };

      $scope.restartForm = function () {
        $scope.form = {};
        $scope.urlStatus = '';
        $scope.step = step = 1;
        show(step);
      };

      $scope.checkUrl = function () {
        if (!$scope.form.url) {
          $scope.urlStatus = 'URL cannot be empty!';
          return;
        }
        $scope.status = 'Checking...'
        CalendarService.checkUrl($scope.form.url, function (response) {
          if (response.ok)
            $scope.urlStatus = 'Available';
          else
            $scope.urlStatus = 'Not available';
        });
      };

      $scope.restartForm();

      // Functions
      function update(step) {
        $scope.step = step;
        show(step);
      }

      function show(step) {
        var steps = ['', 'one', 'two'];
        $('.step-one, .step-two').hide();
        $('.step-' + steps[step]).show();
      }
    }])

  .controller('IndexCtrl', ['$scope', 'CalendarService', 
    function IndexCtrl($scope, CalendarService) {
      $scope.calendars = CalendarService.calendars;
    }])

  .controller('CalendarDetailCtrl', ['$scope', '$window', '$location', '$routeParams', 'CalendarService', 
    function CalendarDetailCtrl($scope, $window, $location, $routeParams, CalendarService) {
      var calendar = $scope.calendar = $.grep(CalendarService.calendars,
        function (element) {
          return element.url == $routeParams.name;
        })[0];

      fetchAppointments();

      function fetchAppointments() {
        CalendarService.getAppointments(calendar.id, function (response) {
          if (response.ok) {
            var slots = response.slots;
            $scope.appointments = [];
            slots.forEach(function (slot) {
              $scope.appointments.push({
                date: slot.date.split('T')[0],
                time: slot.time.split(':')[0] + ':' + slot.time.split(':')[1],
                name: slot.Appointment.name
              });
            });
          }
        });
      }

      $scope.redirectToCalendar = function (url) {
        $window.open(url, '_blank');
      }

      $scope.togglePublish = function ($event) {
        $event.preventDefault();
        var newCal = {
          id: calendar.id,
          published: !calendar.published
        };
        CalendarService.updateCalendar(newCal, function (response) {
          if (response.ok) {
            CalendarService.getCalendars(function (calendar) {});
            calendar.published = !calendar.published;
          }
        });
      }

      $scope.checkTitle = function () {
        if ($scope.form.title == $scope.calendar.title)
          $('.delete-button').attr('disabled', false);
        else
          $('.delete-button').attr('disabled', true);
      }

      $scope.cancelDelete = function () {
        $scope.form.title = '';
      }

      $scope.delete = function () {
        var calendar = {
          id: $scope.calendar.id,
          title: $scope.form.title
        }
        CalendarService.deleteCalendar(calendar, function (response) {
          if (response.ok) {
            CalendarService.getCalendars(function (calendar) {
              $('.modal-backdrop').remove();
              $location.path('dashboard');
            });
          }
        });
      }
    }])

  .controller('EditCalendarDetailCtrl', ['$scope', '$location', '$routeParams', 'CalendarService', 
    function EditCalendarDetailCtrl($scope, $location, $routeParams, CalendarService) {
      var calendar = $.grep(CalendarService.calendars,
        function (element) {
          return element.url == $routeParams.name;
        })[0];

      $scope.calendar = {
        title: calendar.title,
        description: calendar.description,
        url: calendar.url,
        duration: calendar.duration,
        startDate: calendar.startDate.split('T')[0],
        endDate: calendar.endDate.split('T')[0]
      }

      $scope.submitPost = function () {
        var newCal = {
          id: calendar.id,
          title: $scope.calendar.title,
          description: $scope.calendar.description,
          url: $scope.calendar.url,
          duration: $scope.calendar.duration,
          startDate: $scope.calendar.startDate,
          endDate: $scope.calendar.endDate
        };
        CalendarService.updateCalendar(newCal, function (response) {
          if (response.ok) {
            CalendarService.getCalendars(function (calendar) {});
            alert('Success!');
          }
        });
      }
    }])

  .controller('ManageSlotsCtrl', ['$scope', '$location', '$routeParams', 'CalendarService', 
    function ManageSlotsCtrl($scope, $location, $routeParams, CalendarService) {
      $('tbody').css('height', $(window).height() - 200);

      var calendar = $scope.calendar = CalendarService.calendars.filter(function(cal) {
        return cal.url == $routeParams.name;
      })[0];

      var startDate = new Date(calendar.startDate.substring(0, calendar.startDate.indexOf('T')));
      var endDate = new Date(calendar.endDate.substring(0, calendar.endDate.indexOf('T')));
      var duration = calendar.duration;
      var startIdx = 0;
      var endIdx = 6;

      populateSelected();
      populateDays();
      populateTimes();

      $scope.toggleSlot = function (day, time, $event) {
        var target = $($event.target);
        target.toggleClass('selected');
        if (target.hasClass('selected')) {
          $scope.selected.push({
            date: day,
            time: time,
            status: false
          });
        } else {
          $scope.selected = $.grep($scope.selected, function(slot) {
            return slot.date !== day || slot.time !== time;
          });
        }
      }

      $scope.checkIfSelected = function (day, time) {
        return $.grep($scope.selected, function(slot) {
          return slot.date == day && slot.time == time;
        }).length !== 0;
      }

      $scope.floatTheadOptions = {
        scrollContainer: function($table){
            return $table.closest('#calendar');
        }
      }

      $scope.prev = function () {
        shift(-7);
      }

      $scope.next = function () {
        if ($scope.days.length < 7)
          return;
        shift(7);
      }

      $scope.save = function () {
        submitSlots(calendar.published);
      }

      $scope.saveAndPublish = function () {
        submitSlots(true);
      }

      function submitSlots(published) {
        var slots = {
          calendarID: calendar.id,
          slots: $scope.selected,
          published: published
        }
        CalendarService.postSlots(slots, function (response) {
          if (response.ok) {
            CalendarService.getCalendars(function (calendars) {
              $location.path('dashboard/'+calendar.url);
            });
          }
        });
      }

      function shift(inc) {
        if (startIdx + inc >= 0) {
          startIdx += inc;
          endIdx += inc;
          populateDays();
        }
      }

      function populateSelected() {
        $scope.selected = [];
        CalendarService.getSlots(calendar.id, function (response) {
          if (response.ok) {
            response.slots.forEach(function (slot) {
              $scope.selected.push({
                date: slot.date.split('T')[0],
                time: slot.time.split(':')[0] + ':' + slot.time.split(':')[1],
                status: slot.status
              });
            });
          }
        });
      }

      function populateDays() {
        $scope.days = [];
        for (var i = startIdx; i <= endIdx; i++) {
          var current = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
          current.setTime(startDate.getTime());
          current.setDate(startDate.getDate() + i);
          current = new Date(current.getTime());
          if (current.getTime() <= endDate.getTime()) {
            $scope.days.push(current.getFullYear() + '-' +
                             (current.getMonth() < 10 ? '0' : '') + (current.getMonth() + 1) + '-' +
                             (current.getDate() < 10 ? '0' : '') + current.getDate());
          }
        }
      }

      function populateTimes() {
        var d = new Date();
        d.setHours(7, 0);

        $scope.times = [];
        while (d.getHours() < 21) {
          $scope.times.push((d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes());
          d.setMinutes(d.getMinutes() + duration);
        }
      }
    }])

  .controller('SettingsCtrl', ['$scope', 'UserService', 
    function SettingsCtrl($scope, UserService) {
      $scope.form = {};
      
      UserService.getUserDetails(function(response) {
        $scope.form.email = response.email;
      });

      $scope.submitPost = function () {
        UserService.editUserDetails($scope.form, function(response) {
          if (response.ok)
            alert('Success!');
        });
      }
    }])

  .controller('AppointmentsListCtrl', ['$scope', '$routeParams', 'CalendarService',
    function AppointmentsListCtrl($scope, $routeParams, CalendarService) {
      var calendar = $scope.calendar = CalendarService.calendars.filter(function(cal) {
        return cal.url == $routeParams.name;
      })[0];

      fetchAppointments();

      function fetchAppointments() {
        CalendarService.getAppointments(calendar.id, function (response) {
          if (response.ok) {
            var slots = response.slots;
            $scope.appointments = [];
            slots.forEach(function (slot) {
              $scope.appointments.push({
                slotID: slot.id,
                id: slot.Appointment.id,
                date: slot.date.split('T')[0],
                time: slot.time.split(':')[0] + ':' + slot.time.split(':')[1],
                name: slot.Appointment.name,
                email: slot.Appointment.email,
                phone: slot.Appointment.phone,
                rescheduling: false,
                deleting: false
              });
            });
          }
        });
      }

      $scope.seeDetail = function (appointment, $event) {
        $event.preventDefault();

        $scope.appointment = appointment;
        $scope.reset();
        $('#appointment-detail-modal').modal('show');
      }

      $scope.rescheduling = function () {
        $scope.appointment.rescheduling = true;
      }

      $scope.deleting = function () {
        $scope.appointment.deleting = true;
      }

      $scope.postDelete = function () {
        var appointment = {
          id: $scope.appointment.id,
          SlotId: $scope.appointment.slotID
        };
        console.log(appointment);
        CalendarService.deleteAppointment(appointment, function (response) {
          if (response.ok) {
            $scope.appointments = $scope.appointments.filter(function (app) {
              return app.id !== appointment.id;
            });
            $('#appointment-detail-modal').modal('hide');
          }
        });
      }

      $scope.reset = function () {
        $scope.appointment.rescheduling = false;
        $scope.appointment.deleting = false;
      }
    }]);
