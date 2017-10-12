controllers.controller('index.disputeInput', function($scope, caseService, judes, ngDialog, $rootScope, Api, user, common, public) {
	$scope.title = $scope.$parent.$parent.title = "矛盾纠纷录入";
	$scope.options = {};
	$scope.options.ds_ischeck = true;
	$scope.options.ds_ischange = true;
	$scope.People = {};
	$scope.People.list = [];
	$scope.user = user.getUserMessage();

	$scope.People.delete = function(data, event, index) {
		event.stopPropagation();
		var confirmPopup = Api.checked('是否删除   ' + data.ds_name + '?', function() {
			$scope.People.list.splice(index, 1);
		}, function() {

		});
	};

	$scope.$on('disputeInputPeopleAdd', function(ev, data) {

		var isCheck = true;

		for (var i = 0; i < $scope.People.list.length; i++) {
			if ($scope.People.list[i].id == data.id) {
				isCheck = false;
				break;
			}
		};
		if (isCheck) {
			$scope.People.list.push(data);
		} else {
			Api.alert('人员已存在');
		}
	})

	$scope.People.showDialog = function(data) {
		ngDialog.open({
			template: '/police_web/template/dialogs/showdisputeinputperson.html',
			appendClassName: '',
			controller: function($scope) {
				$scope.data = data;
				console.log($scope.data);
			}
		});
	};

	$scope.People.setPeople = function() {
		ngDialog.open({
			template: '/police_web/template/dialogs/adddisputeinputperson.html',
			appendClassName: '',
			controller: function($scope, caseService, judes, ngDialog, $rootScope, Api, user, common, public) {
				$scope.People = {};
				$scope.People.detail = {};
				$scope.submitadd = function() {

					if (!judes.isNull($scope.People.detail['ds_name'])) {
						Api.alert('请填写姓名');
						return;
					};
					if (!judes.isNull($scope.People.detail['ds_id'])) {
						Api.alert('请填身份证号');
						return;
					};
					if (!judes.isIdCard($scope.People.detail['ds_id'])) {
						Api.alert('身份证号输入错误');
						return;
					};

					if (!judes.isNull($scope.People.detail['ds_phone'])) {
						Api.alert('请填写电话号');
						return;
					};
					if (!judes.isPhone($scope.People.detail['ds_phone'])) {
						Api.alert('电话号输入错误');
						return;
					};
					if (!judes.isNull($scope.People.detail['ds_address'])) {
						Api.alert('请填住址');
						return;
					};
					common.getPeopleId({
						"name": $scope.People.detail['ds_name'],
						"idCard": $scope.People.detail['ds_id'],
						"isCreate": "true"
					}, function(result) {
						var peopleId = result.personId;
						public.updatePeopleBriefMessage(peopleId, {
							name: $scope.People.detail['ds_name'],
							phone: $scope.People.detail['ds_phone'],
							address: $scope.People.detail['ds_address'],
						}, function() {
							$scope.People.detail.id = peopleId;
							$rootScope.$broadcast("disputeInputPeopleAdd", $scope.People.detail);
							$scope.closeThisDialog();
						});
					});
				}
			}
		});
	};
	$scope.submit = function() {
		if ($scope.People.list.length == 0) {
			Api.alert('至少填写一个人员');
			return;
		};

		var peopleList = '';
		for (var i = 0; i < $scope.People.list.length; i++) {
			peopleList += $scope.People.list[i].id + ';';
		};
		peopleList = peopleList.substring(0, peopleList.length - 1);

		var postData = {
			"name": "ds_dispute",
			"attributes": [{
				"name": "ds_personlist",
				"value": peopleList
			}, {
				"name": "ds_isresolved",
				"value": "@b/" + $scope.options.ds_ischeck.toString()
			}, {
				"name": "ds_iscase",
				"value": "@b/" + $scope.options.ds_ischange.toString()
			}]
		};

		if (judes.isNull($scope.options.ds_description)) {
			postData.attributes.push({
				"name": "ds_description",
				"value": $scope.options.ds_description
			});
		};
		caseService.createCrm(postData, function() {
			Api.alert('添加成功！', function() {
				location.reload();
			});
		});

	};
});