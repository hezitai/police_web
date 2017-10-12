services.factory('place', function(Api) {
	var documentNames = {
		ds_entertainmentId: {
			name: '公共娱乐场所基本情况登记表',
			value: 'null',
			id: 'ds_entertainmentId',
			type: 'recreation',
		},
		fireSafetyStubId: {
			name: '消防安全检查合格证或消防安全检查意见书',
			value: '100000006',
			id: 'fireSafetyStubId',
			type: 'image'
		},
		businessLicenseStubId: {
			name: '工商营业执照副本或法人证书（复印件）',
			value: '100000005',
			id: 'businessLicenseStubId',
			type: 'image'
		},
		taxLicenseStubId: {
			name: '税务登记证副本（复印件）',
			value: '100000008',
			id: 'taxLicenseStubId',
			type: 'image'
		},
		specialLicenseStubId: {
			name: '特种行业许可证正、副本（复印件）',
			value: '100000007',
			id: 'specialLicenseStubId',
			type: 'image'
		},
		otherAgenciesStubId: {
			name: '其他行政机关出具的相关证照、报告、资格证书（复印件）',
			value: '100000001',
			id: 'otherAgenciesStubId',
			type: 'image'
		},
		ds_cameraId: {
			name: '视频监控系统应用书',
			value: 'null',
			id: 'ds_cameraId',
			type: 'videocamera',
		},
		ds_publicdiagramId: {
			name: '经营单位平面图',
			value: 'null',
			id: 'ds_publicdiagramId',
			type: 'floorPlans',
		},
		ownerDetailId: {
			name: '法人代表基本情况登记表',
			value: 'null',
			id: 'ownerDetailId',
			type: 'owner',
		},
		securityDetailId: {
			name: '治安保卫负责人基本情况登记表',
			value: 'null',
			id: 'securityDetailId',
			type: 'security',
		},
		otherPersonId: {
			name: '其他从业人员基本情况登记表',
			value: 'null',
			id: 'otherPersonId',
			type: 'otherpeople',
		},
		publicSecurityStubId: {
			name: '行业场所安全管理责任制',
			value: '100000010',
			id: 'publicSecurityStubId',
			type: 'image',
		},
		publicOwnerStubId: {
			name: '行业场所从业单位法定代表人（负责人）治安安全管理责任书',
			value: '100000009',
			id: 'publicOwnerStubId',
			type: 'doc',
		},
		accidentPlanStubId: {
			name: '事故应急预案',
			value: '100000000',
			id: 'accidentPlanStubId',
			type: 'doc',
		},
		securityDetailStubId: {
			name: '安全防范措施制订情况',
			value: '100000004',
			id: 'securityDetailStubId',
			type: 'doc',
		},
		governmentStubId: {
			name: '各级政府主管部门安全检查记录',
			value: '100000002',
			id: 'governmentStubId',
			type: 'image',
		},
		selfCheckStubId: {
			name: '场所安全隐患自查、整改方面的记录',
			value: '100000003',
			id: 'selfCheckStubId',
			type: 'doc',
		},
		fireControlStubId: {
			name: '消防档案',
			value: '100000011',
			id: 'fireControlStubId',
			type: 'doc',
		},
	};
	return {
		getPlaceList: function(id, success) {
			Api.request.get({
				url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_latitude' or name eq 'ds_buildingaddress'  or name eq 'ds_longitude' or name eq 'ds_address' or name eq 'ds_name' or name eq 'ds_phone'  or name eq 'ds_publicorderid')&$filter=name eq 'ds_publicorder' and  query eq 'ds_charger eq " + id + "' and page eq 1 and count eq 10 and orderby eq 'createdon/desc'",
				success: function(result) {
					var resultValue = Api.formatting.CRMList(result.value);
					if (resultValue.length == 0) {
						Api.popUp.alert('未找到行业场所信息');
					} else {
						success(resultValue);
					}
				}
			});
		},
		getPlaceDetail: function(id, success) {
			Api.request.get({
				url: "/crm/Entities?$expand=attributes( $filter=name eq 'ds_inspectiondate'  or name eq 'ds_buildingaddress'   or name eq 'ds_owner_ref'   or name eq 'ds_address'  or name eq 'ds_securityissue'   or name eq 'ds_securityissue_result'   or name eq 'ds_fund'   or name eq 'ds_businesskind'   or name eq 'ds_name'   or name eq 'ds_employeenum'   or name eq 'ds_asset'   or name eq 'ds_publicorderid'   or name eq 'ds_securityowner_ref'   or name eq 'ds_owner_ref-ds_gender'   or name eq 'ds_owner_ref-ds_address'   or name eq 'ds_owner_ref-ds_personid'   or name eq 'ds_owner_ref-ds_education'   or name eq 'ds_owner_ref-ds_id'   or name eq 'ds_owner_ref-ds_phone'   or name eq 'ds_owner_ref-ds_name'  or name eq 'ds_longitude'  or name eq 'ds_latitude'   or name eq 'ds_securityowner_ref-ds_gender'   or name eq 'ds_securityowner_ref-ds_address'   or name eq 'ds_securityowner_ref-ds_personid'   or name eq 'ds_securityowner_ref-ds_education'   or name eq 'ds_securityowner_ref-ds_id'   or name eq 'ds_securityowner_ref-ds_phone'   or name eq 'ds_securityowner_ref-ds_phone2'  or name eq 'ds_securityowner_ref-ds_name'),lookups&$filter=name eq 'ds_publicorder'  and query eq 'ds_publicorderid eq " + id + "'",
				success: function(result) {
					var resultValue = Api.formatting.CRMValue(result.value);
					if (resultValue.length == 0) {
						Api.popUp.alert('未找到行业场所信息');
					} else {
						success(resultValue);
					}
				}
			});
		},
		getPlaceDocument: function(id, success) {
			Api.request.post({
				url: "/api/Crm/GetPublicOrderInfo",
				data: {
					"ds_publicorderId": id,
				},
				success: function(result) {
					if (result.status == 0) {
						success(result.resultObj);
					} else {
						Api.popUp.alert(result.message);
					}
				}
			});
		},
		getDocumentNames: function() {
			return documentNames;
		},
		getPlaceDocumentByID: function(id, success) {
			Api.request.post({
				url: "/api/Place/GetStub",
				data: {
					"id": id,
				},
				success: function(result) {
					success(result);
				},
			});
		},
		getPlaceDocumentByCrmID: function(id, success) {
			Api.request.get({
				url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_stub')&$filter=name eq 'ds_publicorderdoc_item' and query eq 'ds_publicorderdoc_itemid eq " + id + "'",
				success: function(result) {
					var resultValue = Api.formatting.CRMValue(result.value);
					if (resultValue.length == 0) {
						Api.popUp.alert('未找到附件信息');
					} else {
						success(resultValue);
					}
				}
			});
		},
		deleteDocument: function(subId, crmId, success) {
			Api.request.post({
				url: "/api/Place/DeleteStub",
				data: {
					id: subId,
				},
				success: function(result) {
					if (result.status == 0) {
						Api.request.deleteAjax({
							url: "/crm/Entities('ds_publicorderdoc_item" + crmId + "')",
							success: function() {
								success();
							},
							error: function() {
								error();
							},
						})
					} else {
						Api.popUp.alert('删除附件失败,请重试');
						error();
					}
				},
			});
		},
		updataDocument: function(data, success) {
			if (data.fileType == '.doc') {
				data.src = data.src.replace(/data:application\/msword\;base64\,/g, "").replace(/data:application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document\;base64\,/g, "");
			} else {
				data.src = data.src.replace(/data:image\/jpeg\;base64\,/g, "").replace(/data:image\/png;base64\,/g, "");
			}
			Api.request.post({
				url: '/api/User/CreatePlaceStub',
				data: {
					"fileType": data.fileType,
					"fileName": data.fileName,
					"tempFileStream": data.src,
				},
				success: function(result) {
					if (result.status == 1) {
						Api.popUp.alert(result.message);
					} else {
						if (data.type == 'Creat') {
							Api.request.post({
								url: '/crm/Entities',
								data: {
									"name": "ds_publicorderdoc_item",
									"attributes": [{
										"name": "ds_publicorderdoc_kind",
										"value": "@code/" + data.kind,
									}, {
										"name": "ds_stub",
										"value": result.resultObj.id
									}, {
										"name": "ds_publicorder",
										"value": "@look/" + data.id
									}]
								},
								success: function() {
									Api.request.post({
										url: "/api/Place/GetStub",
										data: {
											"id": result.resultObj.id,
										},
										success: function(result) {
											success(result.resultObj.fileTempPath);
										},
									});
								}
							});
						} else {
							Api.request.updata({
								url: "/crm/Entities('ds_publicorderdoc_item" + data.crmId + "')",
								data: {
									"attributes": [{
										"name": "ds_publicorderdoc_kind",
										"value": "@code/" + data.kind,
									}, {
										"name": "ds_stub",
										"value": result.resultObj.id
									}]
								},
								success: function() {
									Api.request.post({
										url: "/api/Place/GetStub",
										data: {
											"id": result.resultObj.id,
										},
										success: function(result) {
											success(result.resultObj.fileTempPath);
										},
									});
								}
							});
						}
					}
				}
			});
		},
		getRecreation: function(id, success) {
			Api.request.get({
				url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_address' or name eq 'ds_alarmsign' or name eq 'ds_area' or name eq 'ds_filetypeofplaces' or name eq 'ds_billiardcount' or name eq 'ds_businesskind' or name eq 'ds_businessoperation_kind' or name eq 'ds_businessrunner-ds_name' or name eq 'ds_cctv' or name eq 'ds_class' or name eq 'ds_customer_quota' or name eq 'ds_dancearea' or name eq 'ds_doorwindow_trans' or name eq 'ds_emergencylight' or name eq 'ds_employeelist' or name eq 'ds_employeenum' or name eq 'ds_entertainmentid' or name eq 'ds_fireidentified' or name eq 'ds_fireidentified_dt' or name eq 'ds_gamecount' or name eq 'ds_guidelight' or name eq 'ds_innerlock' or name eq 'ds_majorbusiness' or name eq 'ds_minorbusiness' or name eq 'ds_name' or name eq 'ds_operationlog' or name eq 'ds_others' or name eq 'ds_phone' or name eq 'ds_placeidentified' or name eq 'ds_placeidentified_dt' or name eq 'ds_publicorder_ref' or name eq 'ds_roomcount' or name eq 'ds_safe_equipment' or name eq 'ds_safedoor' or name eq 'ds_safeguard_count' or name eq 'ds_safepass' or name eq 'ds_startdt'),lookups&$filter=name eq 'ds_entertainment'  and query eq 'ds_publicorder_ref eq " + id + "'",
				success: function(result) {
					if (result.value.length == 0) {
						Api.popUp.alert('未找到相关信息');
					} else {
						var resultValue = Api.formatting.CRMValue(result.value);
						success(resultValue);
					};
				}
			});
		},
		getVideocamera: function(id, success) {
			Api.request.get({
				url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_cameraid' or name eq 'ds_count' or name eq 'ds_daycount' or name eq 'ds_disksize' or name eq 'ds_name' or name eq 'ds_publicorder_ref' or name eq 'ds_resolution'),lookups&$filter=name eq 'ds_camera'  and query eq 'ds_publicorder_ref eq " + id + "'",
				success: function(result) {
					if (result.value.length == 0) {
						Api.popUp.alert('未找到相关信息');
					} else {
						var resultValue = Api.formatting.CRMValue(result.value);
						success(resultValue);
					};
				}
			});
		},
		getFloorPlansList: function(id, success) {
			Api.request.get({
				url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_area' or name eq 'ds_floor' or name eq 'ds_picture' or name eq 'ds_publicdiagramid'),lookups&$filter=name eq 'ds_publicdiagram'  and query eq 'ds_publicorder_ref eq " + id + "'",
				success: function(result) {
					if (result.value.length == 0) {
						Api.popUp.alert('未找到相关信息');
					} else {
						var resultValue = Api.formatting.CRMList(result.value);
						success(resultValue);
					};
				},
			});
		},
		getOwnerMessage: function(id, success) {
			Api.request.get({
				url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_owner_position'  or name eq 'ds_owner_ref' or name eq 'ds_owner_ref-ds_address' or name eq 'ds_owner_ref-ds_birth' or name eq 'ds_owner_ref-ds_education' or name eq 'ds_owner_ref-ds_gender' or name eq 'ds_owner_ref-ds_id' or name eq 'ds_owner_ref-ds_idaheadpic' or name eq 'ds_owner_ref-ds_idbackpic' or name eq 'ds_owner_ref-ds_name' or name eq 'ds_owner_ref-ds_nation' or name eq 'ds_owner_ref-ds_personid' or name eq 'ds_owner_ref-ds_phone' or name eq 'ds_owner_ref-ds_phone2' or name eq 'ds_owner_ref-ds_politics'),lookups&$filter=name eq 'ds_publicorder'  and query eq 'ds_publicorderid eq " + id + "'",
				success: function(result) {
					if (result.value.length == 0) {
						Api.popUp.alert('未找到相关信息');
					} else {
						var resultValue = Api.formatting.CRMValue(result.value);
						success(resultValue);
					};
				}
			});
		},
		getPeopleBackground: function(id, success) {
			Api.request.get({
				url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_personbackgroundid' or name eq 'ds_begin' or name eq 'ds_end' or name eq 'ds_location' or name eq 'ds_name' or name eq 'ds_person_ref-ds_name'),lookups&$filter=name eq 'ds_personbackground'  and query eq 'ds_person_ref eq " + id + "'",
				success: function(result) {
					if (result.value.length == 0) {
						success([]);
					} else {
						var resultValue = Api.formatting.CRMList(result.value);
						success(resultValue);
					};
				}
			});
		},
		getSecurityMessage: function(id, success) {
			Api.request.get({
				url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_publicowner_position'  or name eq 'ds_securityowner' or name eq 'ds_securityowner_ref-ds_address' or name eq 'ds_securityowner_ref-ds_birth' or name eq 'ds_securityowner_ref-ds_education' or name eq 'ds_securityowner_ref-ds_gender' or name eq 'ds_securityowner_ref-ds_id' or name eq 'ds_securityowner_ref-ds_idaheadpic' or name eq 'ds_securityowner_ref-ds_idbackpic' or name eq 'ds_securityowner_ref-ds_name' or name eq 'ds_securityowner_ref-ds_nation' or name eq 'ds_securityowner_ref-ds_personid' or name eq 'ds_securityowner_ref-ds_phone' or name eq 'ds_securityowner_ref-ds_phone2' or name eq 'ds_securityowner_ref-ds_politics'),lookups&$filter=name eq 'ds_publicorder'  and query eq 'ds_publicorderid eq " + id + "'",
				success: function(result) {
					if (result.value.length == 0) {
						Api.popUp.alert('未找到相关信息');
					} else {
						var resultValue = Api.formatting.CRMValue(result.value);
						success(resultValue);
					};
				}
			});
		},
		getOtherPeopleMessage: function(id, success) {
			Api.request.get({
				url: "/crm/Entities?$expand=attributes( $filter=name eq 'ds_employee-ds_name' or name eq 'ds_employee-ds_personid'  or name eq 'ds_publicorder_employeeid' ),lookups&$filter=name eq 'ds_publicorder_employee' and  query eq 'ds_publicorder_ref eq " + id + "'",
				success: function(result) {
					if (result.value.length == 0) {
						success([]);
					} else {
						var resultValue = Api.formatting.CRMList(result.value);
						success(resultValue);
					};
				}
			});
		},
		getPeopleByEmployeeId: function(id, success) {
			Api.request.get({
				url: "/crm/Entities?$expand=attributes( $filter=name eq 'ds_employee-ds_name' or name eq 'ds_employee-ds_id' or name eq 'ds_position'  or name eq 'ds_employee-ds_id'  or name eq 'ds_employee-ds_phone' or name eq 'ds_employee-ds_address'  or name eq 'ds_employee-ds_idaheadpic'  or name eq 'ds_employee-ds_personid'),lookups&$filter=name eq 'ds_publicorder_employee' and  query eq 'ds_publicorder_employeeid eq " + id + "'",
				success: function(result) {
					if (result.value.length == 0) {
						Api.popUp.alert('未找到相关信息');
					} else {
						var resultValue = Api.formatting.CRMValue(result.value);
						success(resultValue);
					};
				}
			});
		},
		getPeopleByIdCardNumberForCheckRold: function(data, success) {
			Api.result.get({
				url: "/crm/Entities?$expand=attributes($select=name,value)&$filter=name eq 'ds_person'  and query eq 'ds_id eq " + data.id + "'",
				success: function(result) {
					if (result.value.length == 0) {
						Api.result.post({
							url: '/crm/Entities',
							data: {
								"name": "ds_person",
								"attributes": [{
									"name": "ds_name",
									"value": data.name
								}, {
									"name": "ds_id",
									"value": data.id,
								}, {
									"name": "ds_phone",
									"value": data.phone,
								}]
							},
							success: function(resultCreat) {
								success(resultCreat.value);
							}
						});
					} else {
						Api.result.updata({
							url: "/crm/Entities('ds_person" + result.value[0].id + "')",
							data: {
								"attributes": [{
									"name": "ds_name",
									"value": data.name
								}, {
									"name": "ds_phone",
									"value": data.phone,
								}]
							},
							success: function(resultUpdata) {
								success(result.value[0].id);
							}
						});
					}
				},
			});
		},
		checkRold: {
			// 赌博
			gambling: function(id, success) {
				
			},
			// 卖淫
			prostitution: function(id, success) {
				
			},
			// 盗窃
			theft: function(id, success) {
				
			},
			// 吸毒
			DrugUse: function(id, success) {
				
			},
			// 从业人员检查
			employed: function(id, success) {
				
			},
			// 闹事,殴打
			beating: function(id, success) {
				
			},
			// 消防检查项
			fire : function (id, success) {
				
			},
			// 其他情况
			other : function (id, success) {
				
			}
		}
	}
});
services.factory('optionSites', function(Api) {
	function formatOptionSite(value) {
		var options = value.options;
		var data = [];
		for (var i = 0; i < options.length; i++) {
			var item = {};
			item.name = options[i].split(':')[1];
			item.value = options[i].split(':')[0];
			data.push(item);
		}
		return data;
	};
	var businesskind = [],
		politics = [],
		rentedhouseDocument = [],
		liveway = [],
		gapcsrcxfjdjcjlXfss1 = [],
		gapcsrcxfjdjcjlXfss3 = [],
		gender = [],
		education = [],
		type = [],
		publicorderdocKind = [],
		nation = [],
		publicExam = [],
		messageType = [],
		xfaqglXfaqzd = [],
		gapcsrcxfjdjcjlCmwyhlxxfaqzzqk2 = [],
		firefightExam = [],
		gapcsrcxfjdjcjlJzfh1 = [],
		gapcsrcxfjdjcjlbXfaqgl4 = [],
		apcsrcxfjdjcjlXfss2 = [],
		gapcsrcxfjdjcjlJzfh4 = [],
		gapcsrcxfjdjcjlJzfh2 = [],
		businessoperationKind = [],
		batchreceiver = [],
		inspectitem = [],
		gapcsrcxfjdjcjlbWfxw = [],
		gapcsrcxfjdjcjlJzfh3 = [];
	return {
		businesskind: function(success) {
			// 行业场所类别;
			if (businesskind.length == 0) {
				Api.request.get({
					url: "/crm/OptionSets('ds_businesskind')",
					success: function(result) {
						businesskind = formatOptionSite(result);
						success(businesskind);
					}
				});
			} else {
				success(businesskind);
			}
		},
		politics: function(success) {
			// 政治面貌;
			if (politics.length == 0) {
				Api.request.get({
					url: "/crm/OptionSets('ds_politics')",
					success: function(result) {
						politics = formatOptionSite(result);
						success(politics);
					}
				});
			} else {
				success(politics);
			}
		},
		rentedhouseDocument: function(success) {
			// 出租房屋档案项;
			if (rentedhouseDocument.length == 0) {
				Api.request.get({
					url: "/crm/OptionSets('ds_rentedhouse_document')",
					success: function(result) {
						rentedhouseDocument = formatOptionSite(result);
						success(rentedhouseDocument);
					}
				});
			} else {
				success(rentedhouseDocument);
			}
		},
		liveway: function(success) {
			// 获取居住方式;
			if (liveway.length == 0) {
				Api.request.get({
					url: "/crm/OptionSets('ds_liveway')",
					success: function(result) {
						liveway = formatOptionSite(result);
						success(liveway);
					}
				});
			} else {
				success(liveway);
			}
		},
		gapcsrcxfjdjcjlXfss1: function(success) {
			// 获取室内消防栓情况;
			if (gapcsrcxfjdjcjlXfss1.length == 0) {
				Api.request.get({
					url: "/crm/OptionSets('ds_gapcsrcxfjdjcjl_xfss1')",
					success: function(result) {
						gapcsrcxfjdjcjlXfss1 = formatOptionSite(result);
						success(gapcsrcxfjdjcjlXfss1);
					}
				});
			} else {
				success(gapcsrcxfjdjcjlXfss1);
			}
		},
		gapcsrcxfjdjcjlXfss3: function(success) {
			// 获取建筑消防设施情况;
			if (gapcsrcxfjdjcjlXfss3.length == 0) {
				Api.request.get({
					url: "/crm/OptionSets('ds_gapcsrcxfjdjcjl_xfss3')",
					success: function(result) {
						gapcsrcxfjdjcjlXfss3 = formatOptionSite(result);
						success(gapcsrcxfjdjcjlXfss3);
					}
				});
			} else {
				success(gapcsrcxfjdjcjlXfss3);
			}
		},
		gender: function(success) {
			// 获取性别;
			if (gender.length == 0) {
				Api.request.get({
					url: "/crm/OptionSets('ds_gender')",
					success: function(result) {
						gender = formatOptionSite(result);
						success(gender);
					}
				});
			} else {
				success(gender);
			}
		},
		education: function(success) {
			// 获取文化程度;
			if (education.length == 0) {
				Api.request.get({
					url: "/crm/OptionSets('ds_education')",
					success: function(result) {
						education = formatOptionSite(result);
						success(education);
					}
				});
			} else {
				success(education);
			}
		},
		type: function(success) {
			// 获取按键类型;
			if (type.length == 0) {
				Api.request.get({
					url: "/crm/OptionSets('ds_type')",
					success: function(result) {
						type = formatOptionSite(result);
						success(type);
					}
				});
			} else {
				success(type);
			}
		},
		publicorderdocKind: function(success) {
			// 获取获取档案类型;
			if (publicorderdocKind.length == 0) {
				Api.request.get({
					url: "/crm/OptionSets('ds_publicorderdoc_kind')",
					success: function(result) {
						publicorderdocKind = formatOptionSite(result);
						success(publicorderdocKind);
					}
				});
			} else {
				success(publicorderdocKind);
			}
		},
		nation: function(success) {
			// 获取民族;
			if (nation.length == 0) {
				Api.request.get({
					url: "/crm/OptionSets('ds_nation')",
					success: function(result) {
						nation = formatOptionSite(result);
						success(nation);
					}
				});
			} else {
				success(nation);
			}
		},
		publicExam: function(success) {
			// 获取民族;
			if (publicExam.length == 0) {
				Api.request.get({
					url: "/crm/OptionSets('ds_public_exam')",
					success: function(result) {
						publicExam = formatOptionSite(result);
						success(publicExam);
					}
				});
			} else {
				success(publicExam);
			}
		},
		messageType: function(success) {
			// 获取消息类型;
			if (messageType.length == 0) {
				Api.request.get({
					url: "/crm/OptionSets('ds_message_type')",
					success: function(result) {
						messageType = formatOptionSite(result);
						success(messageType);
					}
				});
			} else {
				success(messageType);
			}
		},
		xfaqglXfaqzd: function(success) {
			// 获取消防安全责任制;
			if (xfaqglXfaqzd.length == 0) {
				Api.request.get({
					url: "/crm/OptionSets('ds_xfaqgl_xfaqzd')",
					success: function(result) {
						xfaqglXfaqzd = formatOptionSite(result);
						success(xfaqglXfaqzd);
					}
				});
			} else {
				success(xfaqglXfaqzd);
			}
		},
		gapcsrcxfjdjcjlCmwyhlxxfaqzzqk2: function(success) {
			// 获取消防安全工作制度、防火安全公约情况;
			if (gapcsrcxfjdjcjlCmwyhlxxfaqzzqk2.length == 0) {
				Api.request.get({
					url: "/crm/OptionSets('ds_gapcsrcxfjdjcjl_cmwyhlxxfaqzzqk2')",
					success: function(result) {
						gapcsrcxfjdjcjlCmwyhlxxfaqzzqk2 = formatOptionSite(result);
						success(gapcsrcxfjdjcjlCmwyhlxxfaqzzqk2);
					}
				});
			} else {
				success(gapcsrcxfjdjcjlCmwyhlxxfaqzzqk2);
			}
		},
		firefightExam: function(success) {
			// 获取消防检查项类型;
			if (firefightExam.length == 0) {
				Api.request.get({
					url: "/crm/OptionSets('ds_firefight_exam')",
					success: function(result) {
						firefightExam = formatOptionSite(result);
						success(firefightExam);
					}
				});
			} else {
				success(firefightExam);
			}
		},
		gapcsrcxfjdjcjlJzfh1: function(success) {
			// 获取获取消防车通道类型;
			if (gapcsrcxfjdjcjlJzfh1.length == 0) {
				Api.request.get({
					url: "/crm/OptionSets('ds_gapcsrcxfjdjcjl_jzfh1')",
					success: function(result) {
						gapcsrcxfjdjcjlJzfh1 = formatOptionSite(result);
						success(gapcsrcxfjdjcjlJzfh1);
					}
				});
			} else {
				success(gapcsrcxfjdjcjlJzfh1);
			}
		},
		gapcsrcxfjdjcjlJzfh1: function(success) {
			// 获取获取消防车通道类型;
			if (gapcsrcxfjdjcjlJzfh1.length == 0) {
				Api.request.get({
					url: "/crm/OptionSets('ds_gapcsrcxfjdjcjl_jzfh1')",
					success: function(result) {
						gapcsrcxfjdjcjlJzfh1 = formatOptionSite(result);
						success(gapcsrcxfjdjcjlJzfh1);
					}
				});
			} else {
				success(gapcsrcxfjdjcjlJzfh1);
			}
		},
		gapcsrcxfjdjcjlbXfaqgl4: function(success) {
			// 获取灭火和应急疏散预案;
			if (gapcsrcxfjdjcjlbXfaqgl4.length == 0) {
				Api.request.get({
					url: "/crm/OptionSets('ds_gapcsrcxfjdjcjlb_xfaqgl4')",
					success: function(result) {
						gapcsrcxfjdjcjlbXfaqgl4 = formatOptionSite(result);
						success(gapcsrcxfjdjcjlbXfaqgl4);
					}
				});
			} else {
				success(gapcsrcxfjdjcjlbXfaqgl4);
			}
		},
		apcsrcxfjdjcjlXfss2: function(success) {
			// 获取灭火器情况;
			if (apcsrcxfjdjcjlXfss2.length == 0) {
				Api.request.get({
					url: "/crm/OptionSets('ds_gapcsrcxfjdjcjl_xfss2')",
					success: function(result) {
						apcsrcxfjdjcjlXfss2 = formatOptionSite(result);
						success(apcsrcxfjdjcjlXfss2);
					}
				});
			} else {
				success(apcsrcxfjdjcjlXfss2);
			}
		},
		gapcsrcxfjdjcjlJzfh4: function(success) {
			// 获取疏散指示标志,应急照明情况;
			if (gapcsrcxfjdjcjlJzfh4.length == 0) {
				Api.request.get({
					url: "/crm/OptionSets('ds_gapcsrcxfjdjcjl_jzfh4')",
					success: function(result) {
						gapcsrcxfjdjcjlJzfh4 = formatOptionSite(result);
						success(gapcsrcxfjdjcjlJzfh4);
					}
				});
			} else {
				success(gapcsrcxfjdjcjlJzfh4);
			}
		},
		gapcsrcxfjdjcjlJzfh2: function(success) {
			// 获取疏散通道,安全出口情况;
			if (gapcsrcxfjdjcjlJzfh2.length == 0) {
				Api.request.get({
					url: "/crm/OptionSets('ds_gapcsrcxfjdjcjl_jzfh2')",
					success: function(result) {
						gapcsrcxfjdjcjlJzfh2 = formatOptionSite(result);
						success(gapcsrcxfjdjcjlJzfh2);
					}
				});
			} else {
				success(gapcsrcxfjdjcjlJzfh2);
			}
		},
		businessoperationKind: function(success) {
			// 获取经济性质;
			if (businessoperationKind.length == 0) {
				Api.request.get({
					url: "/crm/OptionSets('ds_businessoperation_kind')",
					success: function(result) {
						businessoperationKind = formatOptionSite(result);
						success(businessoperationKind);
					}
				});
			} else {
				success(businessoperationKind);
			}
		},
		batchreceiver: function(success) {
			// 获取群发接受方;
			if (batchreceiver.length == 0) {
				Api.request.get({
					url: "/crm/OptionSets('ds_batchreceiver')",
					success: function(result) {
						batchreceiver = formatOptionSite(result);
						success(batchreceiver);
					}
				});
			} else {
				success(batchreceiver);
			}
		},
		inspectitem: function(success) {
			// 获取行业场所治安安全检查记录表中检查要求类型;
			if (inspectitem.length == 0) {
				Api.request.get({
					url: "/crm/OptionSets('ds__inspectitem')",
					success: function(result) {
						inspectitem = formatOptionSite(result);
						success(inspectitem);
					}
				});
			} else {
				success(inspectitem);
			}
		},
		gapcsrcxfjdjcjlbWfxw: function(success) {
			// 获取违法行为分类;
			if (gapcsrcxfjdjcjlbWfxw.length == 0) {
				Api.request.get({
					url: "/crm/OptionSets('ds_gapcsrcxfjdjcjlb_wfxw')",
					success: function(result) {
						gapcsrcxfjdjcjlbWfxw = formatOptionSite(result);
						success(gapcsrcxfjdjcjlbWfxw);
					}
				});
			} else {
				success(gapcsrcxfjdjcjlbWfxw);
			}
		},
		gapcsrcxfjdjcjlJzfh3: function(success) {
			// 获取防火门情况;
			if (gapcsrcxfjdjcjlJzfh3.length == 0) {
				Api.request.get({
					url: "/crm/OptionSets('ds_gapcsrcxfjdjcjl_jzfh3')",
					success: function(result) {
						gapcsrcxfjdjcjlJzfh3 = formatOptionSite(result);
						success(gapcsrcxfjdjcjlJzfh3);
					}
				});
			} else {
				success(gapcsrcxfjdjcjlJzfh3);
			}
		},
	}
});