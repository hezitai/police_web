services.factory('homePageServers', function(Api, user) {
    var getAllPolice = function(successCallback) {
        Api.GET({
            url: "/crm/Entities?$expand=attributes(" +
                "$filter=name eq 'ds_name' " +
                "or name eq 'ds_team-teamid'" +
                "),lookups&$filter=name eq 'ds_address_l1' " +
                "and query eq 'ds_name ne null'" +
                "and orderby eq 'createdon/asc'",
            success: function(result) {
                var resultValue = Api.format.CRMList(result.value);
                successCallback(resultValue);
            },
            unloading: true
        })
    };
    var getDuty = function(data, successCallback) {
        Api.POST({
            url: "/api/Crm/GetPoliceStationWorkRank",
            data: {
                "commonStr": data.id
            },
            success: function(result) {
                // console.log(result);
                if (result.status == 0 || result.status == 2) {
                    successCallback(result.resultObj);
                } else {
                    Api.alert("警务排班，获取失败");
                }
            }
        })
    };
    var getCaseYesterday = function(data, successCallback) {
        Api.GET({
            url: "/crm/Entities?$expand=attributes(" +
                "$filter=name eq 'ds_name'  " +
                "or name eq 'ds_address'  " +
                "or name eq 'ds_caseid'  " +
                "or name eq 'ds_caselocation'  " +
                "or name eq 'ds_caseposition'  " +
                "or name eq 'ds_casestatus'  " +
                "or name eq 'ds_casetype-ds_name'  " +
                "or name eq 'ds_casetype'  " +
                "or name eq 'ds_description'  " +
                "or name eq 'ds_happendate'  " +
                "or name eq 'ds_helppolice'  " +
                "or name eq 'ds_latitude'  " +
                "or name eq 'ds_longitude'  " +
                "or name eq 'ds_name'  " +
                "or name eq 'ds_personlist'  " +
                "or name eq 'ds_pic'  " +
                "or name eq 'ds_police_ref'  " +
                "or name eq 'ds_policestation_ref'  " +
                "or name eq 'ds_receiveddate'  " +
                "or name eq 'ds_video'  " +
                "),lookups&$filter=name eq 'ds_case' " +
                "and query eq '{createdon gt " + data.date + " 00:00:00} " +
                "and {createdon lt " + data.date + " 23:59:59}' " +
                "and page eq 1 " +
                "and count eq 10 " +
                "and orderby eq 'createdon/desc'",
            success: function(result) {
                var resultValue = Api.format.CRMList(result.value);
                console.log(resultValue);
                successCallback(resultValue);
            },
            unloading: true
        })
    };
    var getRentHouseMessage = function(successCallback) {
        Api.GET({
            url: "/api/Crm/GetRentalHouseCountInfo",
            success: function(result) {
                // console.log(result);
                if (result.status == 0) {
                    successCallback(result.resultObj);
                } else {
                    Api.alert(result.message)
                }
            },
            unloading: true
        })
    };
    var getPublicListForMap = function(data, success) {
        Api.POST({
            url: "/api/Crm/SearchInfoPublic",
            data: {
                "policeStation": ""
            },
            success: function(result) {
                if (result.status == 0) {
                    success(result.resultObj);
                } else {
                    Api.alert(result.message);
                }
            },
            unloading: true
        });
    };
    var getPeopleListForMap = function(data, success) {
        Api.POST({
            url: "/api/Crm/SearchInfoPerson",
            data: {
                "policeStation": ""
            },
            success: function(result) {
                if (result.status == 0) {
                    success(result.resultObj);
                } else {
                    Api.alert(result.message);
                }
            },
            unloading: true
        });
    };


    return {
        "getAllPolice": getAllPolice, // 获取所有警局
        "getDuty": getDuty, // 获取指定派出所排班信息
        "getCaseYesterday": getCaseYesterday, // 案件查询-昨日发生案件
        "getRentHouseMessage": getRentHouseMessage, // 出租屋查询-昨日新增/总数
        "getPublicListForMap": getPublicListForMap, // 获取行业场所列表
        "getPeopleListForMap": getPeopleListForMap, // 获取人员列表
    }
});