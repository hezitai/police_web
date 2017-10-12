services.factory('carservers', function(Api) {
	return {
		getCarnum: function(cardNum, success) {
			console.log(cardNum);
			Api.request.get({
				url: "/crm/Entities?$expand=attributes( $filter=name eq 'ds_number'  or name eq 'ds_information' or name eq 'ds_person-ds_name' or name eq 'ds_person-ds_personid' or name eq 'ds_person-ds_id'),lookups&$filter=name eq 'ds_vehicle' and query eq '{{ds_number like %"+cardNum+"%} or {ds_information like %"+cardNum+"%}}' and page eq 1 and count eq 10 and orderby eq 'createdon/desc'",
				success: function(result) {
					console.log(result);
					var resultValue = Api.formatting.CRMList(result.value);
					if (resultValue.length == 0) {
						Api.popUp.alert('未找到相应信息');
					} else {
						success(resultValue);
					}
				}
			});
		},
		
		alertTips:function(str){
			Api.popUp.alert(str);
		},
	}
});