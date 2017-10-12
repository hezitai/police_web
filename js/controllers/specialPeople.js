controllers.controller('index.specialPeople', function($scope, caseService, judes, ngDialog, $rootScope, Api, user, common) {
	$scope.options = {};
	$scope.options.isCheck = false;
	$scope.user = user.getUserMessage();
	console.log($scope.user);
	$scope.submit = function() {
		if (!judes.isNull($scope.options.name)) {
			Api.alert({
				template: '请填姓名'
			});
			return;
		};
		if (!judes.isNull($scope.options.id)) {
			Api.alert({
				template: '请填身份证号'
			});
			return;
		};
		if (!judes.isIdCard($scope.options.id)) {
			Api.alert({
				template: '身份证号输入错误'
			});
			return;
		};
		common.getPeopleId({
			"name": $scope.options.name,
			"idCard": $scope.options.id,
			"idCreate": "true"
		}, function(result) {



			var peopleId = result.personId;
			var postData = {
				"name": "ds_specialpeople",
				"attributes": [{
					"name": "ds_person",
					"value": "@look/" + peopleId
				}, {
					"name": "ds_isoutlaw",
					"value": "@b/" + $scope.options.isCheck.toString()
				}]
			};
			if (judes.isNull($scope.options.ds_description)) {
				postData.attributes.push({
					"name": "ds_description",
					"value": $scope.options.ds_description
				});
			};

			caseService.createCrm(postData, function(result) {
				Api.alert('添加成功！', function() {
					location.reload();
				});

			});
		});
	}
});