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
  'MainService',
  function($scope, $window, $timeout, MainService) {
    // Get the data on a post that has been removed
    MainService.all().on('child_removed', function(snapshot) {
      var deletedEmployee = snapshot.val();
      console.log('Employee -' + deletedEmployee.name + ' has been removed from the database');
    });
    MainService.all().on('value', function(snapshot) {
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
        /* events binded to side filters i.e. teams and designations */
        $('input[name="teams"], input[name="designations"]').on('change', function(e) {
          $scope.applySideFilters($(e.currentTarget));
        });
        /* call hightlight if any of the actual filter value is checked */
        $('input.search-name, .teams input, .designations input').on('change', function(e) {
          $scope.highlight();
        }); 
        /* remove loading once employees are loaded */
        $('#loading').hide();
      }, 0);
    });
    /**
     * [applySideFilters show/hide and applies the checked values in side filters]
     * @param  {DOM Element} ele element which was checked
     */
    $scope.applySideFilters = function(ele) {
      if (!ele.is(':checked')) {
        $scope.clearTeamChecks();
        $('.' + ele.attr('name')).addClass('hide');
      } else {
        $('.' + ele.attr('name')).removeClass('hide');
      }
      $scope.highlight();
    };
    /**
     * [showHideFilters function to execute when side filter is clicked]
     */
    $scope.showHideFilters = function() {
      $('.add_filters').toggleClass('hide');
    };
    /**
     * [clearTeamChecks clear teams filter]
     */
    $scope.clearTeamChecks = function() {
      $('.teams').find('input:checked').attr('checked', false);
      $scope.teamFilter = {};
    };
    /**
     * [clearDesignationChecks clear designations filter]
     */
    $scope.clearDesignationChecks = function() {
      $('.designations').find('input:checked').attr('checked', false);
      $scope.designationFilter = {};
    };
    /**
     * [add function used to save an employee to the firebase database]
     */
    $scope.add = function() {
      var save = MainService.all().push().set({
        name: $scope.name,
        designation: $scope.designation,
        team: $scope.team,
        project: $scope.project
      });
      /* reset all the details */
      $scope.name = '';
      $scope.designation = '';
      $scope.team = '';
      $scope.project = '';
    };
    /**
     * [showHideForm used to show/hide the form to add an employee]
     */
    $scope.showHideForm = function() {
      var form_ele = $('form');
      if (form_ele.hasClass('hide')) {
        form_ele.addClass('white_content');
        $('.main_container').addClass('black_overlay');
      } else {
        $('.white_content').removeClass('white_content');
        $('.black_overlay').removeClass('black_overlay');
      }
      form_ele.toggleClass('hide');
    };
    /**
     * [searchFilterName used to filter employee based on name]
     * @param  {Object} employee
     * @return {Boolean} true/false based on whether employee's name matches the searched string
     */
    $scope.searchFilterName = function(employee) {
      if (!$scope.nameFilter) {
        return false;
      }
      var keyword = new RegExp($scope.nameFilter, 'i');
      return keyword.test(employee.name);
    };
    /**
     * [searchFilterTeam used to filter employee based on their teams]
     * @param  {Object} employee
     * @return {Boolean} true/false based on whether employee's teams matches the checked team
     */
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
    /**
     * [searchFilterDesignation used to filter employee based on their desigations]
     * @param  {Object} employee
     * @return {Boolean} true/false based on whether employee's designation matches the checked designation
     */
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
    /**
     * [highlight highlights the employees who pass the match criteria]
     */
    $scope.highlight = function() {
      $('.searched').removeClass('searched');
      $scope.filtered_employees = $scope.filterEmployees();
      $scope.highlightSearched($scope.filtered_employees);
      if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
        $scope.$digest();
      }
    };
    /**
     * [clearFilters removes all the applied fitlers]
     */
    $scope.clearFilters = function() {
      $('.searched').removeClass('searched');
      $('input:checked').attr('checked', false);
      $('.teams').addClass('hide');
      $('.designations').addClass('hide');
      $scope.nameFilter = '';
      $scope.teamFilter = {};
      $scope.designationFilter = {};
      $scope.filtered_employees = [];
    };
    /**
     * [filterEmployees helper function used to filter employees]
     * @return {Array} list of employees who passed the search criteria
     */
    $scope.filterEmployees = function() {
      var arr = [];
      _.each($scope.employeeList, function(employee) {
        if ($scope.searchFilterName(employee) || $scope.searchFilterTeam(employee) || $scope.searchFilterDesignation(employee)) {
          arr.push(employee);
        }
      });
      return arr;
    };
    /**
     * [highlightSearched helper function used to highlight the above fetched employees]
     * @param  {Array} arr list of employees to be hightlighted
     */
    $scope.highlightSearched = function(arr) {
      _.each(arr, function(employee) {
        $('[emp-name=\'' + employee.name + '\']').addClass('searched');
      });
    };
    /* additional functions to view remaining seated/unseated employees */
    $scope.seated = [];
    $scope.showEmployeesLeft = function() {
      $window.alert($scope.employeeList.length - $scope.seated.length + ' employees left unseated.');
    };
    $scope.showEmployeesSeated = function() {
      $window.alert($scope.seated.length + ' employees seated.');
    };
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
    $scope.isFilterOn = function() {
      return _.isEmpty($scope.filtered_employees) ? false : true;
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
      MainService.remove(keys_list);
    };
  }
]);