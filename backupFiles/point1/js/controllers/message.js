// message
controllers.controller('index.message', function($scope, messageServers, ngDialog, $rootScope) {
	$scope.title = $scope.$parent.$parent.title = "消息中心";
	$scope.currentPageNum = 1;
	$scope.allMessages = 0;
	$scope.messageList = {};
	$scope.messageList.showList = [];
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

	$scope.getMessageByPageNum = function(currentPageNum) {
		messageServers.getMessageList(currentPageNum, function(data, totalCount, currentPageNum) {
			$scope.messageList.showList = data;
			$scope.allMessage = totalCount;
			$scope.currentPageNum = currentPageNum;
			for (var i = 0; i < $scope.messageList.showList.length; i++) {
				$scope.messageList.showList[i].isActive = false;
				$scope.messageList.showList[i].createdon = messageServers.timeShow($scope.messageList.showList[i].createdon);
				if ($scope.messageList.showList[i].ds_message_type.split(':')[0] == "100000000") {
					var registMessage = angular.fromJson($scope.messageList.showList[i].ds_content)
					$scope.messageList.showList[i].ds_content = registMessage.personne.name + "的注册信息";
					$scope.messageList.showList[i].registMessage = registMessage;
				}
			}

		});
	}

	$scope.getMessageByPageNum($scope.currentPageNum);
	$scope.$on('message.initPage', function() {
		$scope.getMessageByPageNum($scope.currentPageNum);
	});


	//已读操作
	$scope.readByActive = function(list) {
		var updataArray = [];
		for (var i = 0; i < list.length; i++) {
			if (list[i].isActive) {
				updataArray.push(list[i].id);
			}
		}
		$scope.updataReadByIDArray(updataArray);
	};
	$scope.updataReadByIDArray = function(list) {
		if (list.length != 0) {
			var id = {
				id: list.pop(),
			}
			messageServers.updateRead(id, function() {
				$scope.updataReadByIDArray(list);
			});

		} else {
			$scope.getMessageByPageNum($scope.currentPageNum);
		}
	}



	//点击查看信息
	$scope.messageDetail = function(item) {
		if (item.ds_message_type.split(':')[0] == "100000000") {
			//ytt
		} else {
			if (item.ds_isread == 'False') {
				messageServers.updateRead(item);
			}
			ngDialog.open({
				template: '/manage/template/dialogs/otherMessage.html',
				controller: function($scope, $rootScope) {
					$scope.message = item;
					$scope.close = function() {
						// $scope.$parent.dialogMessage = data;
						// $scope.initMessage();
						if (item.ds_isread == 'False') {
							$rootScope.$broadcast('message.initPage');
						};
						$scope.closeThisDialog();
					}
				},
			});


		}
	}

	//删除一条信息
	$scope.delOne = function(item) {
			messageServers.batchRemove(item, function() {
				$scope.getMessageByPageNum($scope.currentPageNum);
			});

		}
		//删除多条信息，获得要删除的数组
	$scope.delByActive = function(list) {
		console.log(list);
		var delArray = [];
		for (var i = 0; i < list.length; i++) {
			if (list[i].isActive) {
				delArray.push(list[i].id);
			}

		}
		$scope.delByIDArray(delArray);
	};
	//删除多条信息，递归删除多条信息
	$scope.delByIDArray = function(list) {
		if (list.length != 0) {
			var id = {
				id: list.pop(),
			}
			messageServers.batchRemove(id, function() {
				$scope.delByIDArray(list);
			});

		} else {
			/*console.log($scope.currentPageNum);*/
			if ($scope.currentPageNum != 1 && $scope.messageList.showList.length == 0) {
				$scope.getMessageByPageNum($scope.currentPageNum - 1);
			} else if ($scope.currentPageNum != 1 && $scope.messageList.showList.length != 0) {
				$scope.getMessageByPageNum($scope.currentPageNum);
			} else if ($scope.currentPageNum == 1) {
				$scope.getMessageByPageNum(1);
			}else{
				messageServers.alertTips("出错啦");
			}


		}
	}


});