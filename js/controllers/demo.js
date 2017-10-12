controllers.controller('index.demo', function($scope, judes, $interval, ngDialog) {
	$scope.$parent.$parent.title = "首页";
	// 复合验证项
	$scope.jude = {};
	$scope.jude.value = '';
	$scope.jude.nameArray = [{
		value: 'isNull',
		name: '验证是否全为空或空格',
	}, {
		value: 'isPhone',
		name: '验证是否为手机号',
	}, {
		value: 'isAllChinese',
		name: '验证是否全部为中文',
	}, {
		value: 'isHaveChinese',
		name: '验证是否含有中文',
	}, {
		value: 'isIdCard',
		name: '验证身份证格式是否正确',
	}, {
		value: 'isSpecial',
		name: '验证是否含有特殊字符',
	}, {
		value: 'isUrl',
		name: '验证是否为网址',
	}, {
		value: 'isEmail',
		name: '验证是否为邮箱',
	}];
	$scope.jude.goJude = function() {
		var str = $scope.jude.value;
		$scope.jude.result = $scope.jude.name.name + ' 返回值为:' + judes[$scope.jude.name.value](str);
	};

	$scope.showDialog = function() {
		ngDialog.open({
			template: '/manage/template/dialogs/testdialog.html',
			controller: function($scope) {
				$scope.close = function(data) {
					$scope.$parent.dialogMessage = data;
					$scope.closeThisDialog();
				}
			},
		});
	};

	$scope.messagelist = [{
		isRead: false,
		isActive: false,
		date: '2016.07.21',
		content: '456',
	}, {
		isRead: false,
		isActive: false,
		date: '2016.07.21',
		content: '456',
	}, {
		isRead: false,
		isActive: false,
		date: '2016.07.21',
		content: '456',
	}, {
		isRead: false,
		isActive: false,
		date: '2016.07.21',
		content: '456',
	}, {
		isRead: false,
		isActive: false,
		date: '2016.07.21',
		content: '456',
	}]


	$scope.activeAll = function(list, isActive) {
		for (var i = 0; i < list.length; i++) {
			if (!isActive) {
				list[i].isActive = true;
			} else {
				list[i].isActive = false;
			}
		};
	}

	$scope.isAllActive = function(list) {
		for (var i = 0; i < list.length; i++) {
			if (!list[i].isActive) {
				return false;
			}
		}
		return true;
	}



});