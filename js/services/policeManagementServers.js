// 警员管理
services.factory('policeManagementServers', function(Api, user, ngDialog) {
    var getPoliceMessageList = function(data, successCallBack) {
        Api.POST({
            url: "/api/Crm/GetPolices",
            data: {
                "commonStr": data.teamId
            },
            success: function(result) {
                console.log(result)
                if (result.status == 0) {
                    successCallBack(result.resultObj);
                } else {
                    Api.alert('获取失败')
                }
            }
        })
    }
    var createPolice = function(data, successCallBack) {
        Api.POST({
            url: "/api/Crm/CreatePolice",
            data: {
                "policeNum": data.policeNum,
                "firstName": data.firstName,
                "lastName": data.lastName,
                "logonName": data.logonName,
                "cardId": data.cardId,
                "phone": data.phone,
                "teamid": data.teamid,
                "role": data.role
            },
            success: function(result) {
                console.log(result);
                if (result.status == 0) {
                    successCallBack(result.resultObj);
                } else {
                    Api.alert(result.message)
                }
            }
        })
    }
    var updatePoliceMessageList = function(data, successCallBack) {
        Api.POST({
            url: "/api/Crm/UpdatePolice",
            data: {
                "id": data.id,
                "logonname": data.logonname,
                "firstName": data.old_firstName,
                "lastName": data.old_lastName,
                "cardId": data.odl_cardId,
                "phone": data.old_phone,
                "teamId": data.old_teamId,
                "role": data.old_role,
                "newfirstName": data.new_firstName,
                "newlastName": data.new_lastName,
                "newcardId": data.new_cardId,
                "newphone": data.new_phone,
                "newteamId": data.new_teamId,
                "newrole": data.new_role
            },
            success: function(result) {
                console.log(result);
                if (result.status == 0) {
                    successCallBack(result.resultObj);
                } else {
                    Api.alert(result.message)
                }
            }
        })
    }
    var deletePoliceMessage = function(data, successCallBack) {
        Api.POST({
            url: "/api/Crm/DeletePolice",
            data: {
                "id": data.id
            },
            success: function(result) {
                console.log(result);
                if (result.status == 0) {
                    successCallBack(result.resultObj);
                } else {
                    Api.alert(result.message)
                }
            }
        })
    }



    return {
        "getPoliceMessageList": getPoliceMessageList, // 获取指定派出所下民警
        "createPolice": createPolice, // 创建警员
        "updatePoliceMessageList": updatePoliceMessageList, // 修改指定警员信息
        "deletePoliceMessage": deletePoliceMessage, // 删除指定警员
    }
})