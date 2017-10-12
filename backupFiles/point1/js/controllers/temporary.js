controllers.controller('index.temporary', function($scope, temporaryServers) {
	$scope.title = $scope.$parent.$parent.title = "暂住人口查询";
	$scope.userInput = {};
	$scope.searchList = {};
	$scope.searchList.showList = [{
		ds_name: '',
		ds_gender: '',
		ds_age: '',
		ds_id: '',
	}];

	$scope.peopleSearch = function() {
		// var num = /^([0-9]\d{15})|(([0-9]\d{18})|([0-9]\d{17}[a-zA-Z]))$/;
		/*		//15位数身份证正则表达式
				var arg1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
				//18位数身份证正则表达式
				var arg2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/;

				if ($scope.userInput.idcardNum && (arg1.test($scope.userInput.idcardNum) || arg2.test($scope.userInput.idcardNum))) {
					//身份证号查找结果
					var peopleList = temporaryServers.getPeopleList($scope.userInput.idcardNum, function(data) {
						console.log(data);
						$scope.searchList.showList = data;
						for (var i = 0; i < $scope.searchList.showList.length; i++) {
							$scope.searchList.showList[i].ds_id = temporaryServers.getSex($scope.searchList.showList[i]);
						}
					});
				} else if ($scope.userInput.idcardNum && !(arg1.test($scope.userInput.idcardNum) || arg2.test($scope.userInput.idcardNum))) {
					//姓名查找
					var peopleList = temporaryServers.findPeople();
					console.log(peopleList);
					$scope.searchList.showList = peopleList;
				} else if ($scope.userInput.idcardNum && (!arg1.test($scope.userInput.idcardNum) && !arg2.test($scope.userInput.idcardNum))) {
					temporaryServers.alertTips("请正确填写身份证号");
				} else {
					temporaryServers.alertTips("请正确填写姓名或身份证号");
				}*/

		if ($scope.userInput.idcardNum) {
			temporaryServers.getPeopleList($scope.userInput.idcardNum, function(data) {
				/*console.log(data);*/
				$scope.searchList.showList = data;
				for (var i = 0; i < $scope.searchList.showList.length; i++) {
					var id = $scope.searchList.showList[i].ds_id;
					if(id){
						$scope.searchList.showList[i].ds_gender = temporaryServers.getSex(id);
						$scope.searchList.showList[i].ds_age = temporaryServers.getAge(id);
						$scope.searchList.showList[i].ds_stayStyle = temporaryServers.getStayStyle(id);
					}
				}
			});
		}

		

	}



});