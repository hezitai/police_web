services.factory('quickSearchServers', function(Api) {
	return {

		getPeopleList: function(idcardNum, success) {
			console.log(idcardNum);
			Api.request.get({
				url: "/crm/Entities?$expand=attributes( $filter=name eq 'ds_personid' or name eq 'ds_name' or name eq 'ds_livestatus' or name eq 'ds_id' )&$filter=name eq 'ds_person' and query eq '{{ds_name like %"+idcardNum+"%} or {ds_id eq "+idcardNum+"}}' and page eq 1 and count eq 10 and orderby eq 'createdon/desc'",
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

		
	}
});