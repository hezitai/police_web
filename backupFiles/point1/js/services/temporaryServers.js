services.factory('temporaryServers', function(Api) {
	return {

		getPeopleList: function(idcardNum, success) {
			/*console.log(idcardNum);*/
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

		

		alertTips: function(str) {
			Api.popUp.alert(str);
		},
		getAge: function(id) {
			var date1 = "";
			if (id.length == 15) {
				date1 = "19"+id.substr(6, 2);
				/*console.log(date1);*/
			} else if (id.length == 18) {
				date1 = id.substr(6, 4);
				/*console.log(date1);*/
			};
			var date2 =  new Date().getFullYear();    
			return date2-date1;	

		},
		getSex: function(id) {
			var sexnum = '';
			if (id.length == 15) {
				sexnum = id.substr(13, 1);
			} else if (id.length == 18) {
				sexnum = id.substr(16, 1);
			};
			if (sexnum % 2 == 0) {
				return '女';
			} else {
				return '男';
			}
		},

		getStayStyle: function(id) {
			var mm = id.substr(0, 4)
			var nn = id.substr(0,6);
			var sty = "";
			if (mm == "2201") {
				if(nn == "220125" || nn == "220112"){
					sty = "常住人口";
				}else{
					sty = "寄住人口";
				}
			}else{
				sty = "暂住人口";
			}
			return sty;
		},
		
	}
});