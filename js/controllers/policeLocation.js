controllers.controller('index.policeLocation', function($scope,getPosition, common) {
	$scope.title = $scope.$parent.$parent.title = "民警定位";
	$scope.isShow = false;
	$scope.refresh = 0;
	
	$scope.policeList = [];
	

	getPosition.get("7B50555C-02F8-E611-80E8-708BCD7CC924", function(result) {
		$scope.peopleList = result;
		$scope.isShow = true;
		$scope.refresh++;
	});

	common.getPoliceHouse(function(result) {
		
		
		result.unshift({
			ds_name : '全部',
			value : 'all',
		})	
		$scope.policeList = result;

		$scope.policeHouse = result[0];

		console.log($scope.policeList);
		
	});

	$scope.chooseEnd = function() {
		
		if ($scope.policeHouse['ds_name']=='全部') {
			
			getPosition.get('', function(result) {
				$scope.peopleList = result;
				$scope.refresh++;
			});
		} else {
			var id = '';
			if(!$scope.policeHouse['ds_team']){
				getPosition.get('', function(result) {
					$scope.peopleList = result;
					$scope.refresh++;
				});
			}else{
				
				id=$scope.policeHouse['ds_team'].replace(/team/g, "");
				getPosition.get(id, function(result) {
					$scope.peopleList = result;
					$scope.refresh++;
				});

			}
			

		}

	};
})