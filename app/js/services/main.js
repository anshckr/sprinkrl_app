'use strict';
angular.module("myApp")
.factory('MainService', ["$firebaseObject", "$firebaseArray", function MainServiceFactory($firebaseObject, $firebaseArray) {
  var ref = new Firebase('https://brilliant-inferno-3983.firebaseio.com');
  var employeesRef = ref.child('employees');
  
  /* set initial data, can be used when database is empty */
  // var employ_list = [
  //     {
  //         name: 'Anshul Nema',
  //         designation: 'Software Engineer',
  //         team: 'Frontend Eng.',
  //         project: 'Location-Service'
  //     },
  //     {
  //         name: 'Debanjana Shah',
  //         designation: 'Designer',
  //         team: 'Design Team',
  //         project: 'MIS'
  //     },
  //     {
  //         name: 'Irfan Ahmed',
  //         designation: 'Software Eng. Tester',
  //         team: 'QA Team',
  //         project: 'WebApp'
  //     }
  //   ];
  // _.each(employ_list, function(emp) {
  //   employeesRef.push().set(emp);
  // });
  // return employeesRef;
  return {
    all: function() {
      return employeesRef;
    },

    remove: function(keys_list) {
      _.each(keys_list, function(key){
        employeesRef.child(key).remove();
      });
    }
  };
}]);