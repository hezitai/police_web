services.factory('messageServers', function(Api,user,ngDialog) {
	return {
		getMessageList: function(currentPage,success) {
			var userInfo = user.getUserMessage();
			var guid = userInfo.userModel.crmGuid;
			var pageCount = 2;
			/*console.log(guid);*/
			Api.request.get({
				url: "/crm/Entities?$expand=attributes( $filter=name eq 'createdon'  or name eq 'ds_content'  or name eq 'ds_isread'  or name eq 'ds_message_type' or name eq 'ds_messageid'  or name eq 'ds_name'),lookups&$filter=name eq 'ds_message'  and query eq '{{ds_receiveid_police eq "+guid+"} and {ds_message_type ne @code/100000001}}'  and page eq "+currentPage+" and count eq "+pageCount+" and orderby eq 'createdon/desc'",
				success: function(result) {
					/*console.log(result);*/
					var count = result.value[0]? result.value[0].count:0; 
					var currentPage = result.value[0]?result.value[0].page : 1;
					var totalCount = result.value[0]?result.value[0].totalCount:0;
					var resultValue = Api.formatting.CRMList(result.value);
					if (resultValue.length == 0) {
						success(resultValue,0,0);
						Api.popUp.alert('还没有消息哦');
					} else {
						success(resultValue,totalCount,currentPage);
					}
				}
			});
		},
		//删除
		batchRemove:function(item,success){
			Api.request.deleteAjax({
				url: "/crm/Entities('ds_message" + item.id + "')",
                   			 success: function (data) {
                       				 console.log('success');
                       				if (success) {
                       					success();
                       				}
                  			  },
                 			   error: function () {
                       				 console.log('error');
                 			   },
			});
		},
		//标记为已读
		updateRead:function(item,success){
			Api.request.updata({
				url: "/crm/Entities('ds_message" + item.id + "')",
				data: {
                       				 "attributes": [{
                         				 	  "name": "ds_isread",
                          				  	"value": "@b/True"
                      				   }]
                  			  },
                   			 success: function (data) {
                       				 console.log('success');
                       				if (success) {
                       					success();
                       				}
                  			  },
                 			   error: function () {
                       				 console.log('error');
                 			   },
			});
		},
		timeShow:function(str){
			var createdon = str.split(" ");
			return createdon[0];
		}
	}
});