(function () {
	'use strict';

	function getMonths(locale) {
		locale = locale || "pl-PL";
		var months = [];
		months.push("--Wybierz miesiąc--")
		for(var i = 0; i < 12; i++) {
			var date = new Date();
			date.setMonth(i);
			months.push(date.toLocaleString(locale, { month: "long" }));
		}
		return months;
	};

  var myApp = angular.module('myApp', []);

	 myApp.filter('monthName', [function() {
			return function (monthNumber) { //1 = January
					var monthNames = getMonths();
					return monthNames[monthNumber];
			}
		}]);

	  myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {

			var refresh = function() {
				$http.get('/contactlist').success(function(response) {
					$scope.contactlist = response.items;
					$scope.totalAmount = response.totalAmount;
					clearAndSetDefault();
				});
			};

			var init = function() {
				$scope.years = getYears();
				$scope.months = getMonths();
				refresh();
			};

			var clearAndSetDefault = function() {
				var date = new Date();
				$scope.contact = {
					year: date.getFullYear(),
					month: date.getMonth() + 1,
					created: date
				};
			};

			init();

			$scope.clear = function() {
				clearAndSetDefault();
			};

			$scope.addContact = function(){
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
    	};

			$scope.edit = function(id){
				$http.get('/contactlist/' + id).success(function(response) {
					response.amount = response.amount.toString().replace('.', ',');
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
