services.factory('dutyServers', function(Api) {
	// return {
		
	// }
	//获取所有派出所
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
	var getPoliceByTeamId = function(id, success) {
		Api.POST({
			url: "/api/Crm/GetAreaPolice",
			data: {
				"commonStr": id
			},
			success: function(result) {
				if (result.status == 0) {
					success(result.resultObj);
				} else {
					$cordovaToast.showShortCenter('获取警员列表失败');
				};
			},
		});
	};
	//获取指定派出所排班规则
	var getDutyRulesByTeamId = function(id, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes($filter=" +
				"name eq 'ds_date' " +
				"or name eq 'ds_during'" +
				"),lookups&$filter=name eq 'ds_workrankrole' and query eq 'ds_policestation eq " + id + "'",
			success: function(result) {
				if (result.value.length == 0) {
					success(false);
				} else {
					var value = Api.format.CRMValue(result.value);
					success(value);
				}
			},
		});
	};

	var deleteDutyRules = function(id, success) {
		Api.DELETE({
			url: "/crm/Entities('ds_workrankrole" + id + "')",
			success: function() {
				success();
			}
		});
	};

	var deleteRulesItem = function(id, success) {
		Api.DELETE({
			url: "/crm/Entities('ds_workrank" + id + "')",
			success: function() {
				success();
			}
		});
	};

	var updateRulesItem = function(id, data, success) {
		Api.PUT({
			url: "/crm/Entities('ds_workrank" + id + "')",
			data: data,
			success: function() {
				success();
			},
		});
	};
	var getRulesList = function(id, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes(" +
				"$filter=name eq 'ds_json' " +
				"),lookups&$filter=name eq 'ds_workrank' and query eq 'ds_rankrole eq " + id + "' and orderby eq 'createdon/asc'",
			success: function(result) {
				var value = Api.format.CRMList(result.value);
				success(value);
			},
		});
	};
	//获取今天的排班信息
	var getTodayRulesItem = function(id, success) {
		Api.POST({
			url: "/api/Crm/GetPoliceStationWorkRank",
			data: {
				"commonStr": id
			},
			success: function(result) {
				if (result.status == 0) {
					success(result.resultObj);
				} else if (result.status == 2) {
					success(false)
				} else {
					// $cordovaToast.showShortCenter('获取排班信息失败');
					success(false)
				};
			},
			error: function() {
				success(false);
			},
			unloading: true
		});
	};

	var isRefresh = false;
	return {
		getPoliceHouse: getPoliceHouse, //获取所有派出所
		getPoliceByTeamId: getPoliceByTeamId, // 获取派出所下所有警员
		getDutyRulesByTeamId: getDutyRulesByTeamId, // 获取指定派出所排班规则
		deleteDutyRules: deleteDutyRules, // 删除排班规则
		getRulesList: getRulesList, // 获取排班信息列表
		updateRulesItem: updateRulesItem, // 更新排班信息
		deleteRulesItem: deleteRulesItem, // 删除排班信息
		getTodayRulesItem: getTodayRulesItem, // 获取今天的排班信息
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