services.factory('workReportServers', function(Api) {
	return {
		
		alertTips:function(str){
			Api.popUp.alert(str);
		},
	}
});