var controllers = angular.module('manage.controllers', []);
controllers.controller('viewName', function($scope, $rootScope, Api) {
	$scope.title = "首页";
	$scope.$on('network.error', function() {
		Api.alert(
'连接失败,请检查网络');
	});
});
controllers.controller('login', function($scope, user, $state, Api, $location) {
	$scope.$parent.title = "登录";
	$scope.addClass = function(id) {
		var ele = document.getElementById(id);
		ele.className = 'input-item focus';
		if (id = 'password') {
			passwordInput = document.getElementById("passwordInput");
			passwordInput.type = 'password';
		}
	};
	$scope.removeClass = function(id) {
		var ele = document.getElementById(id);
		ele.className = 'input-item';
	};
	$scope.user = {
		name: '',
		password: ''
	};
	$scope.login = function() {
		var postData = {
			"userName": $scope.user.name,
			"passWord": $scope.user.password
		};
		if (postData.userName == '') {
			Api.alert('请输入用户名');
			return;
		}
		if (postData.passWord == '') {
			Api.alert('请输入密码');
			return;
		}
		user.login(postData, function(data) {
			$location.path('/index/homePage');
		}, function(data) {
			Api.alert(data);
		});
	};
	document.onkeydown = function(e) {
		var ev = document.all ? window.event : e;
		if (ev.keyCode == 13) {
			$scope.login();
		}
	}
});
controllers.controller('index', function($scope, $state, $interval, navList, $rootScope, $location, user, Api) {
	$scope.$parent.title = "首页";
	$interval(function() {
		$scope.UserMessage = user.getUserMessage();
		if ($scope.UserMessage == null) {
			$state.go('login');
		}
	}, 1000);

	// $state.go('index.homePage');
	$scope.date = {};
	$scope.getdate = function() {
		var d = new Date();
		$scope.date.day = d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + '日 ' + d.getHours() + '时' + d.getMinutes() + '分' + d.getSeconds() + '秒';
	};
	$scope.getdate();
	$interval(function() {
		$scope.getdate();
	}, 1000);
	$scope.userMenuShow = false;
	$scope.UserMenu = {};
	$scope.UserMenu.hide = function() {
		$scope.userMenuShow = false;
	};
	$scope.UserMenu.switch = function(e) {
		e.stopPropagation();
		$scope.userMenuShow = !$scope.userMenuShow;
	};
	$scope.stateName = $state.current.name;
	if ($scope.stateName == 'index') {
		$state.go('index.homePage');
	}
	$rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
		Api.Loading.hide();
		$scope.stateName = to.name;
		// if ($scope.stateName == 'index') {
		// 	$state.go('index.homePage');
		// }
	});
	$scope.navList = navList;
	$scope.stateGo = function(stateName, isDisable) {
		if (isDisable) {
			$state.go(stateName);
		}
	};
	// if ($state.current.parent == 'index') {
	// 	$location.path('/index');
	// };
	$scope.loginOut = function() {
		localStorage.clear();
		$state.go('login');
	};

	var userManage = Api.Storage.get('manageUser');
	console.log(userManage);
	$scope.manageName = userManage.name;
	$scope.manageRole = userManage.userModel.role;
	$scope.manageUser = userManage;


});
controllers.controller('index.homePage', function($scope, homePageServers) {
	$scope.$parent.$parent.title = "首页";
	var today = new Date();
	$scope.year = today.getFullYear();
	$scope.month = today.getMonth() + 1;
	$scope.day = today.getDate();
	$scope.ymds = {};
	$scope.ymds.arr = [];
	$scope.isChecked = false;
	$scope.userManage = $scope.$parent.manageUser;
	$scope.sign = function() {
		if ($scope.isChecked) {
			homePageServers.signInfo($scope.year, $scope.month, $scope.day, function(data) {
				homePageServers.alertTips("签到成功");
				homePageServers.showSignInfoToPlice($scope.year, $scope.month, function(data) {
					$scope.ymds.arr = data;
					$scope.isChecked = false;
					$scope.refresh++;
				});
			});
		}
	};

});
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


controllers.controller('index.mapDemo', function($scope, Api) {
	$scope.$parent.$parent.title = "测试地图";

});


controllers.controller('index.chooseBox', function($scope, Api) {
	$scope.$parent.$parent.title = "测试通讯录";

});


