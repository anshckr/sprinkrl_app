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
  'MainService',
  function($scope, $window, $firebaseObject, $timeout, MainService) {
    MainService.on('value', function(snapshot) {
      $scope.employeeList = snapshot.val();
      $scope.employeeTeams = _.uniq(_.pluck($scope.employeeList, 'team'));
      $scope.employeeDesignations = _.uniq(_.pluck($scope.employeeList, 'designation'));
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

        $('input[name="teams"]').on('change', function(e) {
          if(!$(e.currentTarget).is(":checked")){
            $scope.clearTeamChecks();
            $('.teams').addClass('hide');
          } else {
            $('.teams').removeClass('hide');
          }
          $scope.highlight();
        });
        $('input[name="designations"]').on('change', function(e) {
          if(!$(e.currentTarget).is(":checked")){
            $scope.clearDesignationChecks();
            $('.designations').addClass('hide');
          } else {
            $('.designations').removeClass('hide');
          }
          $scope.highlight();
        });
        /* call hightlight if any of the filters is changed */
        $('input.search-name, .teams input, .designations input').on('change', function(e) {
          $scope.highlight();
        });
      }, 0);
    });
    $scope.showHideFilters = function() {
      $('.add_filters').toggleClass('hide');
    };
    $scope.clearTeamChecks = function() {
      $('.teams').find('input:checked').attr('checked', false);
      $scope.teamFilter = {};
    };
    $scope.clearDesignationChecks = function() {
      $('.designations').find('input:checked').attr('checked', false);
      $scope.designationFilter = {};
    };
    $scope.add = function() {
     var save = MainService.push().set({
        name: $scope.name,
        designation: $scope.designation,
        team: $scope.team,
        project: $scope.project
     });

     $scope.name = '';
     $scope.designation = '';
     $scope.team = '';
     $scope.project = '';
    };
    $scope.showHideForm = function() {
      var form_ele = $('form');
      if (form_ele.hasClass('hide')){
        form_ele.addClass('white_content');
        $('.main_container').addClass('black_overlay');
      } else {
        $('.white_content').removeClass('white_content');
        $('.black_overlay').removeClass('black_overlay');
      }
      form_ele.toggleClass('hide');
    };
    $scope.teamFilter = {};
    $scope.designationFilter = {};
    $scope.searchFilterName = function(employee) {
      if(!$scope.nameFilter) {
        return false;
      }
      var keyword = new RegExp($scope.nameFilter, 'i');
      return keyword.test(employee.name);
    };
    $scope.searchFilterTeam = function(employee) {
      /* return true if matched else false */
      if (_.isEmpty($scope.teamFilter)) {
        return false;
      }
      var values = _.values($scope.teamFilter);
      var all_empty = _.every(values, function(val, index) {
        return !val;
      });
      if (all_empty) {
        return false;
      } else {
        /* returns true if any teams matches employee's team */
        return _.some(values, function(val, index) {
          return val == employee.team;
        });
      }
    };
    $scope.searchFilterDesignation = function(employee) {
      /* return true if matched else false */
      if (_.isEmpty($scope.designationFilter)) {
        return false;
      }
      var values = _.values($scope.designationFilter);
      var all_empty = _.every(values, function(val, index) {
        return !val;
      });
      if (all_empty) {
        return false;
      } else {
        /* returns true if any desinations matches employee's designation */
        return _.some(values, function(val, index) {
          return val == employee.designation;
        });
      }
    };
    $scope.highlight = function() {
      $('.searched').removeClass('searched');
      $scope.filtered_employees = $scope.filterEmployees();
      $scope.highlightSearched($scope.filtered_employees);
    };
    $scope.clearFilters = function() {  
      $('.searched').removeClass('searched');
      $('input:checked').attr('checked', false);
      $('.teams').addClass('hide');
      $('.designations').addClass('hide');
      $scope.nameFilter = "";
      $scope.teamFilter = {};
      $scope.designationFilter = {};
    };
    $scope.filterEmployees = function() {
      var arr = [];
      _.each($scope.employeeList, function(employee) {
        if ($scope.searchFilterName(employee) || $scope.searchFilterTeam(employee) || $scope.searchFilterDesignation(employee)) {
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
    // array for seated employees
    $scope.seated = [];
    $scope.showEmployeesLeft = function() {
      $window.alert($scope.employeeList.length - $scope.seated.length + ' employees left unseated.');
    };
    $scope.showEmployeesSeated = function() {
      $window.alert($scope.seated.length + ' employees seated.');
    };
    $scope.moveToBox = function(employee) {
      _.each($scope.employeeList, function(emp, index, list) {
        if (emp.name == employee.name) {
          // add to dropped array
          $scope.seated.push(emp);
          $scope.moved_ele = $('[data-obj=\'' + JSON.stringify(employee) + '\']'); // remove from items array
          // $scope.employeeList = _.omit(list, index);
        }
      });
      $scope.$apply();
    };
    $scope.newAlert = function(message) {
      $('#alert-area').append($('<div class=\'alert-message fade in\' data-alert><p> ' + message + ' </p></div>'));
      $('.alert-message').delay(2000).fadeOut('slow', function() {
        $(this).remove();
      });
    };
  }
]);