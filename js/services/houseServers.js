services.factory('houseServers', function(Api, user, ngDialog) {
    var getHouseMessageList = function(data, successCallback) {
        Api.POST({
            url: "/api/Crm/GetRealHouseManageByPC",
            data: {
                "policeid": data.id,
                "commonStr": data.search
            },
            success: function(result) {
                if (result.status == 0) {
                    successCallback(result.resultObj);
                } else {
                    Api.alert('获取失败');
                }
            }
        })
    };
    // 警务责任区类型
    var getPolicePlaceKindOption = function(successCallback) {
        Api.GET({
            url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_name' or name eq 'ds_team-teamid'),lookups&$filter=name eq 'ds_address_l1' and query eq 'ds_name ne null'and orderby eq 'createdon/asc'",
            success: function(result) {
                var resultValue = Api.format.CRMList(result.value);
                successCallback(resultValue);
            }
        })
    };
    // 获取房屋信息
    var getHouseMessage = function(data, successCallback) {
        Api.GET({
            url: "/crm/Entities?$expand=attributes($filter= name eq 'ds_address' or name eq 'ds_area' or name eq 'ds_buildingnum' or name eq 'ds_collectperson' or name eq 'ds_comment' or name eq 'ds_date' or name eq 'ds_dutyplace-ds_name' or name eq 'ds_dutyplace-teamid' or name eq 'ds_household' or name eq 'ds_houseowner-ds_personid' or name eq 'ds_kind' or name eq 'ds_property' or name eq 'ds_realhouseId' or name eq 'ds_realityroom' or name eq 'ds_roomfigure' or name eq 'ds_roomnum' or name eq 'ds_securitytype' or name eq 'ds_structure' or name eq 'ds_unit' or name eq 'ds_usingarea' or name eq 'ds_dutypolice-ds_name' or name eq 'ds_rentroomnum' or name eq 'ds_dutypolice'),lookups&$filter=name eq 'ds_realhouse' and query eq 'ds_realhouseid eq " + data.crmId + "'",
            success: function(result) {
                var resultvalue = Api.format.CRMValue(result.value);
                successCallback(resultvalue);
            }
        });
    };
    var getHouseOwner = function(data, successCallback) {
        Api.GET({
            url: "/crm/Entities?$expand=attributes($filter= name eq 'ds_account' or name eq 'ds_address' or name eq 'ds_birth' or name eq 'ds_bloodtype' or name eq 'ds_education' or name eq 'ds_gender' or name eq 'ds_height' or name eq 'ds_id' or name eq 'ds_idaheadpic' or name eq 'ds_idbackpic' or name eq 'ds_livestatus' or name eq 'ds_marriage' or name eq 'ds_name' or name eq 'ds_nation' or name eq 'ds_nativeplace' or name eq 'ds_oldname' or name eq 'ds_personid' or name eq 'ds_phone' or name eq 'ds_phone2' or name eq 'ds_politics' or name eq 'ds_qq' or name eq 'ds_telephone' or name eq 'ds_wechat')&$filter=name eq 'ds_person' and query eq 'ds_personid eq " + data.id + "'",
            success: function(result) {
                var resultValue = Api.format.CRMValue(result.value);
                successCallback(resultValue);
            }
        })
    }
    var getHouseLivingNowList = function(id, successCallback) {
        var time = Api.formatDate('YYYY.MM.DD HH:mm:ss');
        Api.GET({
            url: "/crm/Entities?$expand=attributes($filter= name eq 'ds_liveway' or name eq 'ds_residentsassociationId' or name eq 'ds_realhouse_ref' or name eq 'ds_person_ref' or name eq 'ds_enddate' or name eq 'ds_startdate' or name eq 'ds_person_ref-ds_name' or name eq 'ds_person_ref-ds_id' or name eq 'ds_person_ref-ds_phone' or name eq 'ds_person_ref-ds_phone2'),lookups&$filter=name eq 'ds_residentsassociation'and query eq '{{{{ds_enddate gt " + time + "} or {ds_startdate lt " + time + "}} and {ds_realhouse_ref eq " + id + "}} and {ds_liveway eq @code/100000001}}'",
            success: function(result) {
                var resultValue = Api.format.CRMList(result.value);
                successCallback(resultValue);
            }
        })
    }
    var houseUserDetail = function(id, success) {
        Api.GET({
            url: "/crm/Entities?$expand=attributes($filter= name eq 'ds_enddate' or name eq 'ds_startdate' or name eq 'ds_liveway' or name eq 'ds_person_ref' or name eq 'ds_realhouse_ref' or name eq 'ds_person_ref-ds_account' or name eq 'ds_person_ref-ds_address' or name eq 'ds_person_ref-ds_birth' or name eq 'ds_person_ref-ds_bloodtype' or name eq 'ds_person_ref-ds_education' or name eq 'ds_person_ref-ds_gender' or name eq 'ds_person_ref-ds_height' or name eq 'ds_person_ref-ds_id' or name eq 'ds_person_ref-ds_idaheadpic' or name eq 'ds_person_ref-ds_idbackpic' or name eq 'ds_person_ref-ds_livestatus' or name eq 'ds_person_ref-ds_marriage' or name eq 'ds_person_ref-ds_name' or name eq 'ds_person_ref-ds_nation' or name eq 'ds_person_ref-ds_nativeplace' or name eq 'ds_person_ref-ds_oldname' or name eq 'ds_person_ref-ds_personid' or name eq 'ds_person_ref-ds_phone' or name eq 'ds_person_ref-ds_phone2' or name eq 'ds_person_ref-ds_politics' or name eq 'ds_person_ref-ds_qq' or name eq 'ds_person_ref-ds_telephone' or name eq 'ds_person_ref-ds_wechat' ),lookups&$filter=name eq 'ds_residentsassociation' and query eq 'ds_residentsassociationid eq " + id + "'",
            success: function(result) {
                var value = Api.format.CRMValue(result.value);
                success(value);
            }
        });
    };
    var getLesseeList = function(id, success) {
        var time = Api.formatDate('YYYY.MM.DD HH:mm:ss');
        Api.GET({
            url: "/crm/Entities?$expand=attributes($filter= name eq 'ds_liveway' or name eq 'ds_residentsassociationId' or name eq 'ds_realhouse_ref' or name eq 'ds_person_ref' or name eq 'ds_enddate' or name eq 'ds_startdate' or name eq 'ds_person_ref-ds_name' or name eq 'ds_person_ref-ds_id' or name eq 'ds_person_ref-ds_phone' or name eq 'ds_person_ref-ds_phone2'),lookups&$filter=name eq 'ds_residentsassociation'and query eq '{{{{ds_enddate gt " + time + "} or {ds_startdate lt " + time + "}} and {ds_realhouse_ref eq " + id + "}} and {ds_liveway eq @code/100000002}}'",
            success: function(result) {
                var value = Api.format.CRMList(result.value);
                success(value);
            },
        });
    };
    var getSub = function(id, success, error) {
        Api.POST({
            url: "/api/Place/GetStub",
            data: {
                id: id
            },
            success: function(result) {
                if (result.status == 0) {
                    success(result.resultObj.fileTempPath);
                } else {
                    if (error) {
                        error(result);
                    } else {
                        $cordovaToast.showShortCenter('未找到图片');
                    }
                }
            },
        });
    }
    return {
        "getHouseMessageList": getHouseMessageList, // 获取房屋列表
        "getPolicePlaceKindOption": getPolicePlaceKindOption, // 获取派出所列表
        "getHouseMessage": getHouseMessage, // 获取房屋详情
        "getHouseOwner": getHouseOwner, //获取房主信息
        "getSub": getSub, //身份证正面照
        "getHouseLivingNowList": getHouseLivingNowList, //获取现居住人信息
        "houseUserDetail": houseUserDetail, //获取现居住人详情
        "getLesseeList": getLesseeList, //获取承租人信息
    };
})