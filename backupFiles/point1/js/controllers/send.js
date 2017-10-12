// send
controllers.controller('index.send', function($scope, sendServers, $interval, $timeout, judes) {
	$scope.title = $scope.$parent.$parent.title = "发送通知";
	$scope.show = {};
	$scope.moveLeft = 0;
	//收件人数组(目前只是select中的)
	$scope.show.searchList = [];
	$scope.show.searchMoreList = {};
	$scope.show.searchMoreList.person = [];
	$scope.show.searchMoreList.place = [];
	$scope.jude = {};
	$scope.jude.nameArray = [{
		value: '1',
		name: '常用选择',
	}, {
		value: '100000000',
		name: '所有派出所',
		type : 3,
	}, {
		value: '100000002',
		name: '奢岭派出所',
		type : 3,
	}, {
		value: '100000003',
		name: '北山路派出所',
		type : 3,
	}, {
		value: '100000004',
		name: '双阳路派出所',
		type : 3,
	}];


	//获得select群发的数据，将其加入到收件人数组中
	$scope.chooseSelect = function() {
			console.log($scope.jude.name.value);
			var nn = {
				id: $scope.jude.name.value,
				name: $scope.jude.name.name,
				type : $scope.jude.name.type,
			};
			if ($scope.jude.name.name != "常用选择") {
				var isReapt = false;
				for (var i = 0; i < $scope.show.searchList.length; i++) {
					if ($scope.show.searchList[i].id == nn.id) {
						isReapt = true;
					}
				}
				if (!isReapt) {
					$scope.show.searchList.push(nn);
					$scope.countWidth();
				}
				$scope.jude.name = $scope.jude.nameArray[0];
			}
		}
		//搜索框的方法
	$scope.changeInput = function() {
			console.log($scope.searchValue);
			if ($scope.searchValue) {
				$scope.show.searchMoreList.person = [];
				$scope.show.searchMoreList.place = [];
				angular.element('.searchMoreList').css("display", "block");
				sendServers.searchs($scope.searchValue, function(data) {
					console.log(data);
					for (var j = 0; j < data.length; j++) {
						data[j].isActive = false;
						if (data[j].type == 1) {

							$scope.show.searchMoreList.person.push(data[j]);
						} else {
							$scope.show.searchMoreList.place.push(data[j]);
						}
					}
					/*$scope.show.searchMoreList = data;*/
				});
			} else {
				angular.element('.searchMoreList').css("display", "none");
			}
		}
		//搜索框中选中的人加入收件人数组
	$scope.joinArr = function(item) {
			var isReapt = false;
			for (var k = 0; k < $scope.show.searchList.length; k++) {
				if ($scope.show.searchList[k].id == item.id) {
					isReapt = true;
				}
			}
			if (!isReapt) {
				var nn = {
					id: item.id,
					name: item.name,
					type: item.type,
				};
				$scope.show.searchList.push(nn);
				$scope.countWidth();
			}else{
				sendServers.alertTips("已经添加过");
			}
			$scope.searchValue = "";
			angular.element('.searchMoreList').css("display", "none");
		}
		//从收件人数组中删除某个人
	$scope.deleteItem = function(index, listArray) {
		listArray.splice(index, 1);
	}

	//判断是否发送完成
	$scope.isSendMessageComplete = function(){
		if ( $scope.show.searchList.length != 0) {
			$scope.sendMessage();
		}else{
			sendServers.alertTips("发送成功");
		}
	};
	//发送邮件
	$scope.sendMessage = function() {
		if(!judes.isNull($scope.show.searchList) ){
			sendServers.alertTips("请填写完整");
		}else{
			var item = $scope.show.searchList.pop();
			if (item.type == 0) {
				sendServers.sendMessage2($scope.textAreas, item.id, function() {
					console.log("场所成功");
					$scope.isSendMessageComplete();
				});
			}else if(item.type == 1){
				sendServers.sendMessage1($scope.textAreas, item.id, function() {
					console.log("警员成功");
					$scope.isSendMessageComplete();
				});
			}else if(item.type == 3){
				console.log(item);
				sendServers.sendMessage3($scope.textAreas, item.id, function() {
					console.log("群发成功");
					$scope.isSendMessageComplete();
				});
			}
		}
	},
	$scope.addChoose = function(){
		angular.element('.click').css("display", "inline-block");
	},
	$scope.delChoose = function(){
		angular.element('.click').css("display", "hidden");
	}

});