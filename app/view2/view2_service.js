angular.module('myApp.view2_service', []).
  factory('employeeAPIservice', function($http) {

    var employeeAPI = {};

    employeeAPI.getDrivers = function() {
      return $http({
        method: 'JSONP', 
        url: 'http://ergast.com/api/f1/2013/driverStandings.json?callback=JSON_CALLBACK'
      });
    }

    return employeeAPI;
  });