var CAS = require('cas');
var cas_host = 'https://sso.ui.ac.id/cas2';
var service_url = 'http://localhost/appointer/sso-login';
var cas = new CAS({ base_url: cas_host, service: service_url});

module.exports.validate = function (ticket, callback) {
  cas.validate(ticket, callback);
};

module.exports.redirectURL = cas_host + '/login?service=' + encodeURIComponent(service_url);
module.exports.logoutURL = cas_host + '/logout';