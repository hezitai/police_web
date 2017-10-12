services.factory('search', function(Api) {
	var personSearchDim = function(name, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes(" +
				"$filter=name eq 'ds_name' or " +
				"name eq 'ds_account'or " +
				"name eq 'ds_address'or " +
				"name eq 'ds_birth'or " +
				"name eq 'ds_bloodtype'or " +
				"name eq 'ds_education'or " +
				"name eq 'ds_gender'or " +
				"name eq 'ds_height'or " +
				"name eq 'ds_id'or " +
				"name eq 'ds_idaheadpic'or " +
				"name eq 'ds_idbackpic'or " +
				"name eq 'ds_livestatus'or " +
				"name eq 'ds_marriage'or " +
				"name eq 'ds_nation'or " +
				"name eq 'ds_nativeplace'or " +
				"name eq 'ds_oldname'or " +
				"name eq 'ds_personid'or " +
				"name eq 'ds_phone'or " +
				"name eq 'ds_phone2'or name eq 'ds_placeaddress'or name eq 'ds_politics'or name eq 'ds_qq'or name eq 'ds_telephone'or name eq 'ds_wechat')" +
				"&$filter=name eq 'ds_person' and query eq '{{ds_name like %25" + name + "%25} or {ds_id like %25" + name + "%25}}'",
			success: function(result) {
				console.log(result);
				var value = Api.format.CRMList(result.value);
				success(value);

			}
		});
	};
	var personSearchPrecise = function(name, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_name' or name eq 'ds_account'or name eq 'ds_address'or name eq 'ds_birth'or name eq 'ds_bloodtype'or name eq 'ds_education'or name eq 'ds_gender'or name eq 'ds_height'or name eq 'ds_id'or name eq 'ds_idaheadpic'or name eq 'ds_idbackpic'or name eq 'ds_livestatus'or name eq 'ds_marriage'or name eq 'ds_nation'or name eq 'ds_nativeplace'or name eq 'ds_oldname'or name eq 'ds_personid'or name eq 'ds_phone'or name eq 'ds_phone2'or name eq 'ds_placeaddress'or name eq 'ds_politics'or name eq 'ds_qq'or name eq 'ds_telephone'or name eq 'ds_wechat')&$filter=name eq 'ds_person' and query eq '{{ds_name eq " + name + "} or {ds_id eq " + name + "}}'",
			success: function(result) {
				var value = Api.format.CRMList(result.value);
				success(value);
			}
		});
	};

	var getPersonDetail = function(id, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_name' or name eq 'ds_account'or name eq 'ds_address'or name eq 'ds_birth'or name eq 'ds_bloodtype'or name eq 'ds_education'or name eq 'ds_gender'or name eq 'ds_height'or name eq 'ds_id'or name eq 'ds_idaheadpic'or name eq 'ds_idbackpic'or name eq 'ds_livestatus'or name eq 'ds_marriage'or name eq 'ds_nation'or name eq 'ds_nativeplace'or name eq 'ds_oldname'or name eq 'ds_personid'or name eq 'ds_phone'or name eq 'ds_phone2'or name eq 'ds_placeaddress'or name eq 'ds_politics'or name eq 'ds_qq'or name eq 'ds_telephone'or name eq 'ds_wechat')&$filter=name eq 'ds_person' and query eq 'ds_personid eq " + id + "'",
			success: function(result) {
				var value = Api.format.CRMValue(result.value);
				success(value);
			},
		});
	};
	var getPersonHouse = function(id, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_address' or name eq 'ds_address_tree' or name eq 'ds_area' or name eq 'ds_buildingnum' or name eq 'ds_collectperson' or name eq 'ds_comment' or name eq 'ds_date' or name eq 'ds_dutyplace' or name eq 'ds_dutypolice' or name eq 'ds_floor' or name eq 'ds_household' or name eq 'ds_houseowner' or name eq 'ds_kind' or name eq 'ds_property' or name eq 'ds_realhouseid' or name eq 'ds_realityroom' or name eq 'ds_rentroomnum' or name eq 'ds_roomfigure' or name eq 'ds_roomnum' or name eq 'ds_securitytype' or name eq 'ds_structure' or name eq 'ds_unit' or name eq 'ds_usingarea' ),lookups&$filter=name eq 'ds_realhouse' and query eq 'ds_houseowner eq " + id + "'",
			success: function(result) {

				var value = Api.format.CRMList(result.value);
				success(value);
			},
		});
	};
	var getHousePeopel = function(data, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_enddate' or name eq 'ds_liveway' or name eq 'ds_person_ref-ds_personid' or name eq 'ds_person_ref-ds_name' or name eq 'ds_person_ref-ds_id' or name eq 'ds_realhouse_ref' or name eq 'ds_startdate'),lookups&$filter=name eq 'ds_residentsassociation' and query eq 'ds_realhouse_ref eq " + data.ds_realhouseid + "'",
			success: function(result) {

				var value = Api.format.CRMList(result.value);
				success(value, data);
			},
		});
	};
	var getHousePeopelDetail = function(id, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_enddate' or name eq 'ds_liveway' or name eq 'ds_person_ref' or name eq 'ds_realhouse_ref' or name eq 'ds_startdate'or name eq 'ds_person_ref-ds_account'or name eq 'ds_person_ref-ds_address'or name eq 'ds_person_ref-ds_birth'or name eq 'ds_person_ref-ds_bloodtype'or name eq 'ds_person_ref-ds_education'or name eq 'ds_person_ref-ds_gender'or name eq 'ds_person_ref-ds_height'or name eq 'ds_person_ref-ds_id'or name eq 'ds_person_ref-ds_idaheadpic'or name eq 'ds_person_ref-ds_idbackpic'or name eq 'ds_person_ref-ds_livestatus'or name eq 'ds_person_ref-ds_marriage'or name eq 'ds_person_ref-ds_nation'or name eq 'ds_person_ref-ds_nativeplace'or name eq 'ds_person_ref-ds_oldname'or name eq 'ds_person_ref-ds_personid'or name eq 'ds_person_ref-ds_phone'or name eq 'ds_person_ref-ds_phone2'or name eq 'ds_person_ref-ds_placeaddress'or name eq 'ds_person_ref-ds_politics'or name eq 'ds_person_ref-ds_qq'or name eq 'ds_person_ref-ds_telephone'or name eq 'ds_person_ref-ds_wechat'),lookups&$filter=name eq 'ds_residentsassociation' and query eq 'ds_person_ref eq " + id + "'",
			success: function(result) {
				var value = Api.format.CRMValue(result.value);
				success(value);
			},
		});
	};
	var getPeopelCar = function(id, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_address' or name eq 'ds_color' or name eq 'ds_description' or name eq 'createdon' or name eq 'ds_driver-ds_personid' or name eq 'ds_information' or name eq 'ds_latitude' or name eq 'ds_longitude' or name eq 'ds_model' or name eq 'ds_name' or name eq 'ds_number' or name eq 'ds_person-ds_personid' or name eq 'ds_picstubidarray' or name eq 'ds_vehicleid' ),lookups&$filter=name eq 'ds_vehicle' and query eq 'ds_driver eq " + id + "'",
			success: function(result) {
				var value = Api.format.CRMList(result.value);
				success(value);
			},
		});
	};
	var getPeopelCase = function(id, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_address' or name eq 'ds_caseid' or name eq 'ds_caselocation' or name eq 'ds_caseposition' or name eq 'ds_casestatus' or name eq 'ds_casetype-ds_name' or name eq 'ds_description' or name eq 'ds_happendate' or name eq 'ds_helppolice' or name eq 'ds_latitude' or name eq 'ds_longitude' or name eq 'ds_name' or name eq 'ds_personlist' or name eq 'ds_pic' or name eq 'ds_police_ref-systemuserid' or name eq 'ds_policestation_ref' or name eq 'ds_receiveddate' or name eq 'ds_video' ),lookups&$filter=name eq 'ds_case' and query eq 'ds_personlist like %25" + id + "'",
			success: function(result) {
				var value = Api.format.CRMList(result.value);
				success(value);
			},
		});
	};
	var carSearchDim = function(num, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_name' or name eq 'ds_address' or name eq 'ds_color' or name eq 'ds_description' or name eq 'ds_driver-ds_personid' or name eq 'ds_information' or name eq 'ds_latitude' or name eq 'ds_longitude' or name eq 'ds_model' or name eq 'ds_name' or name eq 'ds_number' or name eq 'ds_person-ds_personid' or name eq 'ds_picstubidarray' or name eq 'ds_vehicleid' ),lookups&$filter=name eq 'ds_vehicle' and query eq 'ds_number like %25" + num + "%25'",
			success: function(result) {
				var value = Api.format.CRMList(result.value);
				success(value);
			},
		});
	};
	var carSearchPrecise = function(num, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_name' or name eq 'ds_address' or name eq 'ds_color' or name eq 'ds_description' or name eq 'ds_driver-ds_personid' or name eq 'ds_information' or name eq 'ds_latitude' or name eq 'ds_longitude' or name eq 'ds_model' or name eq 'ds_name' or name eq 'ds_number' or name eq 'ds_person-ds_personid' or name eq 'ds_picstubidarray' or name eq 'ds_vehicleid' ),lookups&$filter=name eq 'ds_vehicle' and query eq 'ds_number eq " + num + "'",
			success: function(result) {
				var value = Api.format.CRMList(result.value);
				success(value);
			},
		});
	};
	var caseSearchDim = function(text, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_name' or name eq 'ds_address' or name eq 'ds_caseid' or name eq 'ds_caselocation' or name eq 'ds_caseposition' or name eq 'ds_casestatus' or name eq 'ds_casetype-ds_name' or name eq 'ds_description' or name eq 'ds_happendate' or name eq 'ds_helppolice' or name eq 'ds_latitude' or name eq 'ds_longitude' or name eq 'ds_name' or name eq 'ds_personlist' or name eq 'ds_pic' or name eq 'ds_police_ref-systemuserid' or name eq 'ds_policestation_ref' or name eq 'ds_receiveddate' or name eq 'ds_video' ),lookups&$filter=name eq 'ds_case' and query eq 'ds_name like %25" + text + "%25'",
			success: function(result) {
				var value = Api.format.CRMList(result.value);
				success(value);
			},
		});
	};
	var caseSearchPrecise = function(text, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_name' or name eq 'ds_address' or name eq 'ds_caseid' or name eq 'ds_caselocation' or name eq 'ds_caseposition' or name eq 'ds_casestatus' or name eq 'ds_casetype-ds_name' or name eq 'ds_description' or name eq 'ds_happendate' or name eq 'ds_helppolice' or name eq 'ds_latitude' or name eq 'ds_longitude' or name eq 'ds_name' or name eq 'ds_personlist' or name eq 'ds_pic' or name eq 'ds_police_ref-systemuserid' or name eq 'ds_policestation_ref' or name eq 'ds_receiveddate' or name eq 'ds_video' ),lookups&$filter=name eq 'ds_case' and query eq 'ds_name eq " + text + "'",
			success: function(result) {
				var value = Api.format.CRMList(result.value);
				success(value);
			},
		});
	};
	var publicSearchDim = function(text, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_name' or name eq 'ds_address' or name eq 'ds_address_tree' or name eq 'ds_asset' or name eq 'ds_buildingaddress' or name eq 'ds_businesskind' or name eq 'ds_charger' or name eq 'ds_collectperson' or name eq 'ds_districtpolicestation_name' or name eq 'ds_employeenum' or name eq 'ds_firelevel' or name eq 'ds_firestub' or name eq 'ds_fund' or name eq 'ds_inspectiondate' or name eq 'ds_ischekcin' or name eq 'ds_issmall' or name eq 'ds_latitude' or name eq 'ds_locationpic' or name eq 'ds_longitude' or name eq 'ds_officer' or name eq 'ds_owner_position' or name eq 'ds_owner_ref' or name eq 'ds_phone' or name eq 'ds_publicorderid' or name eq 'ds_publicowner_position' or name eq 'ds_qrcodestub' or name eq 'ds_responsibilityofsecurityorgans_name' or name eq 'ds_securityissue' or name eq 'ds_securityissue_result' or name eq 'ds_securityowner_ref' or name eq 'ds_stub' or name eq 'ds_superiorcharger' or name eq 'ds_superiorofficer' or name eq 'ds_viewnum' )&$filter=name eq 'ds_publicorder' and query eq 'ds_name like %25" + text + "%25'",
			success: function(result) {
				var value = Api.format.CRMList(result.value);
				success(value);
			},
		});
	};
	var publicSearchPrecise = function(text, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_name' or name eq 'ds_address' or name eq 'ds_address_tree' or name eq 'ds_asset' or name eq 'ds_buildingaddress' or name eq 'ds_businesskind' or name eq 'ds_charger' or name eq 'ds_collectperson' or name eq 'ds_districtpolicestation_name' or name eq 'ds_employeenum' or name eq 'ds_firelevel' or name eq 'ds_firestub' or name eq 'ds_fund' or name eq 'ds_inspectiondate' or name eq 'ds_ischekcin' or name eq 'ds_issmall' or name eq 'ds_latitude' or name eq 'ds_locationpic' or name eq 'ds_longitude' or name eq 'ds_officer' or name eq 'ds_owner_position' or name eq 'ds_owner_ref' or name eq 'ds_phone' or name eq 'ds_publicorderid' or name eq 'ds_publicowner_position' or name eq 'ds_qrcodestub' or name eq 'ds_responsibilityofsecurityorgans_name' or name eq 'ds_securityissue' or name eq 'ds_securityissue_result' or name eq 'ds_securityowner_ref' or name eq 'ds_stub' or name eq 'ds_superiorcharger' or name eq 'ds_superiorofficer' or name eq 'ds_viewnum' )&$filter=name eq 'ds_publicorder' and query eq 'ds_name eq " + text + "'",
			success: function(result) {
				var value = Api.format.CRMList(result.value);
				success(value);
			},
		});
	};

	var houseSearchDim = function(text, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_name' or name eq 'ds_address' or name eq 'ds_address_tree' or name eq 'ds_area' or name eq 'ds_buildingnum' or name eq 'ds_collectperson' or name eq 'ds_comment' or name eq 'ds_date' or name eq 'ds_dutyplace-ds_name' or name eq 'ds_dutypolice-ds_name' or name eq 'ds_floor' or name eq 'ds_household' or name eq 'ds_houseowner-ds_personid' or name eq 'ds_kind' or name eq 'ds_property' or name eq 'ds_realhouseid' or name eq 'ds_realityroom' or name eq 'ds_rentroomnum' or name eq 'ds_roomfigure' or name eq 'ds_roomnum' or name eq 'ds_securitytype' or name eq 'ds_structure' or name eq 'ds_unit' or name eq 'ds_usingarea' ),lookups&$filter=name eq 'ds_realhouse' and query eq 'ds_address like %25" + text + "%25'",
			success: function(result) {
				var value = Api.format.CRMList(result.value);
				success(value);
			},
		});
	};
	var houseSearchPrecise = function(text, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_name' or name eq 'ds_address' or name eq 'ds_address_tree' or name eq 'ds_area' or name eq 'ds_buildingnum' or name eq 'ds_collectperson' or name eq 'ds_comment' or name eq 'ds_date' or name eq 'ds_dutyplace-ds_name' or name eq 'ds_dutypolice-ds_name' or name eq 'ds_floor' or name eq 'ds_household' or name eq 'ds_houseowner-ds_personid' or name eq 'ds_kind' or name eq 'ds_property' or name eq 'ds_realhouseid' or name eq 'ds_realityroom' or name eq 'ds_rentroomnum' or name eq 'ds_roomfigure' or name eq 'ds_roomnum' or name eq 'ds_securitytype' or name eq 'ds_structure' or name eq 'ds_unit' or name eq 'ds_usingarea' ),lookups&$filter=name eq 'ds_realhouse' and query eq 'ds_address eq " + text + "'",
			success: function(result) {
				var value = Api.format.CRMList(result.value);
				success(value);
			},
		});
	};
	var houseJudge = function(data,success){
		Api.POST({
			url:"/api/Crm/GetRealHouseAddressInfo",
			data:data,
			success:function(result){				
				success(result.resultObj);
			}
		})
	};


	return {
		personSearchDim: personSearchDim, //人口模糊查询
		personSearchPrecise: personSearchPrecise, // 人口精确查询
		getPersonDetail: getPersonDetail, // 获取指定人口信息
		getPersonHouse: getPersonHouse, // 获取指定人口房屋信息
		getHousePeopel: getHousePeopel, // 获取指定房屋关联人口信息
		getHousePeopelDetail: getHousePeopelDetail, // 获取房屋关联人的指定人口信息
		getPeopelCar: getPeopelCar, //获取指定人口车辆信息
		getPeopelCase: getPeopelCase, //获取指定人口车辆信息
		carSearchDim: carSearchDim, //车辆模糊查询
		carSearchPrecise: carSearchPrecise, //车辆精确查询
		caseSearchDim: caseSearchDim, //案件模糊查询
		caseSearchPrecise: caseSearchPrecise, //案件精确查询
		publicSearchDim: publicSearchDim, //行业场所模糊查询
		publicSearchPrecise: publicSearchPrecise, //行业场所精确查询
		houseSearchDim: houseSearchDim, //房屋模糊查询
		houseSearchPrecise: houseSearchPrecise, //房屋精确查询
		houseJudge:houseJudge,//获取房屋地址树信息
	}
});

//