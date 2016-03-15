// JavaScript Document
/** 
 * Cookie类 
 */ 
function Cookie() { 
	this.isNet = false;
	this.strCookie = '';
	
	this.getDocumentCookie = function() {
		if (this.isNet) {
			return document.cookie;
		} else {
			return this.strCookie;
		}
	}
	
	this.setDocumentCookie = function(strCookie) {
		if (this.isNet) {
			document.cookie = strCookie;
		} else {
			this.strCookie = strCookie;
		}	
	}
	
	/** 
	 * @desc 设置Cookie 
	 * @return void 
	 */ 
	this.setCookie = function(name, value, hours) { 
		var expire = ""; 
		if (hours != null) { 
			expire = new Date((new Date()).getTime() + hours * 3600000); 
			expire = "; expires=" + expire.toGMTString(); 
		} 
		this.setDocumentCookie(escape(name) + "=" + escape(value) + expire);
	} 
　　 
	/** 
	 * @desc 读取Cookie 
	 * @return String 
	 */ 
	this.getCookie = function(name) { 
　　　　var cookieValue = ""; 
　　　　var search = escape(name) + "="; 
		var strCookie = this.getDocumentCookie();
　　　　if (strCookie.length > 0){  
　　　　　　offset = strCookie.indexOf(search); 
　　　　　　if (offset != -1){  
　　　　　　　　offset += search.length; 
　　　　　　　　end = strCookie.indexOf(";", offset); 
　　　　　　　　if (end == -1) end = strCookie.length; 
　　　　　　　　cookieValue = unescape(strCookie.substring(offset, end)) 
　　　　　　} 
　　　　} 
　　　　return cookieValue;　　　　 
　　}　　 
} 

/**
 * 购物车类
 */
function Car(name){ 
　　 
　　if (!window.clientInformation.cookieEnabled) { 
　　　　alert('你的浏览器不支持Cookie无法使用此 购物车 系统'); 
　　　　return false; 
　　} 
　　 
　　// 内部变量 
　　 
　　this.carName = name; 
　　this.time = 24 * 30;　　　　// 购物车的有效时间(30天) 
　　this.goodses = new Array(); 
　　this.cookie = new Cookie();

	this.refreshCookie = function() {
		
	}
	
	this.addGoods = function(id, name, money) {
		var strCookie = this.cookie.getCookie(this.carName);
		if (strCookie == '') {
			strCookie += id + '#' + name + '#' + money;
		} else {
			strCookie += '|' + id + '#' + name + '#' + money;
		}
		this.cookie.setCookie(this.carName, strCookie, this.time);
	}
	
	this.deleteGoods = function(id) {
		var strCookie = this.cookie.getCookie(this.carName);
		var list = strCookie.split('|');
		strCookie = '';
		for (var i = 0; i < list.length; i++) {
			var ss = list[i].split('#');
			if (ss[0] != id) {
				strCookie += list[i];
			}
		}
		
		this.cookie.setCookie(this.carName, strCookie, this.time);
	}
	
	this.getTotalMoney = function() {
		var strCookie = this.cookie.getCookie(this.carName);
		var list = strCookie.split('|');
		var totalMoney = 0;
		for (var i = 0; i < list.length; i++) {
			var ss = list[i].split('#');
			totalMoney += parseInt(ss[2]);
		}	
		return totalMoney;
	}
	/** 
	 * @desc 删除此购物车 
	 * @return void 
	 */ 
　　this.deleteCar = function() { 
　　　　this.cookie.setCookie(this.carName, '', 0);
　　} 
}
	