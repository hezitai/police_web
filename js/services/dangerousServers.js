services.factory('dangerous', function(Api) {

	var getDangerPublicList = function(success) {
		Api.POST({
			url: "/api/Crm/GetDangerousgoodsPublicList",
			success: function(result) {
				if(result.status==0){					
					success(result.resultObj);
				}
				else{
					
					Api.alert(result.message);
				}				
			}
		});
	};

	return{
		getDangerPublicList:getDangerPublicList,
	}
})