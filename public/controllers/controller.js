(function () {
	'use strict';

  var myApp = angular.module('myApp', []);

	 myApp.filter('monthName', ['utils', function(utils) {
			return function (monthNumber) { //1 = January
					var monthNames = utils.getMonths();
					return monthNames[monthNumber];
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
						},
						getContactList: function(year, month) {
							var deffered = $q.defer();
							$http.get('/contactlist/' + year + '/' + month)
								.success(function(response) {
									deffered.resolve(response);
								})
								.error(function(msg, code){
									deffered.reject(msg);
								});
								return deffered.promise;
						},
						getTypeById: function(input, id) {
							var i = 0, len = input.length;
					    for (; i<len; i++) {
					      if (+input[i].value === +id) {
					        return input[i];
					      }
					    }
					    return null;
						},
						getYears: function() {
				 			var currentYear = new Date().getFullYear();
				 			var years = [];
				 			var startYear = 2009
				 			while (startYear <= currentYear) {
				 				years.push(startYear);
				 				startYear++;
				 			}
				 			return years;
				 		},
						getMonths: function(locale) {
							locale = locale || "pl-PL";
							var months = [];
							months.push("--Wybierz miesiąc--")
							for(var i = 0; i < 12; i++) {
								var date = new Date();
								date.setMonth(i);
								months.push(date.toLocaleString(locale, { month: "long" }));
							}
							return months;
						}
					}
				}]);

	  myApp.controller('AppCtrl', ['$scope', '$http', '$filter', 'utils', function($scope, $http, $filter, utils) {

			var refresh = function() {
				utils.getContactList($scope.searchYear, $scope.searchMonth).then(function(response){
						var contactList = [];
						angular.forEach(response.items, function(value, key) {
							var contact = value;
							var foundType = utils.getTypeById($scope.contactTypes, value.type);

							contact.type = {
								id: foundType.value,
								name: foundType.name,
								icon: foundType.icon
							}

							contactList.push(contact);
						});
						$scope.contactlist = contactList;
						$scope.totalAmount = response.totalAmount;
						clearAndSetDefault();
				});
			};

			var setDefaultButtonsAvailability = function() {
				$scope.isSaveAvailable = true;
				$scope.isUpdateAvailable = false;
				$scope.isCancelUpdateAvailable = false;
			}

			var init = function() {
				$scope.years = utils.getYears();
				$scope.months = utils.getMonths();

				//setDefaultButtonsAvailability();

				var date = new Date();
				$scope.searchYear = date.getFullYear();
				$scope.searchMonth = date.getMonth() + 1;

				utils.getContactTypes().then(function(response) {
					$scope.contactTypes = response;
					refresh();
				});
			};

			var clearAndSetDefault = function() {
				var date = new Date();
				$scope.contact = {
					year: date.getFullYear(),
					month: date.getMonth() + 1,
					type: 1
				};

				setDefaultButtonsAvailability();
			};

			init();

			$scope.addContact = function() {
				clearAndSetDefault();
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
					$scope.isCancelUpdateAvailable = true;
				});
			};

			$scope.search = function() {
				refresh();
			};

			$scope.update = function() {
				$http.put('/contactlist/' + $scope.contact._id, $scope.contact).success(function(response) {
					refresh();
				});
			};

			$scope.cancelUpdate = function() {
				clearAndSetDefault();
			};		 
	}]);

}());
