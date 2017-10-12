services.factory('gather', function(Api) {
	var creatCrm = function(data, success) {
		Api.POST({
			url: "/crm/Entities",
			data: data,
			success: function(result) {
				if (success) {
					success(result.value);
				} else {
					Api.alert('创建成功');
				};
			}
		});
	};
	var upDataPeople = function(id, data, success) {
		Api.PUT({
			url: "/crm/Entities('ds_person" + id + "')",
			data: data,
			success: function(result) {
				if (success) {
					success();
				};
			}
		});
	};
	var getRealHouseList = function(id, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes(" +
				"$filter=name eq 'ds_address' " +
				"or name eq 'ds_realhouseid'" +
				"),lookups&$filter=name eq 'ds_realhouse' and query eq 'ds_address_tree eq " + id + "'",
			success: function(result) {
				var value = Api.format.CRMList(result.value);
				success(value);
			}
		});
	};
	var getHouseMassage = function(id, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes($filter= name eq 'ds_address' " +
				"or name eq 'ds_area'" +
				"or name eq 'ds_buildingnum'" +
				"or name eq 'ds_collectperson'" +
				"or name eq 'ds_comment'" +
				"or name eq 'ds_date'" +
				"or name eq 'ds_dutyplace-ds_name'" +
				"or name eq 'ds_dutyplace-teamid'" +
				"or name eq 'ds_household'" +
				"or name eq 'ds_houseowner-ds_personid'" +
				"or name eq 'ds_kind'" +
				"or name eq 'ds_property'" +
				"or name eq 'ds_realhouseId'" +
				"or name eq 'ds_realityroom'" +
				"or name eq 'ds_roomfigure'" +
				"or name eq 'ds_roomnum'" +
				"or name eq 'ds_securitytype'" +
				"or name eq 'ds_structure'" +
				"or name eq 'ds_unit'" +
				"or name eq 'ds_usingarea'" +
				"or name eq 'ds_dutypolice-ds_name'" +
				"or name eq 'ds_rentroomnum'" +
				"or name eq 'ds_dutypolice'),lookups&$filter=name eq 'ds_realhouse' and query eq 'ds_realhouseid eq " + id + "'",
			success: function(result) {
				var value = Api.format.CRMValue(result.value);
				success(value);
			}
		});
	};
	var getPoliceHouse = function(success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_name' or name eq 'ds_team-teamid'),lookups&$filter=name eq 'ds_address_l1' and query eq 'ds_name ne null'",
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
		});
	};

	var putHouseMassage = function(id, data, success) {
		Api.PUT({
			url: "/crm/Entities('ds_realhouse" + id + "')",
			data: data,
			success: function(result) {
				success();
			},
		})
	};
	var getPersonMessage = function(id, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes(" +
				"$filter= name eq 'ds_account' " +
				"or name eq 'ds_address' " +
				"or name eq 'ds_birth' " +
				"or name eq 'ds_bloodtype' " +
				"or name eq 'ds_education' " +
				"or name eq 'ds_gender' " +
				"or name eq 'ds_height' " +
				"or name eq 'ds_id' " +
				"or name eq 'ds_idaheadpic' " +
				"or name eq 'ds_idbackpic' " +
				"or name eq 'ds_livestatus' " +
				"or name eq 'ds_marriage' " +
				"or name eq 'ds_name' " +
				"or name eq 'ds_nation' " +
				"or name eq 'ds_nativeplace' " +
				"or name eq 'ds_oldname' " +
				"or name eq 'ds_personid' " +
				"or name eq 'ds_phone' " +
				"or name eq 'ds_phone2' " +
				"or name eq 'ds_politics' " +
				"or name eq 'ds_qq' " +
				"or name eq 'ds_telephone' " +
				"or name eq 'ds_wechat')&$filter=name eq 'ds_person' and query eq 'ds_personid eq " + id + "'",
			success: function(result) {
				var value = Api.format.CRMValue(result.value);
				success(value);
			}
		});
	};
	var upDataPeopleMessage = function(id, data, success) {
		Api.PUT({
			url: "/crm/Entities('ds_person" + id + "')",
			data: data,
			success: function() {
				success();
			}
		});
	};

	var getUserList = function(id, success) {
		var time = Api.formatDate('YYYY.MM.DD HH:mm:ss');
		Api.GET({
			url: "/crm/Entities?$expand=attributes(" +
				"$filter= name eq 'ds_liveway'" +
				"or name eq 'ds_residentsassociationId'" +
				"or name eq 'ds_realhouse_ref'" +
				"or name eq 'ds_person_ref'" +
				"or name eq 'ds_enddate'" +
				"or name eq 'ds_startdate'" +
				"or name eq 'ds_person_ref-ds_name'" +
				"or name eq 'ds_person_ref-ds_id'" +
				"or name eq 'ds_person_ref-ds_phone'" +
				"or name eq 'ds_person_ref-ds_phone2'" +
				"),lookups&$filter=name eq 'ds_residentsassociation'and query eq " +
				"'{{{{ds_enddate gt " + time + "} or {ds_startdate lt " + time + "}} and {ds_realhouse_ref eq " + id + "}} and {ds_liveway eq @code/100000001}}'",
			success: function(result) {
				var value = Api.format.CRMList(result.value);
				success(value);
			},
		});
	};

	var getLesseeList = function(id, success) {
		var time = Api.formatDate('YYYY.MM.DD HH:mm:ss');
		Api.GET({
			url: "/crm/Entities?$expand=attributes(" +
				"$filter= name eq 'ds_liveway'" +
				"or name eq 'ds_residentsassociationId'" +
				"or name eq 'ds_realhouse_ref'" +
				"or name eq 'ds_person_ref'" +
				"or name eq 'ds_enddate'" +
				"or name eq 'ds_startdate'" +
				"or name eq 'ds_person_ref-ds_name'" +
				"or name eq 'ds_person_ref-ds_id'" +
				"or name eq 'ds_person_ref-ds_phone'" +
				"or name eq 'ds_person_ref-ds_phone2'" +
				"),lookups&$filter=name eq 'ds_residentsassociation'and query eq " +
				"'{{{{ds_enddate gt " + time + "} or {ds_startdate lt " + time + "}} and {ds_realhouse_ref eq " + id + "}} and {ds_liveway eq @code/100000002}}'",
			success: function(result) {
				var value = Api.format.CRMList(result.value);
				success(value);
			},
		});
	};

	var deleteUser = function(id, success) {
		Api.DELETE({
			url: "/crm/Entities('ds_residentsassociation" + id + "')",
			success: function(result) {
				success();
			}
		})
	};

	var houseUserDetail = function(id, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes(" +
				"$filter= name eq 'ds_enddate' " +
				"or name eq 'ds_startdate' " +
				"or name eq 'ds_liveway' " +
				"or name eq 'ds_person_ref' " +
				"or name eq 'ds_realhouse_ref' " +
				"or name eq 'ds_person_ref-ds_account' " +
				"or name eq 'ds_person_ref-ds_address' " +
				"or name eq 'ds_person_ref-ds_birth' " +
				"or name eq 'ds_person_ref-ds_bloodtype' " +
				"or name eq 'ds_person_ref-ds_education' " +
				"or name eq 'ds_person_ref-ds_gender' " +
				"or name eq 'ds_person_ref-ds_height' " +
				"or name eq 'ds_person_ref-ds_id' " +
				"or name eq 'ds_person_ref-ds_idaheadpic' " +
				"or name eq 'ds_person_ref-ds_idbackpic' " +
				"or name eq 'ds_person_ref-ds_livestatus' " +
				"or name eq 'ds_person_ref-ds_marriage' " +
				"or name eq 'ds_person_ref-ds_name' " +
				"or name eq 'ds_person_ref-ds_nation' " +
				"or name eq 'ds_person_ref-ds_nativeplace' " +
				"or name eq 'ds_person_ref-ds_oldname' " +
				"or name eq 'ds_person_ref-ds_personid' " +
				"or name eq 'ds_person_ref-ds_phone' " +
				"or name eq 'ds_person_ref-ds_phone2' " +
				"or name eq 'ds_person_ref-ds_politics' " +
				"or name eq 'ds_person_ref-ds_qq' " +
				"or name eq 'ds_person_ref-ds_telephone' " +
				"or name eq 'ds_person_ref-ds_wechat' " +
				"),lookups&$filter=name eq 'ds_residentsassociation' and query eq 'ds_residentsassociationid eq " + id + "'",
			success: function(result) {
				var value = Api.format.CRMValue(result.value);
				success(value);
			}
		});
	};

	var upDataUser = function(id, data, success) {
		Api.PUT({
			url: "/crm/Entities('ds_residentsassociation" + id + "')",
			data: data,
			success: function() {
				success();
			}
		});
	};

	return {
		creatCrm: creatCrm, // 创建CRM数据
		upDataPeople: upDataPeople, // 更新人员信息
		getRealHouseList: getRealHouseList, // 获取实有住房列表
		getHouseMassage: getHouseMassage, // 获取房屋信息
		getPoliceHouse: getPoliceHouse, // 获取警务责任区
		putHouseMassage: putHouseMassage, // 更新房屋信息
		getPersonMessage: getPersonMessage, // 获取人员信息
		upDataPeopleMessage: upDataPeopleMessage, // 修改人员信息
		getUserList: getUserList, // 获取现居住人列表
		deleteUser: deleteUser, // 删除人员关联表
		houseUserDetail: houseUserDetail, // 查看人员详情
		upDataUser: upDataUser, // 更新人员信息
		getLesseeList: getLesseeList, // 获取承租人列表
	}
});