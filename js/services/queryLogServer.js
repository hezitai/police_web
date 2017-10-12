services.factory('queryLogServers', function(Api) {
	//获取派出所
	var getPoliceHouse = function(success, unloading) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes($filter=" +
				"name eq 'ds_name' " +
				"or name eq 'ds_team-teamid'" +
				"),lookups&$filter=name eq 'ds_address_l1' and query eq 'ds_name ne null' and orderby eq 'createdon/asc'",
			success: function(result) {
				var resultValue = Api.format.CRMList(result.value);
				var resultList = [];
				for (var i = 0; i < resultValue.length; i++) {
					if (resultValue[i]['ds_team-teamid']) {
						resultList.push({
							name: resultValue[i].ds_name,
							value: resultValue[i]['ds_team-teamid'],
						});
					}
				};
				success(resultList);
			},
			unloading: unloading
		});
	};
	//获取派出所下所有警员
	var getPoliceByTeamId = function(success) {
		Api.POST({
			url: "/api/Crm/GetAllPolice",
			success: function(result) {
				if (result.status == 0) {
					success(result.resultObj);
				} else {
					$cordovaToast.showShortCenter('获取警员列表失败');
				};
			},
		});
	};
	var isRefresh = false;
	return {
		getPoliceHouse: getPoliceHouse, //获取所有派出所
		getPoliceByTeamId: getPoliceByTeamId, // 获取派出所下所有警员
		isRefresh: {
			set: function(value) {
				isRefresh = value;
			},
			get: function() {
				return isRefresh;
			}
		},
	}
});