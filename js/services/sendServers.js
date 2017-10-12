services.factory('sendServers', function(Api, $resource, user) {
    var getPoliceAndman = function(data, successCallback) {
        Api.POST({
            url: "/api/Crm/GetAllPolice",
            data: data.teamname,
            success: function(result) {
                if (result.status == 0) {
                    successCallback(result.resultObj);
                } else {
                    Api.alert('获取失败')
                }
            }
        })
    };
    var getImportantPeopleList = function(successCallback) {
        Api.GET({
            url: "/crm/Entities?$expand=attributes(" +
                "$filter=name eq 'ds_person-ds_id'" +
                "or name eq 'ds_person-ds_name'" +
                "or name eq 'ds_person'" +
                "or name eq 'ds_regulatoryreason-ds_name'" +
                "or name eq 'ds_regulatoryscope-ds_name'" +
                "or name eq 'ds_enddate'" +
                "or name eq 'ds_policestation-name'" +
                "or name eq 'ds_policestation'" +
                "or name eq 'ds_prioritypeopleid'" +
                "),lookups& $filter=name eq 'ds_prioritypeople'" +
                "and query eq 'ds_enddate gt 2017/03/01'",
            success: function(result) {
                var resultValue = Api.format.CRMList(result.value);
                successCallback(resultValue);
            }
        })
    };
    var getPublicList = function(data, successCallback) {
        Api.POST({
            url: "/api/Crm/GetPublicOrderList",
            data: {
                "type": "0"
            },
            success: function(result) {
                if (result.status == 0) {
                    successCallback(result.resultObj);
                } else {
                    Api.alert('获取失败');
                }
            }
        })
    }
    var sendMessage = function(data, successCallback) {
        Api.POST({
            url: '/crm/Entities',
            data: {
                "name": data.name,
                "attributes": data.attributes
            },
            success: function(result) {
                console.log(result)
                successCallback();

            }
        })
    }


    return {
        'getPoliceAndman': getPoliceAndman, //获取所有警员及所处派出所
        'getImportantPeopleList': getImportantPeopleList, //获取重点人口列表
        'getPublicList': getPublicList, //获取行业场所列表
        'sendMessage': sendMessage, //发送消息


    }
});