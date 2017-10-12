// car
controllers.controller('index.car', function($scope,carservers) {
	$scope.title = $scope.$parent.$parent.title = "车辆管理";
	$scope.carInput = {};
	$scope.nameInfo = {};
	$scope.nameInfo.showinfo = [{
		"ds_number":'',
		"ds_information":'',
		"ds_person-ds_name":'',
		"ds_person-ds_id":'',
		
	}];

	$scope.carSearch=function(){
		console.log($scope.carInput.cardNum);

		if ($scope.carInput.cardNum) {
			carservers.getCarnum($scope.carInput.cardNum,
			function(data) {
				console.log(data);
				 $scope.nameInfo.showinfo = data;
			});
		}
 	}
});                              