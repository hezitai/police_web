services.factory('messageServers', function(Api, user, ngDialog) {
    var getMessageList = function(data, successCallback) {
        // console.log(data);
        Api.GET({
            //			url :"/crm/Entities?$expand=attributes($filter=name eq 'createdon'  or name eq 'ds_content'  or name eq 'ds_isread'  or name eq 'ds_message_type'  or name eq 'ds_messageid'  or name eq 'ds_name'),lookups&$filter=name eq'ds_message' and  query eq '{{{ds_message_type ne @code/100000001} and {ds_message_type ne @code/100000003}}and {ds_receiveid_police eq "+ data.id +"}}'and page eq 1 and count eq 10 and orderby eq 'createdon/desc'",
            url: "/crm/Entities?$expand=attributes($filter=name eq 'createdon'  or name eq 'ds_content'  or name eq 'ds_isread'  or name eq 'ds_message_type'  or name eq 'ds_messageid'  or name eq 'ds_name'),lookups&$filter=name eq 'ds_message' and  query eq '{{{ds_message_type ne @code/100000001} and {ds_message_type ne @code/100000003}} and {ds_receiveid_police eq " + data.policeCrmId + "}}'and page eq " + data.index + " and count eq 10 and orderby eq 'createdon/desc'",
            success: function(result) {
                var resultValue = Api.format.CRMList(result.value);
                if (result.value.length != 0) {
                    var _length = result.value[0].totalCount;
                } else {
                    var _length = 0;
                }

                successCallback(resultValue, _length);
                //				console.log("1")
            }
        });
    }
    var updateMessageIsRead = function(data, successCallback) {
        Api.PUT({
            url: "/crm/Entities('ds_message" + data.id + "')",
            data: {
                "attributes": [{
                    "name": "ds_isread",
                    "value": "@b/true"
                }]
            },
            success: function() {
                successCallback();
            }
        })
    }
    var updateMessageByRead = function(data, successCallback) {
        Api.POST({
            url: "/api/Crm/BatchModifyMessageStatus",
            data: {
                "commonStr": data.str,
                "messageType": data.messageType
            },
            success: function(result) {
                successCallback(result);
            }
        })
    }
    var getSenderInfo = function(data, success) {
        Api.POST({
            url: "/api/Crm/GetMessageSenderInfo",
            data: {
                "commonStr": data.id
            },
            success: function(result) {
                console.log(result)
                if (result.status == 0) {
                    success(result.resultObj);
                } else {
                    Api.alert(result.message)
                }
            }
        })
    };

    //	var getDangerousList=function(successCallback){
    //		Api.POST({
    //			url:"/api/Crm/GetDangerousgoodsPublicList",
    //			success:function(result){
    //				
    //				successCallback(result.resultObj);
    //			}
    //			
    //		})
    //	}
    //	var getPoliceList=function(successCallback){
    //		Api.GET({
    //			url:"/crm/Entities?$expand=attributes($filter=name eq 'ds_name' or name eq 'ds_team-teamid'),lookups&$filter=name eq 'ds_address_l1' and query eq 'ds_name ne null'and orderby eq 'createdon/asc'",
    //			success:function(result){
    //				var resultValue = Api.format.CRMList(result.value);
    //				successCallback(resultValue);
    //			}
    //		})
    //	}



    return {
        "getMessageList": getMessageList, // 获取消息中心列表
        "updateMessageIsRead": updateMessageIsRead,
        "updateMessageByRead": updateMessageByRead,
        "getSenderInfo": getSenderInfo //获取发送方信息

        //			"getDangerousList":getDangerousList,
        //			"getPoliceList":getPoliceList,

        ////		getMessageList: function(currentPage, success) {
        ////			var userInfo = user.getUserMessage();
        ////			var guid = userInfo.userModel.crmGuid;
        ////			var pageCount = 10;
        ////			/*console.log(guid);*/
        ////			Api.GET({
        ////				url: "/crm/Entities?$expand=attributes( "+
        ////					"$filter=name eq 'createdon'  "+
        ////					"or name eq 'ds_content' " +
        ////					"or name eq 'ds_isread' " +
        ////					"or name eq 'ds_message_type' " +
        ////					"or name eq 'ds_messageid'  "+
        ////					"or name eq 'ds_name'"+
        ////					"),lookups&$filter=name eq 'ds_message'  "+
        ////					"and query eq '{{ds_receiveid_police eq " + guid + "} "+
        ////					"and {ds_message_type ne @code/100000001}}'  "+
        ////					"and page eq " + currentPage + 
        ////					" and count eq " + pageCount + 
        ////					" and orderby eq 'createdon/desc'",
        ////				success: function(result) {
        ////					/*console.log(result);*/
        ////					var count = result.value[0] ? result.value[0].count : 0;
        ////					var currentPage = result.value[0] ? result.value[0].page : 1;
        ////					var totalCount = result.value[0] ? result.value[0].totalCount : 0;
        ////					var resultValue = Api.format.CRMList(result.value);
        ////					if (resultValue.length == 0) {
        ////						success(resultValue, 0, 0);
        ////						Api.alert(
        ////							'还没有消息哦');
        ////					} else {
        ////						success(resultValue, totalCount, currentPage);
        ////					}
        ////				}
        ////			});
        ////		},
        //		//删除
        ////		batchRemove: function(item, success) {
        ////			Api.DELETE({
        ////				url: "/crm/Entities('ds_message" + item.id + "')",
        ////				success: function(data) {
        ////					console.log('success');
        ////					if (success) {
        ////						success();
        ////					}
        ////				},
        ////				error: function() {
        ////					console.log('error');
        ////				},
        ////			});
        ////		},
        ////		//标记为已读
        ////		updateRead: function(item, success) {
        ////			Api.PUT({
        ////				url: "/crm/Entities('ds_message" + item.id + "')",
        ////				data: {
        ////					"attributes": [{
        ////						"name": "ds_isread",
        ////						"value": "@b/True"
        ////					}]
        ////				},
        ////				success: function(data) {
        ////					console.log('success');
        ////					if (success) {
        ////						success();
        ////					}
        ////				},
        ////				error: function() {
        ////					console.log('error');
        ////				},
        ////			});
        ////		},
        ////		timeShow: function(str) {
        ////			var createdon = str.split(" ");
        ////			return createdon[0];
        ////		},
        //
    }
});

//http://192.168.1.102:8090/crm/Entities?$expand=attributes(
//	$filter=name eq 'createdon'  
//	or name eq 'ds_content'  
//	or name eq 'ds_isread'   
//	or name eq 'ds_messageid'),lookups&
//	$filter=name eq 'ds_message' 
//	and  query eq '{{{ds_message_type ne @code/100000001} and {ds_message_type ne @code/100000003}} and {ds_receiveid_police eq 79050300-3FB5-E611-80C8-001C42A95ADF}}'
//	and page eq 1 and count eq 10 and orderby eq 'createdon/desc'
//	
//
//select createdon,ds_content,ds_isread,ds_messageid from ds_message 
//where query eq '{{{ds_message_type ne @code/100000001} and {ds_message_type ne @code/100000003}} and {ds_receiveid_police eq 79050300-3FB5-E611-80C8-001C42A95ADF}}'