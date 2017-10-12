controllers.controller('index.message', function($scope, messageServers, ngDialog, $rootScope, Api, user, $filter) {
    // console.log(user.getUserMessage());
    //消息中心
    $scope.title = $scope.$parent.$parent.title = "消息中心";

    $scope.messageList = {};
    $scope.messageList.showList = [];
    $scope.messageList.pageArray = [];
    //单选
    $scope.changeItemIsActive = function(item) {
        item.isActive = !item.isActive;
        $scope.isAllActive = !checkListAllActive();

    }
    $scope.isAllActive = false;
    var checkListAllActive = function() {
        var allActiveType = false;
        for (var i = 0; i < $scope.messageList.showList.length; i++) {
            var item = $scope.messageList.showList[i];
            if (!item.isActive) {
                allActiveType = true;
                break;
            }
        }
        return allActiveType;
    };
    //全选
    $scope.allItemIsActive = function(Active) {
        if (Active || checkListAllActive()) {
            for (var i = 0; i < $scope.messageList.showList.length; i++) {
                var item = $scope.messageList.showList[i];
                item.isActive = true;
                $scope.isAllActive = true;
            }
        } else {
            for (var i = 0; i < $scope.messageList.showList.length; i++) {
                var item = $scope.messageList.showList[i];
                item.isActive = false;
                $scope.isAllActive = false;
            }
        }
    };
    //点击查看
    $scope.messageLook = function(item) {
        console.log(item.ds_messageid);
        messageServers.getSenderInfo({
            "id": item.ds_messageid
        }, function(result) {
            console.log(result);
            ngDialog.open({
                template: "/police_web/template/dialogs/otherMessageLook.html",
                controller: function($scope, $rootScope) {
                    console.log(result);
                    $scope.message = item;
                    if (result.senderType == "1") {
                        $scope.message.sender = result.policeName;
                    } else if (result.senderType == "2") {
                        $scope.message.sender = result.publicOrderName
                    } else if (result.senderType == "3") {
                        $scope.message.sender = result.priorityPeopleName
                    }
                    $scope.message.ds_isread = "True";
                    $scope.stopLook = function() {
                        if ($scope.message.ds_isread) {
                            messageServers.updateMessageIsRead({ id: $scope.message.id }, function() {
                                $scope.message.ds_isread = "True";
                                $scope.closeThisDialog();
                            });
                        }
                    }
                }
            });
        })
    };

    messageServers.getMessageList({ //消息中心
        policeCrmId: user.getUserMessage().policeCrmId,
        index: 1
    }, function(result, _length) {
        for (var i = 0; i < result.length; i++) {
            var element = result[i];
            // console.log(element.createdon);
            element.createdon = Api.formatDate('YYYY年MM月DD日 HH:mm:ss', element.createdon);
            // console.log(Api.formatDate('YYYY年MM月DD日 T hh时mm分ss秒', element.createdon))
        }
        // console.log(result);
        // console.log(_length);
        //页数	Math.ceil(_length/10)
        var pageNum = Math.ceil(_length / 10)
        for (var i = 1; i < (pageNum + 1); i++) {
            $scope.messageList.pageArray.push(i);
        }
        $scope.messageList.index = $scope.messageList.pageArray[0];
        // console.log($scope.messageList.index);
        // console.log($scope.messageList.pageArray)
        if ($scope.messageList.index == $scope.messageList.pageArray.length) {
            $scope.btnDown = true;
        } else {
            $scope.btnDown = false;
        }
        $scope.messageList.showList = result;
        // console.log(result);
    });
    //标记为已读
    $scope.ReadByActive = function(active) {
            var updateArray = [];
            var updateNewArray = [];
            for (var i = 0; i < $scope.messageList.showList.length; i++) {
                if ($scope.messageList.showList[i].isActive == true) {
                    updateArray.push($scope.messageList.showList[i].id);
                    updateNewArray.push($scope.messageList.showList[i]);
                }
            }
            if (updateArray.length == 0) {
                return;
            } else {
                var messageIdArray = updateArray.join(';');
                messageServers.updateMessageByRead({
                    "str": messageIdArray,
                    "messageType": "1"
                }, function(result) {
                    if (result.status == 0) {
                        //实际操作
                        Api.checked('是否标记为已读？', function() {
                            for (var j = 0; j < updateNewArray.length; j++) {
                                updateNewArray[j].ds_isread = 'True';
                            }
                        })
                    } else {
                        Api.alert('操作失败');
                    }
                })
            }

        }
        //删除
    $scope.DeleteByActive = function(item) {
        var updateArray = [];
        var updateNewArray = [];
        var indexArray = [];
        for (var i = 0; i < $scope.messageList.showList.length; i++) {
            if ($scope.messageList.showList[i].isActive == true) {
                updateArray.push($scope.messageList.showList[i].id);
                updateNewArray.push($scope.messageList.showList[i]);
                indexArray.push(i);
            }
        }
        if (indexArray.length == 0) {
            return;
        } else {
            var messageIdArray = updateArray.join(';');
            messageServers.updateMessageByRead({
                "str": messageIdArray,
                "messageType": "0"
            }, function(result) {
                if (result.status == 0) {
                    function deleteArrayItemByIndexArray() {
                        Api.checked('是否批量删除选中项？', function() {
                            if (indexArray.length != 0) {
                                var index = indexArray.pop();
                                $scope.messageList.showList.splice(index, 1);
                                // 更新列表
                                messageServers.getMessageList({
                                    policeCrmId: user.getUserMessage().policeCrmId,
                                    index: $scope.messageList.index
                                }, function(result) {
                                    console.log($scope.messageList.index)
                                    $scope.messageList.showList = result;
                                    if (result.length == 0 && $scope.messageList.index != 1) {
                                        $scope.messageJumpUpOnePageAndUpdatePage();
                                        $scope.isAllActive = false;
                                    }
                                })
                                deleteArrayItemByIndexArray();
                            }
                        })
                    }
                    deleteArrayItemByIndexArray();
                } else {
                    Api.alert('操作失败');
                }
            })
        }
    }
    $scope.messageJumpUpOnePageAndUpdatePage = function() { //向前跳转一页，并刷新页码
        messageServers.getMessageList({
            policeCrmId: user.getUserMessage().policeCrmId,
            index: $scope.messageList.index - 1
        }, function(result, _length) {
            $scope.messageList.showList = result;
            console.log(result)
            $scope.messageList.pageArray = [];
            var pageNum = Math.ceil(_length / 10)
            for (var i = 1; i < (pageNum + 1); i++) {
                $scope.messageList.pageArray.push(i);
            }
            $scope.messageList.index -= 1;
        })
    };
    //删除一条
    $scope.delOne = function(delItem) {
        Api.checked('是否删除？', function() {
            messageServers.updateMessageByRead({
                "str": $scope.messageList.showList[delItem].id,
                "messageType": "0"
            }, function(result) {
                console.log(result.status);
                console.log($scope.messageList.index);
                if (result.status == 0) {
                    $scope.messageList.showList.splice(delItem, 1);
                    // 更新列表
                    messageServers.getMessageList({
                        policeCrmId: user.getUserMessage().policeCrmId,
                        index: $scope.messageList.index
                    }, function(result) {
                        console.log(result); //result.length删后页面行数
                        if (result.length == 0 && $scope.messageList.index != 1) {
                            $scope.messageJumpUpOnePageAndUpdatePage();
                        } else {
                            $scope.messageList.showList = result; //删除bug已解决
                        }
                    })
                } else {
                    Api.alert('操作失败');
                }
            })
        })
    };
    //分页
    $scope.btnUp = true;
    $scope.btnDown = false;
    $scope.changePages = function(pageIndex) {
        if (pageIndex == 'next') {
            if ($scope.messageList.pageArray[$scope.messageList.index - 1 + 1]) {
                var index = $scope.messageList.pageArray[$scope.messageList.index - 1 + 1];
                $scope.updateList(index);
            }
        } else if (pageIndex == 'pre') {
            if ($scope.messageList.pageArray[$scope.messageList.index - 1 - 1]) {
                var index = $scope.messageList.pageArray[$scope.messageList.index - 1 - 1];
                $scope.updateList(index);
            }
        } else {
            $scope.updateList(pageIndex, getListSuccessCallback);
        }
        if ($scope.isAllActive) { //全选bug已解决
            $scope.allItemIsActive();
        }
    };
    $scope.updateList = function(index, successCallback) {
        messageServers.getMessageList({
            policeCrmId: user.getUserMessage().policeCrmId,
            index: index
        }, function(result) {
            console.log(result, index);
            getListSuccessCallback(result, index);

        })
    }

    function getListSuccessCallback(result, index) {
        console.log(index);
        $scope.messageList.showList = result;
        $scope.messageList.index = index;
        if ($scope.messageList.index == $scope.messageList.pageArray.length) {
            $scope.btnDown = true;
        } else {
            $scope.btnDown = false;
        }
        if ($scope.messageList.index != 1) {
            $scope.btnUp = false;
        } else {
            $scope.btnUp = true;
        }
    }
})