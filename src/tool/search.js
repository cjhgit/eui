/**
 * 根据 key 获取 url 后参数中的value
 * 返回参数中 key 对应的 value
 */
function euiSearch(key) {
    var res;

    var search = location.search;
    if (search) {
        search = search.substr(1);
        if (search) {
            var params = search.split('&');
            for (var i = 0; i < params.length; i++) {
                var keyValue = params[i].split('=');
                if (keyValue && keyValue[0] == key) {
                    res = keyValue[1];
                }
            }
        }
    }
    return res;
}