'use strict';
angular.module('myApp.main', ['ngRoute']).config([
  '$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/main', {
      templateUrl: 'templates/controllers/main.html',
      controller: 'MainCtrl'
    });
  }
]).controller('MainCtrl', [
  '$scope',
  '$window',
  '$timeout',
  'FirebaseService',
  'LoadingService',
  function($scope, $window, $timeout, FirebaseService, LoadingService) {
    LoadingService.start_loading();
    // Get the data on a post that has been removed
    FirebaseService.all().on('child_removed', function(snapshot) {
      var deletedEmployee = snapshot.val();
      $window.console.log('Employee -' + deletedEmployee.name + ' has been removed from the database');
    });
    FirebaseService.all().on('value', function(snapshot) {
      /* variables */
      $scope.employeeList = snapshot.val();
      $scope.employeeTeams = _.uniq(_.pluck($scope.employeeList, 'team'));
      $scope.employeeDesignations = _.uniq(_.pluck($scope.employeeList, 'designation'));
      $scope.teamFilter = {};
      $scope.designationFilter = {};
      $scope.filtered_employees = [];
      if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
        $scope.$digest();
      }
      $timeout(function() {
        /* set employees popover content */
        var popovers_ele = $('.employee[data-toggle="popover"]');
        popovers_ele.popover({
          trigger: 'hover',
          html: true
        });
        var emp_data, content_string, popover;
        _.each(popovers_ele, function(ele, index) {
          emp_data = JSON.parse($(ele).attr('data-obj'));
          content_string = '<div style="width:200px;" class="text-center"><p><strong>' + emp_data.name + '</strong><br/>' + 'Designation : <strong>' + emp_data.designation + '</strong><br/>' + 'Team : <strong>' + emp_data.team + '</strong><br/>' + 'Project : <strong>' + emp_data.project + '</strong><br/>' + '</p></div>';
          popover = $(ele).attr('data-content', content_string).data('bs.popover');
          popover.setContent();
          popover.$tip.addClass(popover.options.placement);
        });
        /* call hightlight if any of the actual filter value is checked */
        $('input.search-name, .teams input, .designations input').on('change', function(e) {
          $scope.highlight();
        });
        /* remove loading once employees are loaded */
        LoadingService.stop_loading();
      }, 0);
    }, function (errorObject) {
      /* remove loading once employees are loaded */
      LoadingService.stop_loading();
      console.log("The read failed: " + errorObject.code);
    });
    /**
     * [moveToBox used while dragging the employee to some seat]
     * @param  {Object} employee
     */
    $scope.moveToBox = function(employee) {
      _.each($scope.employeeList, function(emp, index, list) {
        if (emp.name == employee.name) {
          // add to dropped array
          $scope.seated.push(emp);
          $scope.moved_ele = $('[data-obj=\'' + JSON.stringify(employee) + '\']');
        }
      });
      $scope.$apply();
    };
    /**
     * [newAlert displays alert when an employees position is changed]
     * @param  {String} message text to be displayed in the alert
     */
    $scope.newAlert = function(message) {
      $('#alert-area').append($('<div class=\'alert-message fade in\' data-alert><p> ' + message + ' </p></div>'));
      $('.alert-message').delay(2000).fadeOut('slow', function() {
        $(this).remove();
      });
    };
    $scope.removeFilteredEmployees = function() {
      var keys_list = [];
      var key;
      var filtered_emps = _.each($scope.filtered_employees, function(emp) {
        key = _.findKey($scope.employeeList, function(employee) {
          return emp == employee;
        });
        keys_list.push(key);
      });
      FirebaseService.remove(keys_list);
      var searched_emp = $('.searched');
      searched_emp.parent().removeClass('isFilled');
      searched_emp.remove();
    };

    /* additional functions to view remaining seated/unseated employees */
    $scope.seated = [];
    $scope.showEmployeesLeft = function() {
      $window.alert($scope.employeeList.length - $scope.seated.length + ' employees left unseated.');
    };
    $scope.showEmployeesSeated = function() {
      $window.alert($scope.seated.length + ' employees seated.');
    };
    $scope.isFilterOn = function() {
      return _.isEmpty($scope.filtered_employees) ? false : true;
    };
  }
]);