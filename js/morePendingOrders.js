/**
 * 下拉刷新具体业务实现
 */
function pulldownRefresh() {
	setTimeout(function() {
		mui.ajax(url + '/showPendingOrders',{
			dataType:'json',//服务器返回json格式数据
			type:'get',//HTTP请求类型
			headers:{'Content-Type':'application/json'},
			crossDomain:true,
			success:function(data){
				//服务器返回响应，根据响应结果，分析是否登录成功；
				console.log("@@@@下拉刷新------------->data = " + data);
				console.log("@@@@下拉刷新------------->data.resultCode = " + data.resultCode);
				console.log("@@@@下拉刷新------------->data.resultMsg = " + data.resultMsg);
				console.log("@@@@下拉刷新------------->data.pendingOrders = " + data.pendingOrders);
				
				if(data.resultCode === '1001'){
					document.getElementById("morePendingOrders").innerHTML = "";
					var html = '';//<ul class="mui-table-view">
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
					}
					document.getElementById("morePendingOrders").innerHTML = html;
					
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
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
	}, 500);
}
var pageNo = 0;
/**
 * 上拉加载具体业务实现
 */
function pullupRefresh() {
	pageNo ++;
	console.log("=====================================上拉，pageNo = " + pageNo);
	setTimeout(function() {
		mui.ajax(url + '/queryPendingOrdersByPage',{
			data:{
				"startRow": pageNo
			},
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			headers:{'Content-Type':'application/json'},
			crossDomain:true,
			success:function(data){
				//服务器返回响应，根据响应结果，分析是否登录成功；
				console.log("@@@@上拉------------->data.pendingOrderSize = " + data.pendingOrderSize);
				console.log("@@@@上拉------------->data.resultCode = " + data.resultCode);
				console.log("@@@@上拉------------->data.resultMsg = " + data.resultMsg);
				console.log("@@@@上拉------------->data.pendingOrders = " + data.pendingOrders);
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(data.pendingOrders.size === 0); //参数为true代表没有更多数据了。
				var table = document.body.querySelector('.mui-table-view');
				var cells = document.body.querySelectorAll('.mui-table-view-cell');
				if(data.resultCode === '1001'){
					for(var i in data.pendingOrders){
						console.log("----------->orderStatus = " + data.pendingOrders[i].orderStatus);
						var html = '';//<ul class="mui-table-view>
						var li = document.createElement('li');
						li.className = 'mui-table-view-cell';
						li.id = data.pendingOrders[i].id;//onclick="gotoDetail('+data.announcements[i].id+')"
						
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
						
						li.innerHTML = html;
						table.appendChild(li);
					}
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
	}, 500);
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
function removePendingOrder(id){
	console.log("删除的订单号orderNo = " + id);
	var btn = ['是', '否'];
	mui.confirm('您确定要删除此订单吗?', '温馨提示', btn, function(e) {
		if(e.index == 0){
			//verifyDealPwd4BuyerRemoveOrder(id);
			console.log("@@@@@删除的订单号orderNo = " + id);
			buyerRemoveOrderResult(id);
		}
	});
}
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
				pulldownRefresh();
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
				pulldownRefresh();
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
