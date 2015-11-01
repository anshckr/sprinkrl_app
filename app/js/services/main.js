'use strict';
angular.module("myApp")
.factory('MainService', function MainServiceFactory() {
  var ref = new Firebase('https://brilliant-inferno-3983.firebaseio.com');
  var employeesRef = ref.child('employees');
  
  /* set initial data, can be used when database is empty */
  // var employ_list = [
  //     {
  //         name: 'Anshul',
  //         designation: 'Software Engineer',
  //         team: 'Frontend Eng.',
  //         project: 'Location-Service'
  //     },
  //     {
  //         name: 'Debanjana',
  //         designation: 'Designer',
  //         team: 'Design Team',
  //         project: 'MIS'
  //     },
  //     {
  //         name: 'Irfan',
  //         designation: 'Software Eng. Tester',
  //         team: 'QA Team',
  //         project: 'WebApp'
  //     }
  //   ];
  // _.each(employ_list, function(emp) {
  //   employeesRef.push().set(emp);
  // });
  return employeesRef;
});