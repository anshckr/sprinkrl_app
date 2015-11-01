'use strict';

describe('myApp.main module', function() {

  beforeEach(module('myApp.main'));

  describe('main controller', function(){

    it('should ....', inject(function($controller, $rootScope, $injector) {
      //spec body
      var MainService = $injector.get('MainService');
      var scope = $rootScope.$new(); //get a childscope
      var mainCtrl = $controller('MainCtrl', {$scope:scope });
      expect(mainCtrl).toBeDefined();
    }));

  });
});