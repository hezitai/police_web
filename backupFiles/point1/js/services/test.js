services.factory('test', function(Api) {

	var str1 = '';


	
	return {
		get : function () {
			return str1
		},
		set : function (data,success) {
			str1 = data;
			success(str1);
		}
	}
});