function get_keycode(e) {
	// reference: https://www.cnblogs.com/zzcflying/articles/2660061.html
	var keyName;
	switch (e.keyCode) {	
		case 37:
			keyName = "左";		
			break;		
		case 38:
			keyName = "上";	// 上		
			break;		
		case 39:
			keyName = "右";			
			break;		
		case 40:
			keyName = "下";	// 下		
			break;			
		default:
			keyName = ''	
			break;	
	}
	return keyName;
}