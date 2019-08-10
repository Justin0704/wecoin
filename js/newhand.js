function checkEnoughWbt(wbtCount,unitPrice,totalPrice,pendingType){
	plus.nativeUI.showWaiting('正在买单，请稍后...');
	mui.ajax(url + '/checkWbt',{
		data:{
			"amount": wbtCount,
			"agreementPrice": unitPrice
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
						if(dealpwd === ''){
							mui.toast("请输入交易密码");
							return;
						}
						verifyDealPwdPending(dealpwd,wbtCount,unitPrice,totalPrice,pendingType);
					}
				},'div');
			}else if(data.resultCode === '5002'){//WBT不足
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
			}else if(data.resultCode === '1004'){//会话过期，請重新登錄
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
				mui.openWindow({url:'../index.html',id:'index.html'});
			}
		},
		error:function(xhr,type,errorThrown){
			plus.nativeUI.closeWaiting();
			//异常处理；
			mui.toast("验证WBT数量出现异常！");
			console.log("验证WBT数量出现异常: " + type);
		}
	});
}
//验证交易密码是否正确
function verifyDealPwdPending(dealpwd,wbtCount,unitPrice,totalPrice,pendingType){
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
					pendingOrder(wbtCount,unitPrice,totalPrice,pendingType);
				}
			}else if(data.resultCode == '1002'){//服务器异常
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
			}else if(data.resultCode == '1004'){//会话过期，請重新登錄
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
				mui.openWindow({url:'../index.html',id:'list'});
			}
		},
		error:function(xhr,type,errorThrown){
			plus.nativeUI.closeWaiting();
			//异常处理；
			mui.toast("验证交易密码异常！");
			console.log("验证交易密码异常: " + type);
		}
	});
}
function pendingOrder(wbtCount,unitPrice,totalPrice,pendingType){
	console.log("pendingOrder--->" + wbtCount + " ," + unitPrice + " ," + totalPrice + "," + pendingType);
	plus.nativeUI.showWaiting('正在挂单...');
	mui.ajax(url + '/pendingOrder',{
		data:{
			"amount": wbtCount,
			"agreementPrice": unitPrice,
			"pendingType": pendingType
		},
		dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		headers:{'Content-Type':'application/json'},
		crossDomain:true,
		success:function(data){
			plus.nativeUI.closeWaiting();
			//服务器返回响应，根据响应结果，分析是否登录成功；
			console.log("------------->data = " + data);
			console.log("------------->data.resultCode = " + data.resultCode);
			console.log("------------->data.resultMsg = " + data.resultMsg);
			
			if(data.resultCode == '1001'){
				plus.ui.toast("挂单成功");
				//显示挂单列表
				showPendingOrders();
			}else if(data.resultCode == '1004'){//会话过期，請重新登錄
				mui.toast(data.resultMsg);
				mui.openWindow({url:'../index.html',id:'list'});
			}else if(data.resultCode == '6004'){
				mui.toast(data.resultMsg);
			}else if(data.resultCode == '6005'){
				mui.toast(data.resultMsg);
			}else if(data.resultCode == '6006'){
				mui.toast(data.resultMsg);
			}
		},
		error:function(xhr,type,errorThrown){
			plus.nativeUI.closeWaiting();
			//异常处理；
			mui.toast("挂单异常！");
			console.log("挂单异常: " + type);
		}
	});
}
//显示挂单列表（买家看板）
function showPendingOrders(){
	mui.ajax(url + '/showPendingOrders',{
		dataType:'json',//服务器返回json格式数据
		type:'get',//HTTP请求类型
		headers:{'Content-Type':'application/json'},
		crossDomain:true,
		success:function(data){
			//服务器返回响应，根据响应结果，分析是否登录成功；
			console.log("@@@@------------->data = " + data);
			console.log("@@@@------------->data.resultCode = " + data.resultCode);
			console.log("@@@@------------->data.resultMsg = " + data.resultMsg);
			console.log("@@@@------------->data.pendingOrders = " + data.pendingOrders);
			
			if(data.resultCode === '1001'){
				var html = '<ul class="mui-table-view">';
				for(var i in data.pendingOrders){
					console.log("----------->orderStatus = " + data.pendingOrders[i].orderStatus);
					html += '<li class="mui-table-view-cell mui-media">';
					html += '<div class="mui-media-body">';
					html += '<p class="mui-ellipsis">单号：'+data.pendingOrders[i].orderNo+'</p>';
					html += '<p class="mui-ellipsis">日期：'+data.pendingOrders[i].createTimeStr+'</p>';
					html += '<h5>'+data.pendingOrders[i].buyDescription+'</h5>';
					html += '</div>';
					html += '<div class="mui-media-body" align="center">';
					if(data.loginUserNo != data.pendingOrders[i].buyerNo){
						html += '<button type="button" class="mui-btn mui-btn-outlined mui-btn-yellow" onclick="sellItOut('+data.pendingOrders[i].id+','+data.pendingOrders[i].amount+','+data.pendingOrders[i].agreementPrice+')" style="width:35%;">卖给TA</button>&nbsp;';
					}else{
						html += '<button type="button" class="mui-btn mui-btn-outlined mui-btn-red" onclick="removePendingOrder('+data.pendingOrders[i].id+')" style="width:35%;">删除订单</button>';
					}
					html += '</div>';
					html += '</li>';
					html += '<li class="mui-table-view-divider"></li>';
				}
				html += '</ul>';
				console.log("data.pendingOrders.length = " + data.pendingOrders.length);
				if(data.pendingOrders.length >= 10){
					html += '<div class="mui-content-padded">';
					html += '<button type="button" class="mui-btn mui-btn-primary" onclick="showMorePendingOrder()" style="width:100%;">查看更多挂单</button>';
					html += '</div>';
				}
				document.getElementById("pendingOrders").innerHTML = html;
			}else if(data.resultCode === '1002'){
				mui.toast(data.resultMsg);
			}else if(data.resultCode === '1004'){//会话过期，請重新登錄
				mui.toast(data.resultMsg);
				mui.openWindow({url:'../index.html',id:'list'});
			}
		},
		error:function(xhr,type,errorThrown){
			//异常处理；
			mui.toast("系统异常！");
			console.log("异常: " + type);
		}
	});			
}
function showMorePendingOrder(){
	//console.log("显示更多挂单信息");
	mui.openWindow({
		url: '/market/morePendingOrders.html'
	});
}
function removePendingOrder(id){
	console.log("删除的订单号orderNo = " + id);
	/*mui.confirm('<input type="password" id="buyerRemoveOrderDealpwd" />', '请输入交易密码',null, function(e) {
		if(e.index == 1){
			var dealpwd = document.getElementById('buyerRemoveOrderDealpwd').value;
			console.log("输入的交易密码 = " + dealpwd);
			verifyDealPwd4BuyerRemoveOrder(dealpwd,id);
		}
	},'div');*/
	var btn = ['是', '否'];
	mui.confirm('您确定要删除此订单吗?', '温馨提示', btn, function(e) {
		if(e.index == 0){
			//verifyDealPwd4BuyerRemoveOrder(id);
			console.log("@@@@@删除的订单号orderNo = " + id);
			buyerRemoveOrderResult(id);
		}
	});
}
/*function verifyDealPwd4BuyerRemoveOrder(dealpwd,id){
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
					buyerRemoveOrderResult(id);
				}
			}else if(data.resultCode == '1002'){//服务器异常
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
			}else if(data.resultCode == '1004'){//会话过期，請重新登錄
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
				mui.openWindow({url:'../index.html',id:'list'});
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
function buyerRemoveOrderResult(id){
	plus.nativeUI.showWaiting('正在删除订单，请稍后...');
	mui.ajax(url + '/buyerRemoveOrder',{
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
				plus.ui.toast("您已成功删除订单");
				//重新加载订单列表
				showPendingOrders();
			}else if(data.resultCode == '1004'){//会话过期，請重新登錄
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
				mui.openWindow({url:'../index.html',id:'list'});
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
//卖个TA
function sellItOut(id,amount,agreementPrice){
	plus.nativeUI.showWaiting('正在售出，请稍后...');
	console.log(id + "," + amount + "," + agreementPrice);
	mui.ajax(url + '/checkSellerUserInfo',{
		data:{
			"id": id,
			"amount":amount,
			"agreementPrice":agreementPrice
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
				mui.confirm('<input type="password" id="verifyBuyerDealpwd" />', '请输入交易密码<br><h6 style="color:#FF0000">买个对方后系统将收取20%手续费且该交易不能取消！</h6>',null, function(e) {
					if(e.index == 1){
						var dealpwd = document.getElementById('verifyBuyerDealpwd').value;
						if(dealpwd === ''){
							mui.toast("请输入交易密码");
							return;
						}
						verifyDealPwd(dealpwd,id,amount,agreementPrice);//交易密码验证
					}
				},'div');
			}else if(data.resultCode === '5002'){//WBT不足
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
			}else if(data.resultCode === '1004'){//会话过期，請重新登錄
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
				mui.openWindow({url:'../index.html',id:'list'});
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
//交易密码验证
function verifyDealPwd(dealpwd,id,amount,agreementPrice){
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
					sellOutResult(id,amount,agreementPrice);//通过交易密码验证后卖给TA
				}
			}else if(data.resultCode == '1002'){//服务器异常
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
			}else if(data.resultCode == '1004'){//会话过期，請重新登錄
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
				mui.openWindow({url:'../index.html',id:'list'});
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
//卖给Ta
function sellOutResult(id,amount,agreementPrice){
	plus.nativeUI.showWaiting('正在卖给TA...');
	mui.ajax(url + '/sellItOut',{
		data:{
			"id": id,
			"amount": amount,
			"agreementPrice": agreementPrice
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
				//清空输入框的内容，重新查询订单列表
				showPendingOrders();
			}else if(data.resultCode == '1004'){//会话过期，請重新登錄
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
				mui.openWindow({url:'../index.html',id:'list'});
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
function showMyDealOrders(){
	mui.ajax(url + '/dealPendingOrders',{
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
				for(var i in data.inOrders){
					html += '<li class="mui-table-view-cell mui-media">';
					html += '<div class="mui-media-body">';
					html += '<p class="mui-ellipsis">单号：'+data.inOrders[i].orderNo+'</p>';
					html += '<p class="mui-ellipsis">日期：'+data.inOrders[i].createTimeStr+'</p>';
					html += '<h5>'+data.inOrders[i].buyDescription+'</h5>';
					html += '</div>';
					html += '<div class="mui-media-body" align="center">';
					html += "<button type='button' class='mui-btn mui-btn-outlined mui-btn-yellow mui-icon mui-icon-plus-filled' style='width: 90px;' onclick='showUserInfo2("+data.inOrders[i].sellerNo+")' id='showBuyerInfo'>交易账号</button>&nbsp;";
					if(data.inOrders[i].orderStatus === 1){
						html += "<button type='button' class='mui-btn mui-btn-outlined mui-btn-red mui-icon mui-icon-plus-filled' style='width: 90px;' onclick='buyerCancelPendingOrder("+data.inOrders[i].id+")' id='buyerCancelPendingOrder'>取消交易</button>&nbsp;";	
					}else if(data.inOrders[i].orderStatus === 2){
						html += "<button type='button' class='mui-btn mui-btn-outlined mui-btn-green mui-icon mui-icon-plus-filled' style='width: 90px;' onclick='buyerConfirmPendingOrder2("+data.inOrders[i].id+")'>确认交易</button>&nbsp;";	
					}
					html += '</div>';
					html += '</li>';
					html += '<li class="mui-table-view-divider"></li>';
				}
				for(var i in data.outOrders){
					console.log("----------->orderStatus = " + data.outOrders[i].orderStatus);
					html += '<li class="mui-table-view-cell mui-media">';
					html += '<div class="mui-media-body">';
					html += '<p class="mui-ellipsis">单号：'+data.outOrders[i].orderNo+'</p>';
					html += '<p class="mui-ellipsis">日期：'+data.outOrders[i].createTimeStr+'</p>';
					html += '<h5>'+data.outOrders[i].sellDescription+'</h5>';
					html += '</div>';
					html += '<div class="mui-media-body" align="center">';
					html += "<button type='button' class='mui-btn mui-btn-outlined mui-btn-yellow mui-icon mui-icon-plus-filled' style='width: 90px;' onclick='showUserInfo2("+data.outOrders[i].buyerNo+")' id='showBuyerInfo'>交易账号</button>&nbsp;";
					if(data.outOrders[i].orderStatus === 1){
						html += "<button type='button' class='mui-btn mui-btn-outlined mui-btn-green mui-icon mui-icon-plus-filled' style='width: 90px;' onclick='sellerConfirmPendingOrder("+data.outOrders[i].id+")' id='sellerConfirmOrder'>确认交易</button>&nbsp;";
						html += "<button type='button' class='mui-btn mui-btn-outlined mui-btn-red mui-icon mui-icon-plus-filled' style='width: 90px;' onclick='sellerCancelPendingOrder("+data.outOrders[i].id+")' id='sellerCancelOrder_"+data.outOrders[i].id+"'>取消交易</button>&nbsp;";	
					}else if(data.outOrders[i].orderStatus === 2){
						//html += "<button type='button' class='mui-btn mui-btn-outlined mui-btn-red mui-icon mui-icon-plus-filled' style='width: 90px;' onclick='sellerCancelPendingOrder("+data.outOrders[i].id+")' id='sellerCancelOrder_"+data.outOrders[i].id+"'>取消交易</button>&nbsp;";
					}else if(data.outOrders[i].orderStatus === 3){
						html += "<button type='button' class='mui-btn mui-btn-outlined mui-btn-green mui-icon mui-icon-plus-filled' style='width: 90px;' onclick='sellerConfirmMoney("+data.outOrders[i].id+")' id='sellerConfirmMoney_"+data.outOrders[i].id+"'>金额确认</button>&nbsp;";
					}
					
					html += '</div>';
					html += '</li>';
					html += '<li class="mui-table-view-divider"></li>';
				}
				html += '</ul>';
				document.getElementById("myPendingMessages").innerHTML = html;
			}else if(data.resultCode === '1002'){
				mui.toast(data.resultMsg);
			}else if(data.resultCode === '1004'){//会话过期，請重新登錄
				mui.toast(data.resultMsg);
				mui.openWindow({url:'../index.html',id:'list'});
			}
		},
		error:function(xhr,type,errorThrown){
			//异常处理；
			mui.toast("系统异常！");
			console.log("异常: " + type);
		}
	});
}
//挂单者二次确认购买
function buyerConfirmPendingOrder2(id){
	console.log("id ========= " + id);
	/*mui.confirm('<input type="password" id="buyerConfirmPendingOrderDealpwd" />', '请输入交易密码<br><h6 style="color:#FF0000">付款后请点击确认</h6>',null, function(e) {
		if(e.index == 1){
			var dealpwd = document.getElementById('buyerConfirmPendingOrderDealpwd').value;
			console.log("输入的交易密码 = " + dealpwd);
			verifyDealPwd4BuyerConfirmPendingOrder(dealpwd,id);
		}
	},'div');*/
	var btn = ['是', '否'];
	mui.confirm('您确定要确认购买吗?', '温馨提示', btn, function(e) {
		if(e.index == 0){
			//verifyDealPwd4BuyerRemoveOrder(id);
			console.log("@@@@@挂单者二次确认购买orderNo = " + id);
			buyerConfirmPendingOrderResult(id);
		}
	});
}
//确认交易密码验证
/*function verifyDealPwd4BuyerConfirmPendingOrder(dealpwd,id){
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
					buyerConfirmPendingOrderResult(id);
				}
			}else if(data.resultCode == '1002'){//服务器异常
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
			}else if(data.resultCode == '1004'){//会话过期，請重新登錄
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
				mui.openWindow({url:'../index.html',id:'list'});
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
function buyerConfirmPendingOrderResult(id){
	plus.nativeUI.showWaiting('正在确定交易，请稍后...');
	mui.ajax(url + '/buyerConfirmPendingOrder',{
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
				plus.ui.toast("你已确认付款购买,请等待对方确认订单");
				//重新加载订单列表
				showMyDealOrders();
			}else if(data.resultCode == '1004'){//会话过期，請重新登錄
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
				mui.openWindow({url:'../index.html',id:'list'});
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
/*****************************************销售方的金额确认********************************************************/
function sellerConfirmMoney(id){
	console.log("id ========= " + id);
	/*mui.confirm('<input type="password" id="sellerConfirmMoney" />', '请输入交易密码',null, function(e) {
		if(e.index == 1){
			var dealpwd = document.getElementById('sellerConfirmMoney').value;
			console.log("输入的交易密码 = " + dealpwd);
			verifyDealPwd4SellerConfirmMoney(dealpwd,id);
		}
	},'div');*/
	var btn = ['是', '否'];
	mui.confirm('您确定收到的金额正确吗?', '金额确认', btn, function(e) {
		if(e.index == 0){
			//verifyDealPwd4BuyerRemoveOrder(id);
			console.log("@@@@@销售方的金额确认 = " + id);
			sellerConfirmMoneyResult(id);//销售方的金额确认
		}
	});
}
/*function verifyDealPwd4SellerConfirmMoney(dealpwd,id){
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
					sellerConfirmMoneyResult(id);//通过交易密码验证后确定金额
				}
			}else if(data.resultCode == '1002'){//服务器异常
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
			}else if(data.resultCode == '1004'){//会话过期，請重新登錄
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
				mui.openWindow({url:'../index.html',id:'list'});
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
//确定金额
function sellerConfirmMoneyResult(id){
	plus.nativeUI.showWaiting('正在确定金额，请稍后...');
	mui.ajax(url + '/sellerConfirmMoney',{
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
				plus.ui.toast("你已确认付款金额。");
				//重新加载订单列表
				showMyDealOrders();
			}else if(data.resultCode == '1004'){//会话过期，請重新登錄
				plus.nativeUI.closeWaiting();
				mui.toast(data.resultMsg);
				mui.openWindow({url:'../index.html',id:'list'});
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
function showUserInfo2(userNo){
	console.log("显示用户账户信息newHands = " + userNo);
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
				document.getElementById("popover_newhand").innerHTML = ul;
				mui("#popover_newhand").popover('toggle', document.getElementById("div"));
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