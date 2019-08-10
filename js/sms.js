function sendSmsCode(mobileNo,imageCode){
	console.log("mobileNo = " + mobileNo);
	console.log("imageCode = " + imageCode);
	mui.ajax(url + '/sendSms',{
		data:{
			"mobileNo":mobileNo,
			"imageCode":imageCode
		},
		dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		headers:{'Content-Type':'application/json'},
		crossDomain:true,
		success:function(data){
			if(data.resultCode == '7001'){
				mui.toast(data.resultMsg);
			}else{
				mui.toast(data.resultMsg);
			}
		},
		error:function(xhr, type, errorThrown){
			mui.toast("发送验证码出现异常！");
			//resumeBtn(register);
			console.log("异常" + type);
		}
	});
}
