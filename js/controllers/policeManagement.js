// 警员管理
controllers.controller('index.policeManagement', function($scope, $rootScope, policeManagementServers, homePageServers, user, Api, ngDialog, judes) {
    $scope.title = $scope.$parent.$parent.title = "警员管理";

    $scope.policeManagement = {};
    $scope.policeManagement.allPolice = [];
    $scope.policeManagement.select = {};
    $scope.policeMessageList = [];
    $scope.allPoliceOptionside = [];
    $scope.createPolice = {};
    $scope.amendPolice = {};

    // 警局列表
    homePageServers.getAllPolice(function(result) {
        $scope.policeManagement.allPolice = result;
        $scope.policeManagement.select = result[0];
        $rootScope.$broadcast('policeManagementServers.getPoliceList');
    });

    // 通知获取警员列表
    $scope.changeSelect = function() {
        $rootScope.$broadcast('policeManagementServers.getPoliceList');
    }

    // 获取警员列表
    $scope.$on('policeManagementServers.getPoliceList', function(event, data) {
        if (data) {
            for (var i = 0; i < $scope.policeManagement.allPolice.length; i++) {
                var element = $scope.policeManagement.allPolice[i];
                if (data["ds_team-teamid"] == element['ds_team-teamid']) {
                    $scope.policeManagement.select = element;
                }
            }
        };
        policeManagementServers.getPoliceMessageList({
            "teamId": $scope.policeManagement.select["ds_team-teamid"]
        }, function(result) {
            $scope.policeMessageList = result;
            console.log($scope.policeMessageList);
        });
    });

    // 点击添加警员
    $scope.addPolice = function() {
        console.log($scope.policeManagement.allPolice);
        var options = angular.copy($scope.policeManagement.allPolice);
        options.unshift({
            ds_name: ' - 请选择 - ',
            'ds_team-teamid': '1'
        });
        // 弹出窗口
        console.log(options)
        ngDialog.open({
            template: "/police_web/template/dialogs/addPolicemanagement.html",
            className: "ngdialog-theme-default ngdialog-addPoliceManagement",
            controller: function($scope, $rootScope) {
                // console.log(options);
                $scope.dialogTitle = '新增警员';
                // 警员列表
                $scope.allPoliceOptionside = {};
                $scope.allPoliceOptionside.array = options;
                $scope.allPoliceOptionside.select = $scope.allPoliceOptionside.array[0];

                console.log($scope.allPoliceOptionside);
                // 创建警员
                $scope.createPolice = {};
                $scope.power = false;
                $scope.powerSelect = function(active) {
                    // console.log(active);
                    $scope.createPolice.role = active;
                    $scope.power = active;
                }
                $scope.btnSubmit = function() {
                    if (!!!$scope.createPolice.policeNum) {
                        Api.alert("警号不能为空");
                        return;
                    };
                    if (!judes.isInteger($scope.createPolice.policeNum)) {
                        Api.alert("警号只能为正整数")
                        return;
                    };
                    if ($scope.createPolice.policeNum.length != 6) {
                        Api.alert("警号只能包含6位数")
                        return;
                    };
                    if (!!!$scope.createPolice.logonName) {
                        Api.alert("AD用户不能为空");
                        return;
                    };
                    if (!judes.isEnglishWord($scope.createPolice.logonName)) {
                        Api.alert("AD用户必须以英文字母开头")
                        return;
                    };
                    if (!judes.isSpecial($scope.createPolice.logonName)) {
                        Api.alert("AD用户名中不能含有特殊字符")
                        return;
                    };
                    if (judes.isHaveChinese($scope.createPolice.logonName)) {
                        Api.alert("AD用户名中不能含有中文")
                        return;
                    };
                    if (!!!$scope.createPolice.phone) {
                        Api.alert("联系电话不能为空")
                        return;
                    };
                    if (!judes.isPhone($scope.createPolice.phone)) {
                        Api.alert("请输入正确的手机号码");
                        return;
                    };
                    if (!!!$scope.createPolice.firstName || !!!$scope.createPolice.lastName) {
                        Api.alert("姓、名不能为空");
                        return;
                    };
                    if (!judes.isAllChinese($scope.createPolice.firstName) || !judes.isAllChinese($scope.createPolice.lastName)) {
                        Api.alert("姓、名只能为中文汉字");
                        return;
                    };
                    if (!!!$scope.createPolice.cardId) {
                        Api.alert("身份证号不能为空");
                        return;
                    };
                    if (!judes.isIdCard($scope.createPolice.cardId)) {
                        Api.alert("请重新核对身份证号码");
                        return;
                    };
                    if (!!!$scope.allPoliceOptionside.select) {
                        Api.alert("请选择所属部门");
                        return;
                    };
                    if (!!!$scope.createPolice.role) {
                        Api.alert("请选择警员权限")
                        return;
                    };
                    if ($scope.allPoliceOptionside.select['ds_team-teamid'] == '1') {
                        Api.alert("请选择所属派出所")
                        return;
                    };
                    policeManagementServers.createPolice({
                        "policeNum": $scope.createPolice.policeNum,
                        "firstName": $scope.createPolice.firstName,
                        "lastName": $scope.createPolice.lastName,
                        "logonName": $scope.createPolice.logonName,
                        "cardId": $scope.createPolice.cardId,
                        "phone": $scope.createPolice.phone,
                        "teamid": $scope.allPoliceOptionside.select['ds_team-teamid'],
                        "role": $scope.createPolice.role
                    }, function(result) {
                        Api.alert("创建成功");
                        $rootScope.$broadcast('policeManagementServers.getPoliceList', $scope.allPoliceOptionside.select);
                        $scope.closeThisDialog();
                    })
                }


            }
        })

    }

    // 点击修改指定警员信息
    $scope.amendPoliceMessage = function(amendItem) {
        var options = angular.copy($scope.policeManagement.allPolice);
        var oldValue = angular.copy(amendItem);
        console.log(oldValue);
        // 弹出窗口
        ngDialog.open({
            template: "/police_web/template/dialogs/addPolicemanagement.html",
            className: "ngdialog-theme-default ngdialog-addPoliceManagement",
            controller: function($scope, $rootScope) {
                $scope.dialogTitle = '修改警员信息';
                $scope.inp_1 = true;
                $scope.createPolice = amendItem;
                $scope.allPoliceOptionside = {};
                $scope.allPoliceOptionside.array = options;
                for (var i = 0; i < options.length; i++) {
                    var element = options[i];
                    if (amendItem.teamId == element["ds_team-teamid"]) {
                        $scope.allPoliceOptionside.select = element;
                    }
                };
                var active;
                active = $scope.createPolice.role;
                $scope.power = active;
                $scope.powerSelect = function(active) {
                    $scope.createPolice.role = active;
                    $scope.power = active;
                };
                $scope.btnSubmit = function() {
                    Api.checked('是否修改？', function() {
                        policeManagementServers.updatePoliceMessageList({
                            "id": oldValue.id,
                            "logonname": oldValue.logonName,
                            "old_firstName": oldValue.firstName,
                            "old_lastName": oldValue.lastName,
                            "odl_cardId": oldValue.cardId,
                            "old_phone": oldValue.phone,
                            "old_teamId": oldValue.teamId,
                            "old_role": oldValue.role,
                            "new_firstName": amendItem.firstName,
                            "new_lastName": amendItem.lastName,
                            "new_cardId": amendItem.cardId,
                            "new_phone": amendItem.phone,
                            "new_teamId": $scope.allPoliceOptionside.select["ds_team-teamid"],
                            "new_role": amendItem.role
                        }, function(result) {
                            $rootScope.$broadcast('policeManagementServers.getPoliceList', $scope.allPoliceOptionside.select);
                            $scope.closeThisDialog();
                        })
                    })
                };
            }
        })
    }

    // 点击删除指定警员信息
    $scope.deletePoliceMessage = function(delItem) {
        console.log(delItem);
        Api.checked('是否删除？', function() {
            policeManagementServers.deletePoliceMessage({
                "id": delItem.id
            }, function(result) {
                $rootScope.$broadcast('policeManagementServers.getPoliceList');
            });
        });

    }

})