(function () {
	'use strict';

	//TODO: move it to server.js
	function getMonths(locale) {
		locale = locale || "pl-PL";
		//TODO: try http://momentjs.com/
		var months = [];
		for(var i = 1; i <= 9; i++) {
			var date = new Date("2015-0" + i + "-01");
			months.push(date.toLocaleString(locale, { month: "long" }));
		}
		for(var i = 10; i <= 12; i++) {
			var date = new Date("2015-" + i + "-01");
			months.push(date.toLocaleString(locale, { month: "long" }));
		}
		return months;
	};

  var myApp = angular.module('myApp', []);

	 myApp.filter('monthName', [function() {
			return function (monthNumber) { //0 = January
					var monthNames = getMonths();
					return monthNames[monthNumber];
			}
		}]);

	  myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {

			var refresh = function() {
				$http.get('/contactlist').success(function(response) {
					console.log(response);
					$scope.contactlist = response;
					clearAndSetDefault();
				});
			};

			var init = function() {
				$scope.years = getYears();
				$scope.months = getMonths();
				refresh();
			};

			var clearAndSetDefault = function() {
				$scope.contact = {
					year: new Date().getFullYear(),
					month: new Date().getMonth(),
					created: new Date()
				};
			};

			init();

			$scope.clear = function() {
				clearAndSetDefault();
			};

			$scope.addContact = function(){
				console.log($scope.contact);
				$http.post('/contactlist', $scope.contact).success(function(response) {
					refresh();
				});
			};

			$scope.delete = function(id) {
				$http.delete('/contactlist/' + id).success(function(response) {
					refresh();
				});
			};

			$scope.parseInt = function(number) {
        return parseInt(number, 10);
    	}

			$scope.edit = function(id){
				console.log(id);
				$http.get('/contactlist/' + id).success(function(response) {
					console.log(response);
					$scope.contact = response;
				});
			};

			$scope.update = function() {
				$http.put('/contactlist/' + $scope.contact._id, $scope.contact).success(function(response) {
					refresh();
				});
			};

		 //TODO: move it to server.js
		 function getYears() {
			var currentYear = new Date().getFullYear();
			var years = [];
			var startYear = 2009
			while (startYear <= currentYear) {
				years.push(startYear);
				startYear++;
			}
			return years;
		};

	}]);

}());
