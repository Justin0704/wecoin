function checkAppToken(val){
	var appToken = plus.storage.getItem('appToken');
	console.log("--------->判断本地存储的appToken = " + appToken + ",服务器session中的appToken = " + val);
	if(appToken != val){
		
		mui.openWindow({
			url: 'index.html',
			id: 'index',
			preload: true,
			show: {
				aniShow: 'pop-in'
			},
			styles: {
				popGesture: 'hide'
			},
			waiting: {
				autoShow: false
			}
		});
	}
}
