// send
controllers.controller('index.send', function($scope, sendServers, $interval, $timeout, judes, options, point, user, Api) {
    $scope.title = $scope.$parent.$parent.title = "发送通知";
    $scope.sendServers = {};
    $scope.allPoliceList = [];
    $scope.allPolicemanList = [];
    $scope.searchPolicemanList = [];
    $scope.importantPeopleList = [];
    $scope.PublicList = [];
    $scope.inputReceiverObj = {};
    //获取全部派出所列表
    options.get(['batchreceiver'], function(data) {
        for (var d = 0; d < data.batchreceiver.length; d++) {
            var element = data.batchreceiver[d];
            if (element.name == '所有公安局') {
                // console.log(element);
                $scope.allPolice = element;
                data.batchreceiver.splice(d, 1);
            };
        };
        $scope.allPoliceList = data.batchreceiver;
        // console.log($scope.allPoliceList);
        sendServers.getPoliceAndman({
            'teamname': $scope.allPoliceList.name
        }, function(result) {
            for (var i = 0; i < result.length; i++) {
                var element = result[i];
                element.type = '全部派出所';
            }
            // console.log(result);
            $scope.allPolicemanList = result;
            // console.log($scope.allPolicemanList);
            $scope.searchPolicemanList = result;
            // console.log($scope.searchPolicemanList);
            for (var i = 0; i < $scope.allPolicemanList.length; i++) {
                // console.log($scope.allPolicemanList[i].teamName);
                for (var j = 0; j < $scope.allPoliceList.length; j++) {
                    if ($scope.allPolicemanList[i].teamName == $scope.allPoliceList[j].name) {
                        $scope.allPoliceList[j].teamId = $scope.allPolicemanList[i].teamId;
                        if ($scope.allPoliceList[j].list) {
                            $scope.allPoliceList[j].list.push($scope.allPolicemanList[i]);
                        } else {
                            $scope.allPoliceList[j].list = [];
                            $scope.allPoliceList[j].list.push($scope.allPolicemanList[i]);
                        };
                    }
                }
            }
            for (var i = 0; i < $scope.allPoliceList.length; i++) {
                for (var j = 0; j < $scope.allPolicemanList.length; j++) {
                    if ($scope.allPoliceList[i].name == $scope.allPolicemanList[j].teamName) {
                        $scope.allPolicemanList[j].value = $scope.allPoliceList[i].value;
                    }
                }
            }
            // console.log($scope.allPoliceList);
            // console.log($scope.allPolicemanList);
        })
    });
    //获取重点人口列表
    sendServers.getImportantPeopleList(function(result) {
        for (var i = 0; i < result.length; i++) {
            // console.log(result[i]['ds_person-ds_name'])
            var sendList = {};
            sendList.importantName = result[i]['ds_person-ds_name'];
            sendList.importantId = result[i].ds_prioritypeopleid;
            sendList.type = '重点人口';
            $scope.importantPeopleList.push(sendList);
        }
        // console.log($scope.importantPeopleList);
    });
    //获取行业场所列表
    sendServers.getPublicList({
        "type": "0"
    }, function(result) {
        // console.log(result);
        for (var i = 0; i < result.length; i++) {
            var sendList = {};
            sendList.publicName = result[i].name;
            sendList.publicId = result[i].id;
            sendList.type = '行业场所';
            $scope.PublicList.push(sendList);
        }
        // console.log($scope.PublicList);
    });

    //获取收件人
    $scope.inputreceiver = function(activeShow, parentArray) {
        $scope.inputReceiverObj.show = activeShow;
        for (var i = 0; i < parentArray.length; i++) {
            var element = parentArray[i];
            // console.log(element)
            if (element.name == activeShow | element.importantName == activeShow | element.publicName == activeShow) {
                $scope.inputReceiverObj.showList = element;
            }
        };
        if (activeShow == '全部派出所') {
            $scope.inputReceiverObj.showList = $scope.allPoliceList;
            $scope.inputReceiverObj.type = '全部派出所';
        };
        // if (activeShow == '重点人口') {
        //     $scope.inputReceiverObj.showList = $scope.importantPeopleList;
        //     $scope.inputReceiverObj.type = '重点人口';
        // };
        // if (activeShow == '行业场所') {
        //     $scope.inputReceiverObj.showList = $scope.PublicList;
        //     $scope.inputReceiverObj.type = '行业场所';
        // };
        // console.log(activeShow);
        // console.log(parentArray);
        // console.log($scope.inputReceiverObj);
    }

    //点击发送消息
    $scope.submit = function(receiver, message, receiverArr) {
        console.log(receiverArr);
        // console.log($scope.allPolice)
        if (!!!receiver) {
            Api.alert('接收方不能为空');
            return;
        };
        // console.log(receiver);
        if (!!!message) {
            Api.alert("请填写要发送的消息");
            return;
        };
        // console.log(message);
        // console.log(receiverArr);
        if (!!receiverArr.showList.type) {
            $scope.all = false;
        } else {
            $scope.all = true;
        }
        // console.log(receiverArr.showList)
        var sendData = {
            "name": 'ds_message',
            "attributes": [{
                    "name": "ds_content",
                    "value": message
                },
                {
                    "name": "ds_isread",
                    "value": "@b/false"
                },
                {
                    "name": "ds_receive_all",
                    "value": "@b/" + $scope.all //是否群发
                },
                {
                    "name": "ds_sendid_police",
                    "value": "@look/" + user.getUserMessage().policeCrmId
                }, {
                    "name": "ds_message_type",
                    "value": "@code/100000002"
                }
            ]
        };
        // console.log(receiverArr.showList.type);
        if (receiverArr.showList.type == '全部派出所') { //警员
            sendData.attributes.push({
                "name": "ds_receiveid_police",
                "value": "@look/" + receiverArr.showList.policeCrmId
            });
        } else if (receiverArr.showList.type == '重点人口') { //重点人口
            sendData.attributes.push({
                "name": "ds_receiveid_prioritypeople",
                "value": "@look/" + receiverArr.showList.importantId
            });
        } else if (receiverArr.showList.type == '行业场所') { //行业场所
            sendData.attributes.push({
                "name": "ds_receiveid_publicorder",
                "value": "@look/" + receiverArr.showList.publicId
            });
        } else { //群发
            // console.log(receiverArr)
            if (receiverArr.show == "全部派出所") { //群发全部派出所
                // console.log(receiverArr.show)
                sendData.attributes.push({
                    "name": "ds_batchreceiver",
                    "value": "@code/" + $scope.allPolice.value
                })
            } else { //群发指定派出所
                sendData.attributes.push({
                    "name": "ds_batchreceiver",
                    "value": "@code/" + receiverArr.showList.value
                })
            }
        }
        // console.log(sendData);
        sendServers.sendMessage(sendData, function(success) {
            // console.log(result);
            Api.alert("发送成功");
        })


    }





});