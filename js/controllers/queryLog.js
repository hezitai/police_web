controllers.controller('index.queryLog', function($scope, queryLogServers, ngDialog, $rootScope, Api, user) {
	$scope.title = $scope.$parent.$parent.title = "查询记录";
	$scope.user = user.getUserMessage();
	$scope.option = {}; // 
	$scope.option.policeHouseValue = {}; //存储派出所 
	$scope.option.policeValue = {}; // 存储派出所民警
	$scope.station = []; //派出所列表
	$scope.option.queryclass = [{
		"info": "出租车信息查询"
	}, {
		"info": "出租车信息查询"
	}, {
		"info": "出租车信息查询"
	}, {
		"info": "出租车信息查询"
	}, {
		"info": "出租车信息查询"
	}, {
		"info": "出租车信息查询"
	}, {
		"info": "出租车信息查询"
	}]; //查询类别
	$scope.option.queryclassValue = $scope.option.queryclass[0]; //存储查询类别
	$scope.option.queryInfo = []; //存储查询出来的信息

	queryLogServers.getPoliceByTeamId(function(result) {
		var policeList = [];
		for (var i = 0; i < result.length; i++) {
			var isHaveTeamName = false;
			for (var d = 0; d < policeList.length; d++) {
				if (policeList[d].teamName == result[i].teamName) {
					policeList[d].subset.push({
						name: result[i].name,
						id: result[i].policeCrmId,
					});
					isHaveTeamName = true;
				};
			}
			if (!isHaveTeamName) {
				policeList.push({
					teamName: result[i].teamName,
					teamId: result[i].teamId,
					subset: [{
						name: result[i].name,
						id: result[i].policeCrmId,
					}],
				});
			};
		};
		$scope.station = policeList;
		$scope.option.policeHouseValue = $scope.station[0];
		$scope.option.policeValue = $scope.station[0].subset[0];
		console.log(policeList);
	});

	$scope.submit = function(data) {
		$scope.option.queryInfo = [];
		var time = Api.formatDate('/', $scope.option.date);
		var info = {
			"name": $scope.option.policeValue.name,
			"station": $scope.option.policeHouseValue.teamName,
			"queryClass": $scope.option.queryclassValue.info,
			"time": time,
			"queryWay": "查询方式",
			"queryUse": "查询用途",
			"info": "查询信息"
		}
		$scope.option.queryInfo.push(info);
		console.log($scope.option.queryInfo);
	}
	$scope.check = function(data) {
		ngDialog.open({
			template: '/police_web/template/dialogs/checkQueryLog.html',
			appendClassName: '',
			controller: function($scope) {
				$scope.data = data;
				console.log($scope.data);
			}
		});
	}
});