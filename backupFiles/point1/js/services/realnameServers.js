services.factory('realnameServers', function(Api) {
	return {
		
		alertTips:function(str){
			Api.popUp.alert(str);
		},
	}
});