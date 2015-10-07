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

		myApp.filter('getTypeById', [function() {
 			return function (input, id) {
				var i = 0, len = input.length;
		    for (; i<len; i++) {
		      if (+input[i].value === +id) {
		        return input[i];
		      }
		    }
		    return null;
 			}
 		}]);

		myApp.service('utils', ['$http', '$q', function($http, $q) {
				return {
					getContactTypes: function() {
						var deffered = $q.defer();
							$http.get('/contacttype')
								.success(function(response){
									deffered.resolve(response);
								})
								.error(function(msg, code) {
									deffered.reject(msg);
								});
							return deffered.promise;
						}
					}
				}]);

	  myApp.controller('AppCtrl', ['$scope', '$http', '$filter', 'utils', function($scope, $http, $filter, utils) {

			var refresh = function() {
				$http.get('/contactlist/' + $scope.searchYear + '/' + $scope.searchMonth)
					.success(function(response) {
						var contactList = [];
						angular.forEach(response.items, function(value, key) {
							var contact = value;
							var foundType = $filter('getTypeById')($scope.contactTypes, value.type);

							contact.type = {
								id: foundType.value,
								name: foundType.name
							}

							contactList.push(contact);
						});
						$scope.contactlist = contactList;
						$scope.totalAmount = response.totalAmount;
						clearAndSetDefault();
				});
			};

			var getContactTypes = function() {
						utils.getContactTypes().then(function(response) {
							$scope.contactTypes = response;
						});
			};

			var init = function() {
				getContactTypes();
				$scope.years = getYears();
				$scope.months = getMonths();
				var date = new Date();
				$scope.searchYear = date.getFullYear();
				$scope.searchMonth = date.getMonth() + 1;
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

			$scope.addContact = function() {
				clearAndSetDefault();
				$scope.isSaveAvailable = true;
				$scope.isUpdateAvailable = false;
			};

			$scope.saveContact = function() {				
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
					$scope.contact = response;
					$scope.isSaveAvailable = false;
					$scope.isUpdateAvailable = true;
				});
			};

			$scope.search = function() {
				refresh();
			}

			$scope.update = function() {
				$http.put('/contactlist/' + $scope.contact._id, $scope.contact).success(function(response) {
					refresh();
					$scope.isSaveAvailable = false;
					$scope.isUpdateAvailable = false;
				});
			};

			$scope.isSaveAvailable = false;
			$scope.isUpdateAvailable = false;

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
