services.factory('sendServers', function(Api, $resource, user) {
	var peoId = user.getUserMessage().userModel.crmGuid;
	return {

		searchs: function(item, success) {
			var resource = $resource('/api/Crm/GetRecipientsInfo', {});

			return resource.save({
				"text": item
			}, function(result) {
				/*console.log(result);*/
				var resultValue = result.resultObj.recipientsInfo;
				success(resultValue);
			}, function(result) {
				$rootScope.$broadcast('network.error');
			});
		},
		alertTips: function(str) {
			Api.popUp.alert(str);
		},
		//发给警员
		sendMessage1: function(cont, idd, success) {
			/*console.log(cont, idd);*/
			Api.request.post({
				url: "/crm/Entities",
				data: {
					"name": "ds_message",

					"attributes": [{
						"name": "ds_content",
						"value": (cont ? cont : '')
					}, {
						"name": "ds_isread",
						"value": "@b/False"
					}, {
						"name": "ds_message_type",
						"value": "@code/100000002"
					}, {
						"name": "ds_receive_all",
						"value": "@b/False"
					}, {
						"name": "ds_sendid_police",
						"value": "@look/" + peoId
					}, {
						"name": "ds_receiveid_police",
						"value": "@look/" + idd
					}]

				},
				success: function(data) {
					/*console.log('success1');*/
					if (success) {
						success();
					}
				},
			});
		},
		//发给行业场所
		sendMessage2: function(cont, idd, success) {
			/*console.log(cont, idd);*/
			Api.request.post({
				url: "/crm/Entities",
				data: {
					"name": "ds_message",
					"attributes": [{
						"name": "ds_content",
						"value": (cont ? cont : '')
					}, {
						"name": "ds_isread",
						"value": "@b/False"
					}, {
						"name": "ds_message_type",
						"value": "@code/100000002"
					}, {
						"name": "ds_receive_all",
						"value": "@b/False"
					}, {
						"name": "ds_sendid_police",
						"value": "@look/" + peoId
					}, {
						"name": "ds_receiveid_publicorder",
						"value": "@look/" + idd
					}]
				},
				success: function(data) {
					/*console.log('success2');*/
					if (success) {
						success();
					}
				},
			});
		},
		//群发
		sendMessage3: function(cont, idd, success) {
			/*console.log(cont, idd);*/
			Api.request.post({
				url: "/crm/Entities",
				data: {
					"name": "ds_message",
					"attributes": [{
						"name": "ds_content",
						"value": (cont ? cont : '')
					}, {
						"name": "ds_isread",
						"value": "@b/False"
					}, {
						"name": "ds_message_type",
						"value": "@code/100000002"
					}, {
						"name": "ds_receive_all",
						"value": "@b/True"
					}, {
						"name": "ds_sendid_police",
						"value": "@look/" + peoId
					}, {
						"name": "ds_batchreceiver",
						"value": "@code/" + idd
					}]

				},
				success: function(data) {
					/*console.log('success');*/
					if (success) {
						success();
					}
				},
			});
		},


	}
});