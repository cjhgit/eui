// JavaScript Document
/***************************************************************************************************** 
Name　　　　购物车 
Version　　　　1.1 
Author　　　　Vanni(凡林) url:www.27sea.com QQ:303590170 
CreateDate　　2005-05-31 
Description 
　　此类是基于JavaScript和客户端Cookie，请保证客户端开启Cookie 
　　数据保持（默认24*30小时）可以通过 this.expire=? 小时来指定 
　　类中两自带的两个对象 typeObj 和 proObj 均有两个相同属性名： name 和 value  

类中数据存储形式如下----------------------------------- 
Array( 
new typeObj('汽车',array( 
　　　　new porObj('三菱',200), 
　　　　new proObj('本田',500) 
) 
　　), 
　　new typeObj('蛋',array( 
　　　　new proObj('鸡蛋',10), 
　　　　new proObj('鸭蛋',20) 
　　) 
} 

Cookie 存取形式为[使用escape()函数加密过]-------------- 
　　购物车名 = 汽车#三菱:200|本田:500,蛋#鸡蛋:10|鸭蛋:20 

注意：客户端存Cookie时，不会出现问题。如果要循环存储的话，可能会出现有些存入，而有些未存入 
　　　解决方法：见下例(获得URL里的sales的数量，并存入Cookie) 

文件：/depot/compareproduct.php 中的JS代码片段 
<script language="javascript"> 
var car=new Car('compare'); 
var typeName='list'; 
car.delType(typeName);　　　　//将先前对比的产品清除 

//得到URL里的参数，并分隔成数组 
var url=location.href; 
var start=url.lastIndexOf('?sales='); 
var end=url.indexOf('&'); 
if(end==-1)end=url.length; 
var urlparam=url.substring(url.lastIndexOf('?sales=')+7, end ).split(','); 

function setPageVal(){ 
　　if(car.getPro(typeName).length==urlparam.length)return;　　　　//关键部分，如果数组长度不相等说明，有些Cookie没有存入 
　　else{ 
　　　　car.addType(typeName);　　　　　　　　　　　　//增一个类别 
　　　　for(i=0;i<urlparam.length;i++){ 
　　　　　　car.addPro(typeName,urlparam[i],'');　　//增加对比产品，如果存在，返回假 
　　　　} 
　　　　setTimeout('setPageVal();',100);　　　　　　//再次调用自身，没有用递归，是因为递归速度太快，仍会有存不进的问题 
　　} 
} 

setPageVal();　　　　　　　　　　　　　　　　　　　　//初始化数据 

function delItem(itemname){ 
　　car.delPro(typeName,itemname); 
　　var carData=car.getPro(typeName); 
　　var url=''; 
　　var carlen=carData.length; 
　　if(carlen>1){ 
　　　　for(i=0;i<carData.length;i++){ 
　　　　　　if(i==0)　　url =carData[i].name; 
　　　　　　else　　　　url+=','+carData[i].name; 
　　　　} 
　　　　document.write("waiting...."); 
　　　　location.href='../depot/compareproduct.php?sales='+url; 
　　}else{ 
　　　　if(confirm('如果删除它，那么只剩一个对比项了，是否关闭此窗口？')){ 
　　　　　　car.delCar(); 
　　　　　　window.close(); 
　　　　} 
　　} 
} 
</script> 

*****************************************************************************************************/ 
/** 
Cookie类 
*/ 
function Cookie(){ 
　　/** 
　　@desc 设置Cookie 
　　@return void 
　　*/ 
　　this.setCookie=function(name, value, hours){ 
　　　　var expire = ""; 
　　　　if(hours != null){ 
　　　　　　expire = new Date((new Date()).getTime() + hours * 3600000); 
　　　　　　expire = "; expires=" + expire.toGMTString(); 
　　　　} 
　　　　document.cookie = escape(name) + "=" + escape(value) + expire; 
　　} 
　　 
　　/** 
　　@desc 读取Cookie 
　　@return String 
　　*/ 
　　this.getCookie=function(name){ 
　　　　var cookieValue = ""; 
　　　　var search = escape(name) + "="; 
　　　　if(document.cookie.length > 0){  
　　　　　　offset = document.cookie.indexOf(search); 
　　　　　　if (offset != -1){  
　　　　　　　　offset += search.length; 
　　　　　　　　end = document.cookie.indexOf(";", offset); 
　　　　　　　　if (end == -1) end = document.cookie.length; 
　　　　　　　　cookieValue = unescape(document.cookie.substring(offset, end)) 
　　　　　　} 
　　　　} 
　　　　return cookieValue;　　　　 
　　}　　 
} 

function Car(name){ 
　　 
　　if( !window.clientInformation.cookieEnabled ) { 
　　　　alert('你的浏览器不支持Cookie无法使用此 购物车 系统'); 
　　　　return false; 
　　} 
　　 
　　// 内部变量 
　　 
　　this.carName = name; 
　　this.expire = 24 * 30;　　　　// 购物车的有效时间(30天) 
　　this.carDatas = new Array(); 
　　this.cookie = new Cookie(); 
　　 
　　// 内部对象 
　　 
　　this.typeObj = function(name, value) {　　// 自带的 类别 对象 
　　　　this.name =name; 
　　　　this.value=value; 
　　} 
　　this.proObj=function(name,value){　　//自带的" 商品 对象 
　　　　this.name =name; 
　　　　this.value=value; 
　　} 
　　 
　　//##私有方法列表########################################################## 
　　// 
　　//　　getTypePoint(typeName);　　　　　　　　//得到购物车里类别数组里的下标 
　　//　　getProPoint(typeName,proName);　　　　//得到购物车里类别下的产品下标 
　　//　　saveCookie()　　　　　　　　　　　　//以特定的形式存储此购物车的Cookie 
　　// 
　　//######################################################################## 
　　 
　　/** 
　　@desc 得到购物车里类别数组里的下标，找到的话返回下标，否则返回 -1 
　　@return int 
　　*/ 
　　this.getTypePoint=function(typeName){ 
　　　　var isok=false; 
　　　　var i=0; 
　　　　for(;i<this.carDatas.length;i++){ 
　　　　　　if(this.carDatas[i].name==typeName){ 
　　　　　　　　isok=true;　　　　　　//找到位置 
　　　　　　　　break; 
　　　　　　} 
　　　　} 
　　　　if(isok)　　return i; 
　　　　else　　　　return -1; 
　　} 
　　 
　　/** 
　　@desc 得到购物车里类别下的产品下标，找到返回下标，否则返回 -1 
　　@return int 
　　*/ 
　　this.getProPoint=function(typeId,proName){ 
　　　　var isok=false; 
　　　　var j = 0; 
　　　　var tempProObj=this.carDatas[typeId].value; 
　　　　for(;j<tempProObj.length;j++){ 
　　　　　　if(tempProObj[j].name==proName){ 
　　　　　　　　isok=true; 
　　　　　　　　break;　　 
　　　　　　} 
　　　　} 
　　　　if(isok)　　return j; 
　　　　else　　　　return -1; 
　　} 
　　 
　　/** 
　　@desc 存储生成的Cookie字符串 
　　@return void 
　　*/ 
　　this.saveCookie=function(){ 
　　　　var outStr=''; 
　　　　for( i=0; i<this.carDatas.length; i++ ){ 
　　　　　　var typeName =this.carDatas[i].name; 
　　　　　　var typeValue=this.carDatas[i].value; 
　　　　　　var proOutStr=''; 
　　　　　　for( j=0; j<typeValue.length; j++ ){ 
　　　　　　　　if ( j==0 )　　proOutStr = typeValue[j].name + ':' + typeValue[j].value; 
　　　　　　　　else　　　　proOutStr += '|' + typeValue[j].name + ':' + typeValue[j].value; 
　　　　　　} 
　　　　　　if ( i==0 )　　outStr = typeName + '#' + proOutStr; 
　　　　　　else　　　　outStr += ',' + typeName + '#' + proOutStr; 
　　　　} 
　　　　this.cookie.setCookie(this.carName,outStr,this.expire);　　//存入 Cookie　　 
　　} 
　　　　 
　　//##构造语句############################################################ 
　　 
　　if(this.cookie.getCookie(name)==''){ 
　　　　this.cookie.setCookie(name,'',this.expire); 
　　}else{ 
　　　　var tempTypes=this.cookie.getCookie(name).split(','); 
　　　　for(i=0;i<tempTypes.length;i++){ 
　　　　　　var tempTypeObj=tempTypes[i].split('#'); 
　　　　　　var type_pro=new Array(); 
　　　　　　if(tempTypeObj[1]){ 
　　　　　　　　var tempProObj=tempTypeObj[1].split('|'); 
　　　　　　　　for(j=0;j<tempProObj.length;j++){ 
　　　　　　　　　　var proDesc=tempProObj[j].split(':'); 
　　　　　　　　　　type_pro.push(new this.proObj(proDesc[0],proDesc[1])); 
　　　　　　　　} 
　　　　　　} 
　　　　　　this.carDatas.push(new this.typeObj(tempTypeObj[0],type_pro)); 
　　　　} 
　　} 

　　//##公共方法列表######################################################### 
　　// 
　　//　　addType(typeName);　　　　　　　　　　//增加一个类别 
　　//　　addPro(typeName,proName,value);　　　　//增加一个产品 
　　//　　editPro(typeName,proName,value);　　//修改产品的值 
　　//　　delPro(typeName,proName);　　　　　　//删除购物车内的一个类别下的产品 
　　//　　delType(typeName);　　　　　　　　　　//删除购物车内的一个类别，包括类别下的产品 
　　//　　delCar();　　　　　　　　　　　　　　//删除购物车 
　　//　　 
　　//　　getCar();　　　　　　　　　　　　　　//得到整个购物车的数据 
　　//　　getType();　　　　　　　　　　　　　　//得到购物车内的所有类别列表 
　　//　　getPro(typeName);　　　　　　　　　　//得到购物车内指定类别下的产品列表 
　　//　　getProVal(typeName,proName);　　　　//得到购物车内指定类别下的产品属性 
　　// 
　　//######################################################################## 
　　 
　　/** 
　　@desc 在购物车里增加一个类别，增加成功返回真，否则返回假 
　　@return bool 
　　*/ 
　　this.addType=function(typeName){ 
　　　　if(this.getTypePoint(typeName)!=-1)　　　　return false;　　　　　　　　//如果已经有此类别了，返回假 
　　　　this.carDatas.push(new this.typeObj(typeName,new Array()));　　　　　　//push进 自身数组 
　　　　this.saveCookie();　　//存入 Cookie 
　　　　return true; 
　　} 
　　 
　　/** 
　　@desc 在购物车里增加一个产品，增加成功返回真，否则返回假 
　　@return bool 
　　*/ 
　　this.addPro=function(typeName,proName,value){ 
　　　　var typePoint=this.getTypePoint(typeName);　　　　　　if ( typePoint ==-1 ) return false;　　　　//没有此类别，无法增加，返回假 
　　　　var proPoint =this.getProPoint(typePoint,proName);　　if ( proPoint != -1 ) return false;　　　　//有此产品了，无法增加重复，返回假 
　　　　this.carDatas[typePoint].value.push(new this.proObj(proName,value));　　//push到自身数组 
　　　　this.saveCookie();　　//存入 Cookie 
　　　　return true; 
　　} 
　　 
　　/** 
　　@desc 修改购物车里的产品属性 
　　@return bool 
　　*/ 
　　this.editPro=function(typeName,proName,value){ 
　　　　var typePoint=this.getTypePoint(typeName);　　　　　　if ( typePoint == -1 ) return false;　　//没有此类别，无法修改，返回假 
　　　　var proPoint =this.getProPoint(typePoint,proName);　　if ( proPoint == -1 ) return false;　　//没有此产品，无法修改，返回假 
　　　　this.carDatas[typePoint].value[proPoint].value=value;　　　　　　　　　　　　　　//更新自身  
　　　　this.saveCookie();　　//存入 Cookie 
　　　　return true; 
　　} 
　　 
　　/** 
　　@desc 删除一个产品 
　　@return bool 
　　*/ 
　　this.delPro=function(typeName,proName){ 
　　　　var typePoint=this.getTypePoint(typeName);　　　　　　if ( typePoint == -1 ) return false;　　//没有此类别，无法删除，返回假 
　　　　var proPoint =this.getProPoint(typePoint,proName);　　if ( proPoint == -1 ) return false;　　//没有此产品，无法删除，返回假 
　　　　var pros=this.carDatas[typePoint].value.length; 
　　　　this.carDatas[typePoint].value[proPoint] = this.carDatas[typePoint].value[pros-1];　　//最后一个产品放置要删除的产品上 
　　　　this.carDatas[typePoint].value.pop(); 
　　　　this.saveCookie();　　//存入 Cookie 
　　　　return true; 
　　} 
　　 
　　/** 
　　@desc 删除一个类别 
　　@return bool 
　　*/ 
　　this.delType=function(typeName){ 
　　　　var typePoint=this.getTypePoint(typeName);　　if ( typePoint == -1 ) return false;　　//没有此类别，无法删除，返回假 
　　　　var types=this.carDatas.length; 
　　　　this.carDatas[typePoint] = this.carDatas[types-1];　　　　　　　　　　　　//删除类别 
　　　　this.carDatas.pop(); 
　　　　this.saveCookie();　　//存入 Cookie 
　　　　return true; 
　　} 
　　 
　　/** 
　　@desc 删除此购物车 
　　@return void 
　　*/ 
　　this.delCar=function(){ 
　　　　this.cookie.setCookie(this.carName,'',0); 
　　　　this.carDatas=new Array(); 
　　　　this.saveCookie();　　//存入 Cookie 
　　} 
　　 
　　/** 
　　@desc 获得购物车数据 
　　@return Array 
　　*/ 
　　this.getCar=function(){ 
　　　　return this.carDatas; 
　　} 
　　 
　　/** 
　　@desc 获得类别列表 
　　@return Array 
　　*/ 
　　this.getType=function(){ 
　　　　var returnarr=new Array(); 
　　　　for ( i=0; i<this.carDatas.length; i++)　　　　returnarr.push(this.carDatas[i].name); 
　　　　return returnarr; 
　　} 
　　 
　　/** 
　　@desc 获得类别下的产品列表 
　　@return Array 
　　*/ 
　　this.getPro=function(typeName){ 
　　　　var typePoint=this.getTypePoint(typeName);　　if ( typePoint == -1 ) return false;　　//没有此类别，返回假 
　　　　return this.carDatas[typePoint].value; 
　　} 
　　 
　　/** 
　　@desc 获得商品属性 
　　@return String 
　　*/ 
　　this.getProVal=function(typeName,proName){ 
　　　　var typePoint=this.getTypePoint(typeName);　　　　　　if ( typePoint == -1 ) return false;　　//没有此类别，返回假 
　　　　var proPoint =this.getProPoint(typePoint,proName);　　if ( proPoint == -1 ) return false;　　//没有此产品，返回假 
　　　　return this.carDatas[typePoint].value[proPoint].value; 
　　} 
} 