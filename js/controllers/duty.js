controllers.controller('index.duty', function($scope, dutyServers, ngDialog, $rootScope, Api, user) {
	$scope.title = $scope.$parent.$parent.title = "警务排班";
	$scope.user = user.getUserMessage();
	$scope.userRole = user.getUserMessage().role;
	$scope.option = {};
	$scope.option.policeHouseSelected = false;
	$scope.option.policeHouse = {};//派出所列表
	$scope.option.showDate = '';//排班开始时间
	$scope.option.rulesList = [];//排班列表
	$scope.option.todayRulesId = false;//今日排班列表的id
	$scope.option.todayRulesOnoff = false;
	$scope.option.rulesId = false;
	

	//默认北山派出所
	dutyServers.getPoliceHouse(function(result) {
		$scope.option.policeHouse = result;
		$scope.option.policeHouseSelected = $scope.option.policeHouse[0];
		var bspolice = result[0].value;
		dutyServers.getDutyRulesByTeamId($scope.option.policeHouseSelected.value, function(result) {
			if(result == false) {
				$scope.option.showDate = "尚无排班信息";
				$scope.option.rulesList = [];
			} else {
				dutyServers.getTodayRulesItem($scope.option.policeHouseSelected.value, function(result) {
					$scope.option.todayRulesId = result.id;
				});
				$scope.option.showDate = Api.formatDate('zh', result.ds_date);
				dutyServers.getRulesList(result.id, function(result) {
					$scope.option.rulesList = [];
					for (var i = 0; i < result.length; i++) {
						var data = angular.fromJson(result[i].ds_json);
						data.id = result[i].id;
						data.onoff = '';
						if(result[i].id == $scope.option.todayRulesId){
							data.onoff = true;
						} else {
							data.onoff = false;
							//$scope.option.todayRulesId = false;
						}
						$scope.option.rulesList.push(data);
					}
				});
			}
		});
	},false)

	//Select的ng-change
	$scope.changeSelect = function() {
		dutyServers.getDutyRulesByTeamId($scope.option.policeHouseSelected.value, function(result) {
			if(result == false) {
				$scope.option.showDate = "尚无排班信息";
				$scope.option.rulesList = [];
			} else {
				dutyServers.getTodayRulesItem($scope.option.policeHouseSelected.value, function(result) {
					$scope.option.todayRulesId = result.id;
				});
				$scope.option.showDate = Api.formatDate('zh', result.ds_date);
				dutyServers.getRulesList(result.id, function(result) {
					$scope.option.rulesList = [];
					for (var i = 0; i < result.length; i++) {
						var data = angular.fromJson(result[i].ds_json);
						data.id = result[i].id;
						data.onoff = '';
						if(result[i].id == $scope.option.todayRulesId){
							data.onoff = true;
						} else {
							data.onoff = false;
							//$scope.option.todayRulesId = false;
						}
						$scope.option.rulesList.push(data);
					}
				});
			}
		});
	};
	
});
