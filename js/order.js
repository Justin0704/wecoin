//判断是否是会员
function isMember(){
	mui.ajax(url + '/isMember',{
		dataType:'json',//服务器返回json格式数据
		type:'get',//HTTP请求类型
		headers:{'Content-Type':'application/json'},
		crossDomain:true,
		success:function(data){
			//服务器返回响应，根据响应结果，分析是否登录成功；
			console.log("------------->data = " + data);
			console.log("------------->data.resultCode = " + data.resultCode);
			console.log("------------->data.resultMsg = " + data.resultMsg);
			console.log("------------->data.isMember = " + data.isMember);
			if(data.resultCode == '1001'){
				if(data.isMember == '1'){
					document.getElementById("sellOutBtn").disabled = '';
				}
			}else if(data.resultCode == '4001'){
				mui.toast(data.resultMsg);
			}else if(data.resultCode == '1002'){
				mui.toast(data.resultMsg);
				mui.openWindow({url:'tab-webview-main.html',id:'list'});
			}
		},
		error:function(xhr,type,errorThrown){
			//异常处理；
			mui.toast("系统异常！");
			console.log("异常: " + type);
		}
	});
}
//验证交易密码是否正确
function verifyDealPwd(dealpwd,buyerNo,amount,agreementPrice){
	plus.nativeUI.showWaiting('正在验证密码...');
	mui.ajax(url + '/verifyDealpwd',{
		data:{
			"dealpwd": dealpwd
		},
		dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		headers:{'Content-Type':'application/json'},
		crossDomain:true,
		success:function(data){
			//服务器返回响应，根据响应结果，分析是否登录成功；
			console.log("------------->data = " + data);
			console.log("------------->data.resultCode = " + data.resultCode);
			console.log("------------->data.resultMsg = " + data.resultMsg);
			console.log("------------->data.verifyResult = " + data.verifyResult);
			if(data.resultCode == '1001'){
				plus.nativeUI.closeWaiting();
				if(data.verifyResult == 'F'){
					mui.toast("交易密码有误");
				}else{
					sellOut(buyerNo,amount,agreementPrice);
				}
			}else if(data.resultCode == '1002'){//服务器异常
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
			}else if(data.resultCode == '1004'){//会话过期，請重新登錄
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
				mui.openWindow({url:'tab-webview-main.html',id:'list'});
			}
		},
		error:function(xhr,type,errorThrown){
			plus.nativeUI.closeWaiting();
			//异常处理；
			mui.toast("系统异常！");
			console.log("异常: " + type);
		}
	});
}
function sellOut(buyerNo,amount,agreementPrice){
	plus.nativeUI.showWaiting('正在出售...');
	mui.ajax(url + '/sellOut',{
		data:{
			"buyerNo": buyerNo.value,
			"amount": amount.value,
			"agreementPrice": agreementPrice.value
		},
		dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		headers:{'Content-Type':'application/json'},
		crossDomain:true,
		success:function(data){
			//服务器返回响应，根据响应结果，分析是否登录成功；
			console.log("------------->data = " + data);
			console.log("------------->data.resultCode = " + data.resultCode);
			console.log("------------->data.resultMsg = " + data.resultMsg);
			
			if(data.resultCode == '1001'){
				plus.nativeUI.closeWaiting();
				plus.ui.toast("出售成功,请及时查看信箱中订单的状态");
				//清空输入框的内容
				document.getElementById("buyerNo").value = "";
				document.getElementById("amount").value = "";
				document.getElementById("agreementPrice").value = "";
			}else if(data.resultCode == '1004'){//会话过期，請重新登錄
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
				mui.openWindow({url:'tab-webview-main.html',id:'list'});
			}
		},
		error:function(xhr,type,errorThrown){
			plus.nativeUI.closeWaiting();
			//异常处理；
			mui.toast("系统异常！");
			console.log("异常: " + type);
		}
	});
}
function checkUserInfo(buyerNo,amount,agreementPrice){
	plus.nativeUI.showWaiting('正在卖出，请稍后...');
	mui.ajax(url + '/checkUserInfo',{
		data:{
			"userNo": buyerNo.value,
			"availableCount": amount.value
		},
		dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		headers:{'Content-Type':'application/json'},
		crossDomain:true,
		success:function(data){
			//服务器返回响应，根据响应结果，分析是否登录成功；
			console.log("------------->data = " + data);
			console.log("------------->data.resultCode = " + data.resultCode);
			console.log("------------->data.resultMsg = " + data.resultMsg);
			
			if(data.resultCode === '1001'){
				plus.nativeUI.closeWaiting();
				mui.confirm('<input type="password" id="dealpwd" />', '请输入交易密码',null, function(e) {
					if(e.index == 1){
						var dealpwd = document.getElementById('dealpwd').value;
						verifyDealPwd(dealpwd,buyerNo,amount,agreementPrice);
					}
				},'div');
			}else if(data.resultCode === '6002'){//买家不存在
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
			}else if(data.resultCode === '6003'){//买家不能是自己
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
			}else if(data.resultCode === '5002'){//WBT不足
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
			}else if(data.resultCode === '1004'){//会话过期，請重新登錄
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
				mui.openWindow({url:'tab-webview-main.html',id:'list'});
			}
		},
		error:function(xhr,type,errorThrown){
			plus.nativeUI.closeWaiting();
			//异常处理；
			mui.toast("系统异常！");
			console.log("异常: " + type);
		}
	});
}
//显示我的卖出
function showMyOrders(){
	mui.ajax(url + '/myOrders',{
		dataType:'json',//服务器返回json格式数据
		type:'get',//HTTP请求类型
		headers:{'Content-Type':'application/json'},
		crossDomain:true,
		success:function(data){
			//服务器返回响应，根据响应结果，分析是否登录成功；
			console.log("------------->data = " + data);
			console.log("------------->data.resultCode = " + data.resultCode);
			console.log("------------->data.resultMsg = " + data.resultMsg);
			console.log("------------->data.outOrders = " + data.outOrders);
			console.log("------------->data.inOrders = " + data.inOrders);
			
			if(data.resultCode === '1001'){
				var html = '<ul class="mui-table-view">';
				for(var i in data.outOrders){
					console.log("----------->orderStatus = " + data.outOrders[i].orderStatus);
					html += '<li class="mui-table-view-cell">';
					html += '<div class="mui-table">';
					html += '<div class="mui-table-cell mui-col-xs-12">';
					html += '<h5 class="mui-ellipsis">订单号：'+data.outOrders[i].orderNo+'</h5>';
					html += '<h6>'+data.outOrders[i].sellDescription+'</h6>';
					html += '</div>';
					html += '<div class="mui-table-cell mui-col-xs-6 mui-text-right"><span class="mui-h6">'+data.outOrders[i].createTimeStr+'</span></div>';
					html += '</div>';
					html += "<div align='center' class='mui-media-body'>";
					html += "<p class='mui-ellipsis'>";
					html += "<button class='mui-btn mui-btn-outlined mui-btn-yellow mui-icon mui-icon-plus-filled' style='width: 90px;' onclick='showUserInfo("+data.outOrders[i].buyerNo+")' id='showBuyerInfo'>交易账号</button>&nbsp;";
					if(data.outOrders[i].orderStatus === 1){
						//html += "<button class='mui-btn mui-btn-outlined mui-btn-green mui-icon mui-icon-plus-filled' style='width: 90px;' onclick='sellerConfirmOrder("+data.outOrders[i].id+")' id='sellerConfirmOrder'>确认交易</button>&nbsp;";
						html += "<button class='mui-btn mui-btn-outlined mui-btn-red mui-icon mui-icon-plus-filled' style='width: 90px;' onclick='sellerCancelOrder("+data.outOrders[i].id+")' id='sellerCancelOrder_"+data.outOrders[i].id+"'>取消交易</button>&nbsp;";
					}else if(data.outOrders[i].orderStatus === 2){
						html += "<button class='mui-btn mui-btn-outlined mui-btn-green mui-icon mui-icon-plus-filled' style='width: 90px;' onclick='sellerConfirmOrder("+data.outOrders[i].id+")' id='sellerConfirmOrder'>确认交易</button>&nbsp;";
						//html += "<button class='mui-btn mui-btn-outlined mui-btn-red mui-icon mui-icon-plus-filled' style='width: 90px;' onclick='sellerCancelOrder("+data.outOrders[i].id+")' id='sellerCancelOrder_"+data.outOrders[i].id+"'>取消交易</button>&nbsp;";
					}
					html += "</p>";
					html += "</div>";
					html += '</li>';
				}
				for(var i in data.inOrders){
					html += '<li class="mui-table-view-cell">';
					html += '<div class="mui-table">';
					html += '<div class="mui-table-cell mui-col-xs-12">';
					html += '<h5 class="mui-ellipsis">订单号：'+data.inOrders[i].orderNo+'</h5>';
					html += '<h6>'+data.inOrders[i].buyDescription+'</h6>';
					
					html += '</div>';
					html += '<div class="mui-table-cell mui-col-xs-6 mui-text-right"><span class="mui-h6">'+data.inOrders[i].createTimeStr+'</span></div>';
					html += '</div>';
					html += "<div align='center' class='mui-media-body'>";
					html += "<p class='mui-ellipsis'>";
					html += "<button class='mui-btn mui-btn-outlined mui-btn-yellow mui-icon mui-icon-plus-filled' style='width: 90px;' onclick='showUserInfo("+data.inOrders[i].sellerNo+")' id='showSellerINfo'>交易账号</button>&nbsp;";
					if(data.inOrders[i].orderStatus === 1){
						html += "<button class='mui-btn mui-btn-outlined mui-btn-green mui-icon mui-icon-plus-filled' style='width: 90px;' onclick='buyerConfirmOrder("+data.inOrders[i].id+")' id='buyerConfirmOrder'>确认交易</button>&nbsp;";
						html += "<button class='mui-btn mui-btn-outlined mui-btn-red mui-icon mui-icon-plus-filled' style='width: 90px;' onclick='buyerCancelOrder("+data.inOrders[i].id+")' id='buyerCancelOrder_"+data.inOrders[i].id+"'>取消交易</button>&nbsp;";
					}else if(data.inOrders[i].orderStatus === 2){
						//html += "<button class='mui-btn mui-btn-outlined mui-btn-green mui-icon mui-icon-plus-filled' style='width: 90px;' onclick='buyerConfirmOrder("+data.inOrders[i].id+")' id='buyerConfirmOrder'>确认交易</button>&nbsp;";
						//html += "<button class='mui-btn mui-btn-outlined mui-btn-red mui-icon mui-icon-plus-filled' style='width: 90px;' onclick='buyerCancelOrder("+data.inOrders[i].id+")' id='buyerCancelOrder_"+data.inOrders[i].id+"'>取消交易</button>&nbsp;";
					}
					html += "</p>";
					html += "</div>";
					html += '</li>';
				}
				html += '</ul>';
				document.getElementById("myMessages").innerHTML = html;
			}else if(data.resultCode === '1002'){
				mui.toast(data.resultMsg);
			}else if(data.resultCode === '1004'){//会话过期，請重新登錄
				mui.toast(data.resultMsg);
				mui.openWindow({url:'tab-webview-main.html',id:'list'});
			}
		},
		error:function(xhr,type,errorThrown){
			//异常处理；
			mui.toast("系统异常！");
			console.log("异常: " + type);
		}
	});
}
/********************************************卖方二次确认交易**********************************************************/
//二次确认交易
function sellerConfirmOrder(id){
	console.log("id = " + id);
	
	var btn = ['是', '否'];
	mui.confirm('您确定要确认此订单吗?', '温馨提示', btn, function(e) {
		if(e.index == 0){
			//verifyDealPwd4BuyerRemoveOrder(id);
			console.log("@@@@@确认此订单orderNo = " + id);
			sellerConfirmOrderResult(id);
		}
	});
	
	/*mui.confirm('<input type="password" id="sellerConfirmOrderDealpwd" />', '请输入交易密码',null, function(e) {
		if(e.index == 1){
			var dealpwd = document.getElementById('sellerConfirmOrderDealpwd').value;
			console.log("输入的交易密码 = " + dealpwd);
			verifyDealPwd4SellerConfirmOrder(dealpwd,id);
		}
	},'div');	*/
}
/*function verifyDealPwd4SellerConfirmOrder(dealpwd,id){
	plus.nativeUI.showWaiting('正在验证密码...');
	mui.ajax(url + '/verifyDealpwd',{
		data:{
			"dealpwd": dealpwd
		},
		dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		headers:{'Content-Type':'application/json'},
		crossDomain:true,
		success:function(data){
			//服务器返回响应，根据响应结果，分析是否登录成功；
			console.log("------------->data = " + data);
			console.log("------------->data.resultCode = " + data.resultCode);
			console.log("------------->data.resultMsg = " + data.resultMsg);
			console.log("------------->data.verifyResult = " + data.verifyResult);
			if(data.resultCode == '1001'){
				plus.nativeUI.closeWaiting();
				if(data.verifyResult == 'F'){
					mui.toast("交易密码有误");
				}else{
					sellerConfirmOrderResult(id);
				}
			}else if(data.resultCode == '1002'){//服务器异常
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
			}else if(data.resultCode == '1004'){//会话过期，請重新登錄
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
				mui.openWindow({url:'tab-webview-main.html',id:'list'});
			}
		},
		error:function(xhr,type,errorThrown){
			plus.nativeUI.closeWaiting();
			//异常处理；
			mui.toast("系统异常！");
			console.log("异常: " + type);
		}
	});
}*/
function sellerConfirmOrderResult(id){
	plus.nativeUI.showWaiting('正在二次确定交易，请稍后...');
	mui.ajax(url + '/sellerConfirmOrder',{
		data:{
			"id": id
		},
		dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		headers:{'Content-Type':'application/json'},
		crossDomain:true,
		success:function(data){
			//服务器返回响应，根据响应结果，分析是否登录成功；
			console.log("------------->data = " + data);
			console.log("------------->data.resultCode = " + data.resultCode);
			console.log("------------->data.resultMsg = " + data.resultMsg);
			
			if(data.resultCode == '1001'){
				plus.nativeUI.closeWaiting();
				//plus.ui.toast("出售成功,请及时查看信箱中订单的状态");
				plus.ui.toast("您已确认卖出。");
				//重新加载订单列表
				showMyOrders();
			}else if(data.resultCode == '1004'){//会话过期，請重新登錄
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
				mui.openWindow({url:'tab-webview-main.html',id:'list'});
			}else if(data.resultCode === '1002'){
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
			}
		},
		error:function(xhr,type,errorThrown){
			plus.nativeUI.closeWaiting();
			//异常处理；
			mui.toast("系统异常！");
			console.log("异常: " + type);
		}
	});
}
/********************************************卖方取消交易**********************************************************/
//取消交易
function sellerCancelOrder(id){
	console.log("orderNo = " + id);
	
	var btn = ['是', '否'];
	mui.confirm('您确定要取消此订单吗?', '温馨提示', btn, function(e) {
		if(e.index == 0){
			//verifyDealPwd4BuyerRemoveOrder(id);
			console.log("@@@@@取消此订单orderNo = " + id);
			sellerCancelOrderResult(id);
		}
	});
	
	
	
	/*mui.confirm('<input type="password" id="sellerCancelOrderDealpwd" />', '请输入交易密码',null, function(e) {
		if(e.index == 1){
			var dealpwd = document.getElementById('sellerCancelOrderDealpwd').value;
			console.log("输入的交易密码 = " + dealpwd);
			verifyDealPwd4SellerCancelOrder(dealpwd,id);
		}
	},'div');*/
}
/*function verifyDealPwd4SellerCancelOrder(dealpwd,id){
	plus.nativeUI.showWaiting('正在验证密码...');
	mui.ajax(url + '/verifyDealpwd',{
		data:{
			"dealpwd": dealpwd
		},
		dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		headers:{'Content-Type':'application/json'},
		crossDomain:true,
		success:function(data){
			//服务器返回响应，根据响应结果，分析是否登录成功；
			console.log("------------->data = " + data);
			console.log("------------->data.resultCode = " + data.resultCode);
			console.log("------------->data.resultMsg = " + data.resultMsg);
			console.log("------------->data.verifyResult = " + data.verifyResult);
			if(data.resultCode == '1001'){
				plus.nativeUI.closeWaiting();
				if(data.verifyResult == 'F'){
					mui.toast("交易密码有误");
				}else{
					sellerCancelOrderResult(id);
				}
			}else if(data.resultCode == '1002'){//服务器异常
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
			}else if(data.resultCode == '1004'){//会话过期，請重新登錄
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
				mui.openWindow({url:'tab-webview-main.html',id:'list'});
			}
		},
		error:function(xhr,type,errorThrown){
			plus.nativeUI.closeWaiting();
			//异常处理；
			mui.toast("系统异常！");
			console.log("异常: " + type);
		}
	});
}*/
function sellerCancelOrderResult(id){
	plus.nativeUI.showWaiting('正在取消交易，请稍后...');
	mui.ajax(url + '/sellerCancelOrder',{
		data:{
			"id": id
		},
		dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		headers:{'Content-Type':'application/json'},
		crossDomain:true,
		success:function(data){
			//服务器返回响应，根据响应结果，分析是否登录成功；
			console.log("------------->data = " + data);
			console.log("------------->data.resultCode = " + data.resultCode);
			console.log("------------->data.resultMsg = " + data.resultMsg);
			
			if(data.resultCode == '1001'){
				plus.nativeUI.closeWaiting();
				//plus.ui.toast("出售成功,请及时查看信箱中订单的状态");
				plus.ui.toast("您已成功取消订单。");
				//重新加载订单列表
				showMyOrders();
			}else if(data.resultCode == '1004'){//会话过期，請重新登錄
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
				mui.openWindow({url:'tab-webview-main.html',id:'list'});
			}else if(data.resultCode === '1002'){
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
			}
		},
		error:function(xhr,type,errorThrown){
			plus.nativeUI.closeWaiting();
			//异常处理；
			mui.toast("系统异常！");
			console.log("异常: " + type);
		}
	});
}
/************************************************购买者确认交易**************************************************************/
//确认交易
function buyerConfirmOrder(id){
	console.log("id = " + id);
	/*var btn = ['是', '否'];
	mui.confirm('您确定要确认此订单吗?', '温馨提示', btn, function(e) {
		if(e.index == 0){
			//verifyDealPwd4BuyerRemoveOrder(id);
			console.log("@@@@@确认此订单orderNo = " + id);
			buyerConfirmOrderResult(id);
		}
	});*/
	
	
	mui.confirm('<input type="password" id="buyerConfirmOrderDealpwd" />', '请输入交易密码<br><h6 style="color:#FF0000">付款后请点击确认</h6>',null, function(e) {
		if(e.index == 1){
			var dealpwd = document.getElementById('buyerConfirmOrderDealpwd').value;
			console.log("输入的交易密码 = " + dealpwd);
			verifyDealPwd4BuyerConfirmOrder(dealpwd,id);
		}
	},'div');
}
//确认交易密码验证
function verifyDealPwd4BuyerConfirmOrder(dealpwd,id){
	plus.nativeUI.showWaiting('正在验证密码...');
	mui.ajax(url + '/verifyDealpwd',{
		data:{
			"dealpwd": dealpwd
		},
		dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		headers:{'Content-Type':'application/json'},
		crossDomain:true,
		success:function(data){
			//服务器返回响应，根据响应结果，分析是否登录成功；
			console.log("------------->data = " + data);
			console.log("------------->data.resultCode = " + data.resultCode);
			console.log("------------->data.resultMsg = " + data.resultMsg);
			console.log("------------->data.verifyResult = " + data.verifyResult);
			if(data.resultCode == '1001'){
				plus.nativeUI.closeWaiting();
				if(data.verifyResult == 'F'){
					mui.toast("交易密码有误");
				}else{
					buyerConfirmOrderResult(id);
				}
			}else if(data.resultCode == '1002'){//服务器异常
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
			}else if(data.resultCode == '1004'){//会话过期，請重新登錄
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
				mui.openWindow({url:'tab-webview-main.html',id:'list'});
			}
		},
		error:function(xhr,type,errorThrown){
			plus.nativeUI.closeWaiting();
			//异常处理；
			mui.toast("系统异常！");
			console.log("异常: " + type);
		}
	});
}
function buyerConfirmOrderResult(id){
	plus.nativeUI.showWaiting('正在确定交易，请稍后...');
	mui.ajax(url + '/buyerConfirmOrder',{
		data:{
			"id": id
		},
		dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		headers:{'Content-Type':'application/json'},
		crossDomain:true,
		success:function(data){
			//服务器返回响应，根据响应结果，分析是否登录成功；
			console.log("------------->data = " + data);
			console.log("------------->data.resultCode = " + data.resultCode);
			console.log("------------->data.resultMsg = " + data.resultMsg);
			
			if(data.resultCode == '1001'){
				plus.nativeUI.closeWaiting();
				//plus.ui.toast("出售成功,请及时查看信箱中订单的状态");
				plus.ui.toast("确认购买,请等待对方确认订单。");
				//重新加载订单列表
				showMyOrders();
			}else if(data.resultCode == '1004'){//会话过期，請重新登錄
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
				mui.openWindow({url:'tab-webview-main.html',id:'list'});
			}else if(data.resultCode === '1002'){
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
			}
		},
		error:function(xhr,type,errorThrown){
			plus.nativeUI.closeWaiting();
			//异常处理；
			mui.toast("系统异常！");
			console.log("异常: " + type);
		}
	});
}
/************************************************购买者取消交易**************************************************************/
//取消交易
function buyerCancelOrder(id){
	console.log("id = " + id);
	
	var btn = ['是', '否'];
	mui.confirm('您确定要取消此订单吗?', '温馨提示', btn, function(e) {
		if(e.index == 0){
			//verifyDealPwd4BuyerRemoveOrder(id);
			console.log("@@@@@取消此订单orderNo = " + id);
			buyerCancelOrderResult(id);
		}
	});
	
	
	/*mui.confirm('<input type="password" id="buyerCancelOrderDealpwd" />', '请输入交易密码',null, function(e) {
		if(e.index == 1){
			var dealpwd = document.getElementById('buyerCancelOrderDealpwd').value;
			console.log("输入的交易密码 = " + dealpwd);
			verifyDealPwd4BuyerCancelOrder(dealpwd,id);
		}
	},'div');*/
}
/*function verifyDealPwd4BuyerCancelOrder(dealpwd,id){
	plus.nativeUI.showWaiting('正在验证密码...');
	mui.ajax(url + '/verifyDealpwd',{
		data:{
			"dealpwd": dealpwd
		},
		dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		headers:{'Content-Type':'application/json'},
		crossDomain:true,
		success:function(data){
			//服务器返回响应，根据响应结果，分析是否登录成功；
			console.log("------------->data = " + data);
			console.log("------------->data.resultCode = " + data.resultCode);
			console.log("------------->data.resultMsg = " + data.resultMsg);
			console.log("------------->data.verifyResult = " + data.verifyResult);
			if(data.resultCode == '1001'){
				plus.nativeUI.closeWaiting();
				if(data.verifyResult == 'F'){
					mui.toast("交易密码有误");
				}else{
					buyerCancelOrderResult(id);
				}
			}else if(data.resultCode == '1002'){//服务器异常
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
			}else if(data.resultCode == '1004'){//会话过期，請重新登錄
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
				mui.openWindow({url:'tab-webview-main.html',id:'list'});
			}
		},
		error:function(xhr,type,errorThrown){
			plus.nativeUI.closeWaiting();
			//异常处理；
			mui.toast("系统异常！");
			console.log("异常: " + type);
		}
	});
}*/
function buyerCancelOrderResult(id){
	plus.nativeUI.showWaiting('正在取消交易，请稍后...');
	mui.ajax(url + '/buyerCancelOrder',{
		data:{
			"id": id
		},
		dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		headers:{'Content-Type':'application/json'},
		crossDomain:true,
		success:function(data){
			//服务器返回响应，根据响应结果，分析是否登录成功；
			console.log("------------->data = " + data);
			console.log("------------->data.resultCode = " + data.resultCode);
			console.log("------------->data.resultMsg = " + data.resultMsg);
			
			if(data.resultCode == '1001'){
				plus.nativeUI.closeWaiting();
				//plus.ui.toast("出售成功,请及时查看信箱中订单的状态");
				plus.ui.toast("您已成功取消订单。");
				//重新加载订单列表
				showMyOrders();
			}else if(data.resultCode == '1004'){//会话过期，請重新登錄
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
				mui.openWindow({url:'tab-webview-main.html',id:'list'});
			}else if(data.resultCode === '1002'){
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
			}
		},
		error:function(xhr,type,errorThrown){
			plus.nativeUI.closeWaiting();
			//异常处理；
			mui.toast("系统异常！");
			console.log("异常: " + type);
		}
	});
}
//显示用户账户信息
function showUserInfo(userNo){
	console.log("显示用户账户信息 = " + userNo);
	plus.nativeUI.showWaiting('正在显示账户信息，请稍后...');
	mui.ajax(url + '/getUserInfoByUserNo',{
		data:{
			"userNo": userNo
		},
		dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		headers:{'Content-Type':'application/json'},
		crossDomain:true,
		success:function(data){
			//服务器返回响应，根据响应结果，分析是否登录成功；
			console.log("------------->data = " + data);
			console.log("------------->data.resultCode = " + data.resultCode);
			console.log("------------->data.resultMsg = " + data.resultMsg);
			console.log("------------->data.userInfo = " + data.userInfo);
			if(data.resultCode == '1001'){
				plus.nativeUI.closeWaiting();
				var ul = '<ul class="mui-table-view">';
				ul += '<li class="mui-table-view-cell" align="center"><a href="#">交易账号信息</a></li>';
				ul += '<li class="mui-table-view-cell"><a href="#">开户名：'+data.userInfo.accountName+'</a></li>';
				ul += '<li class="mui-table-view-cell"><a href="#">开户行：'+data.userInfo.accountBank+'</a></li>';
				ul += '<li class="mui-table-view-cell"><a href="#">账号：'+data.userInfo.bankCardNumber+'</a></li>';
				ul += '<li class="mui-table-view-cell"><a href="#">微信账号：'+data.userInfo.weixin+'</a></li>';
				ul += '<li class="mui-table-view-cell"><a href="#">支付宝账号：'+data.userInfo.alipay+'</a></li>';
				ul += '</ul>';
				document.getElementById("popover").innerHTML = ul;
				mui("#popover").popover('toggle', document.getElementById("div"));
			}else if(data.resultCode == '1004'){//会话过期，請重新登錄
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
				mui.openWindow({url:'tab-webview-main.html',id:'list'});
			}else if(data.resultCode === '1002'){
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
			}
		},
		error:function(xhr,type,errorThrown){
			plus.nativeUI.closeWaiting();
			//异常处理；
			mui.toast("系统异常！");
			console.log("异常: " + type);
		}
	});
}
