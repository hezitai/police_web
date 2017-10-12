services.factory('address', function(Api) {
	var address = [];
	var version = 'none';
	var getAddress = function(success) {
		Api.POST({
			url: '/api/Crm/GetAddressInfoAndVersion',
			success: function(result) {
				if (result.status == 0) {
					address = result.resultObj.address1Models;
					success();
				} else {
					Api.alert('获取地址树信息失败\n请检查网络');
				}
			},
		});
	};
	var getLastAddress = function(id,success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_name' or name eq 'ds_address_l4id'),lookups&$filter=name eq 'ds_address_l4' and query eq 'ds_l3_ref eq " + id + "'",
			success: function(result) {
				var resultValue = Api.format.CRMList(result.value);
				var value = [];
				for (var i = 0; i < resultValue.length; i++) {
					var data = {};
					data.name = resultValue[i]['ds_name'];
					data.id = resultValue[i]['ds_address_l4id'];
					value.push(data);
				}
				success(value);
			}
		});
	};
	var upDataVersion = function(success) {
		Api.POST({
			url: "/api/Crm/UpdateAddressVersion",
			success: function(result) {
				if (result.status == 0) {
					if (success) {
						success();
					}
				}
			}
		});
	};
	var getAddressVersion = function(success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_version' or name eq 'ds_addressversionid'),lookups&$filter=name eq 'ds_addressversion' and query eq 'ds_name ne null'",
			success: function(result) {
				var resultValue = Api.format.CRMValue(result.value);
				var _version = parseInt(resultValue['ds_version']);
				if (_version == version && address.length != 0) {
					success(address);
				} else {
					getAddress(function() {
						version = _version;
						success(address);
					});
				}
			}
		});
	};
	var addAddressSubSecond = function(data, success) {
		Api.POST({
			url: "/crm/Entities",
			data: {
				"name": "ds_address_l2",
				"attributes": [{
					"name": "ds_name",
					"value": data.name
				}, {
					"name": "ds_l1_ref",
					"value": "@look/" + data.id,
				}]
			},
			success: function(result) {
				var id = result.value;
				upDataVersion(function() {
					success(id);
				})
			}
		});
	};
	var addAddressSubThird = function(data, success) {
		Api.POST({
			url: "/crm/Entities",
			data: {
				"name": "ds_address_l3",
				"attributes": [{
					"name": "ds_name",
					"value": data.name
				}, {
					"name": "ds_l2_ref",
					"value": "@look/" + data.id,
				}]
			},
			success: function(result) {
				var id = result.value;
				upDataVersion(function() {
					success(id);
				})
			}
		});
	};
	var addAddressSubFourth = function(data, success) {
		Api.POST({
			url: "/crm/Entities",
			data: {
				"name": "ds_address_l4",
				"attributes": [{
					"name": "ds_name",
					"value": data.name
				}, {
					"name": "ds_l3_ref",
					"value": "@look/" + data.id,
				}]
			},
			success: function(result) {
				var id = result.value;
				upDataVersion(function() {
					success(id);
				})
			}
		});
	};

	return {
		get: getAddressVersion,
		last: getLastAddress,
		getaddress:getAddress,
		addAddressSubSecond: addAddressSubSecond, // 创建地址树第二级
		addAddressSubThird: addAddressSubThird, // 创建地址树第三级
		addAddressSubFourth: addAddressSubFourth, //  创建地址树第四级
	}
});