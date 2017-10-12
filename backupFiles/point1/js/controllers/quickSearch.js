controllers.controller('index.quickSearch', function($scope, quickSearchServers) {
	$scope.title = $scope.$parent.$parent.title = "一键搜索";

	$scope.peopleSearch = function() {
		if ($scope.userInput.idcardNum) {
			temporaryServers.getPeopleList($scope.userInput.idcardNum, function(data) {
				console.log(data);
				$scope.searchList.showList = data;
				for (var i = 0; i < $scope.searchList.showList.length; i++) {
					var id = $scope.searchList.showList[i].ds_id;
					if(id){
						$scope.searchList.showList[i].ds_gender = temporaryServers.getSex(id);
						$scope.searchList.showList[i].ds_age = temporaryServers.getAge(id);
						$scope.searchList.showList[i].ds_stayStyle = temporaryServers.getStayStyle(id);
						console.log(temporaryServers.getSex(id));
						console.log(temporaryServers.getAge(id));
						console.log(temporaryServers.getStayStyle(id));
					}
				}
			});
		}

		

	}

	$scope.tempor = function(){
		$state.go('index.temporary');

	}



});