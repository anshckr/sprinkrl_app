'use strict';
angular.module('myApp.main', [
  'ngRoute',
  'ngDraggable',
  'firebase'
]).config([
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
  '$firebaseObject',
  '$timeout',
  function($scope, $window, $firebaseObject, $timeout) {
    /* Initialize data */
    var ref = new Firebase('https://brilliant-inferno-3983.firebaseio.com');
    var employeesRef = ref.child('employees');
    $scope.employeeList = $firebaseObject(employeesRef);
    $scope.teamFilter = {};
    $scope.designationFilter = {};
    $scope.searchFilterName = function(employee) {
      var keyword = new RegExp($scope.nameFilter, 'i');
      return !$scope.nameFilter || keyword.test(employee.name);
    };
    $scope.searchFilterTeam = function(employee) {
      if (_.isEmpty($scope.teamFilter)) {
        return true;
      }
      var values = _.values($scope.teamFilter);
      var all_empty = _.every(values, function(val, index) {
        return !val;
      });
      if (all_empty) {
        return true;
      } else {
        /* returns true if any teams matches employee's team */
        return _.some(values, function(val, index) {
          return val == employee.team;
        });
      }
    };
    $scope.searchFilterDesignation = function(employee) {
      if (_.isEmpty($scope.designationFilter)) {
        return true;
      }
      var values = _.values($scope.designationFilter);
      var all_empty = _.every(values, function(val, index) {
        return !val;
      });

      if (all_empty) {
        return true;
      } else {
        /* returns true if any desinations matches employee's designation */
        return _.some(values, function(val, index) {
          return val == employee.designation;
        });
      }
    };
    employeesRef.on('value', function(snapshot) {
      $scope.employeeList = snapshot.val();
      $scope.employeeTeams = _.pluck($scope.employeeList, 'team');
      $scope.employeeDesignations = _.pluck($scope.employeeList, 'designation');
      // _.filter($scope.employeeList, function(emp){ return emp.name == 'filter'});
      $timeout(function() {
        var popovers_ele = $('[data-toggle="popover"]');
        popovers_ele.popover({
          trigger: 'hover',
          html: true
        });
        _.each(popovers_ele, function(ele, index) {
          var emp_data = JSON.parse($(ele).attr('data-content'));
          var content_string = '<div style="width:200px;" class="text-center"><p><strong>' + emp_data.name + '</strong><br/>' + 'Designation : <strong>' + emp_data.designation + '</strong><br/>' + 'Team : <strong>' + emp_data.team + '</strong><br/>' + 'Project : <strong>' + emp_data.project + '</strong><br/>' + '</p></div>';
          var popover = $(ele).attr('data-content', content_string).data('bs.popover');
          popover.setContent();
          popover.$tip.addClass(popover.options.placement);
        });
        $('.show_filters').on('click', function(e) {
          $('.add_filters').toggleClass('hide');
        });
        $('input[name="teams"]').on('change', function(e) {
          $('.teams').toggleClass('hide');
        });
        $('input[name="designations"]').on('change', function(e) {
          $('.designations').toggleClass('hide');
        });
        /* call hightlight if any of the filters is changed */
        $('input.search-name, .teams input, .designations input').on('change', function(e) {
          $scope.highlight();
        });
      }, 500);
    }, function(errorObject) {
      $window.console.log('The read failed: ' + errorObject.code);
    });
    $scope.highlight = function() {
      $('.searched').removeClass('searched');
      $scope.filtered_employees = $scope.filterEmployees();
      $scope.highlightSearched($scope.filtered_employees);
    };
    $scope.filterEmployees = function() {
      var arr = [];
      _.each($scope.employeeList, function(employee) {
        if ($scope.searchFilterName(employee) && $scope.searchFilterTeam(employee) && $scope.searchFilterDesignation(employee)) {
          arr.push(employee);
        }
      });
      return arr;
    };
    $scope.highlightSearched = function(arr) {
      _.each(arr, function(employee) {
        $('[emp-name=\'' + employee.name + '\']').addClass('searched');
      });
    };
    // array for dropped items
    $scope.dropped = [];
    $scope.showItmesLeft = function() {
      $window.alert($scope.employeeList.length + ' employees left unseated.');
    };
    $scope.showItmesDropped = function() {
      $window.alert($scope.dropped.length + ' employees seated.');
    };
    $scope.moveToBox = function(employee) {
      _.each($scope.employeeList, function(emp, index, list) {
        if (emp.name == employee.name) {
          // add to dropped array
          $scope.dropped.push(emp);
          $scope.moved_ele = $('[data-obj=\'' + JSON.stringify(employee) + '\']'); // remove from items array
          // $scope.employeeList = _.omit(list, index);
        }
      });
      $scope.$apply();
    };
    $scope.newAlert = function(type, message) {
      $('#alert-area').append($('<div class=\'alert-message ' + type + ' fade in\' data-alert><p> ' + message + ' </p></div>'));
      $('.alert-message').delay(2000).fadeOut('slow', function() {
        $(this).remove();
      });
    };
  }
]);