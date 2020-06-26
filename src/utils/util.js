//时间格式化
export function dateFormat(timeObject = new Date(),type="yyyy-MM-dd")  
{  

    function format(timeObj,fmt){
            var o = {  
                "M+" : timeObj.getMonth()+1,         //月份  
                "d+" : timeObj.getDate(),          //日  
                "h+" : timeObj.getHours(),          //小时  
                "m+" : timeObj.getMinutes(),         //分  
                "s+" : timeObj.getSeconds(),         //秒  
                "q+" : Math.floor((timeObj.getMonth()+3)/3), //季度  
                "S" : timeObj.getMilliseconds()       //毫秒  
            };
            if(/(y+)/.test(fmt))
            {
                fmt=fmt.replace(RegExp.$1, (timeObj.getFullYear()+"").substr(4 - RegExp.$1.length));  
            }  
            
            for(var k in o){
                if(new RegExp("("+ k +")").test(fmt))
                {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));  
                }  
            }  
            return fmt;  
    }

    if(type == 'yyyy-MM-dd')
    {
        return format(timeObject,"yyyy-MM-dd");
    }else if(type == 'yyyy-MM-dd hh:mm'){
        return format(timeObject,"yyyy-MM-dd hh:mm");
    }
} 



//防抖  立即执行等延迟后，才能重新触发  immediate参数来设置是否要立即执行 
export function debouce(func, delay, immediate) {
    var timer = null;
    return function () {
        var context = this;
        var args = arguments;
        if (timer) clearTimeout(time);
        if (immediate) {
            //根据距离上次触发操作的时间是否到达delay来决定是否要现在执行函数
            var doNow = !timer;
            //每一次都重新设置timer，就是要保证每一次执行的至少delay秒后才可以执行
            timer = setTimeout(function () {
              timer = null;
            }, delay);
            //立即执行
            if (doNow) {
              func.apply(context, args);
            }
        } else {
            timer = setTimeout(function () {
                func.apply(context, args);
            }, delay);
        }
    }
}

/**
 * 数组内对象去重
 * @param {array} array - 数组
 * @param {string} attr - 根据某属性去重， 如id
 */
export function uniqueByAttr(array, attr) {
    let result = [];
    let obj = {};
    result = array.reduce((cur, next) => {
        obj[next[attr]] ? "" : obj[next[attr]] = true && cur.push(next);
        return cur;
    },[]);
    return result;
}

// 判断一个数组中是否包含了自己，添加不存在的下拉列表
export function addArrToOptions(arr, aKey, aLabel, options, okey, oLabel){ // type为check 只是检测
    let list = options && options.length?options:[];
    if(arr && arr.length){
        for(let i=0; i<arr.length; i++){
            if(!checkOptionHasArr(arr[i][aKey], list, okey)){
                list.push({ [oLabel]: arr[i][aLabel]?arr[i][aLabel]:'--', [okey]:arr[i][aKey]})
            }
        }
    }
    return list;
}

// 编辑的时候，判断下拉选项是否还存在之前的值，没有的话，去掉已经选中的那些值
export function removeDeleteArr(arr, aKey,  options, okey){ // type为check 只是检测
    let list = [];
    if(arr && arr.length){
        list = arr.filter((item)=>{ return checkOptionHasArr(item[aKey], options, okey)})
    }
    return list;
}

export function checkOptionHasArr(id, options, key){ // 检测options中是否存在id
    let result = false; // options中不存在
    if(options && options.length){
        for(let i=0; i<options.length; i++){
            if(id === options[i][key]){
                result = true;
                break;
            }
        }
    }
    return result;
}

export function chagneMultipleSelect(item, selectOptions, optionKey, optionName, lastSelectLength, isGetText = false) {
    // 多选时，点击多选，全部选中，点击其它则选中其它
    // item 为change传的item, selectOptions下拉框列列表; optionKey为下拉框取key值; optionName为下拉框取label值
    // resultIds是过滤空的id集合， text传给后端
    let selectIds = []; // 绑定v-model选中的selectIds
    let texts = []; // 获取文本
    let resultIds = []; // 去除空格的id，主要传给后端
    let hasAll = false;
    if(item && item.length) {
        for (let i = 0; i < item.length; i++) {
            if (item[i] === " ") {
                hasAll = true;
                break
            }
        }
        if(item[item.length - 1] === " ") { // 最后点击一个是全部(如果是两个的时候，取消另外一个，只剩下空值)
            if (lastSelectLength < item.length) {
              selectOptions && selectOptions.forEach((sub) => {
                selectIds.push(sub[optionKey]);
                resultIds.push(sub[optionKey]);
              })
              selectIds.unshift(" ");
            }
        } else if (item.length == selectOptions.length) {
            if (lastSelectLength < item.length) { // 全选选中，全部取消直接返回来空数组
              resultIds = JSON.parse(JSON.stringify(item));
              selectIds = JSON.parse(JSON.stringify(item))
              selectIds.unshift(" ");
            } else if(hasAll) { // 点击其中一个取消全选
              selectIds = item.filter((sub) => {
                return sub !== " "
              })
              resultIds = JSON.parse(JSON.stringify(selectIds));
            }
        } else if(item.length < selectOptions.length) {
            selectIds = JSON.parse(JSON.stringify(item));
            resultIds = JSON.parse(JSON.stringify(item));
        }
    }
    if (isGetText) { // 获取对应的文本
        if(selectIds.length == selectOptions.length + 1) {
            texts = ['全部']
        } else {
            selectOptions.forEach((sub) => {
                if(resultIds.index(sub[optionKey]) > -1) {
                    texts.push(sub[optionName])
                }
            })
        }
    }
    // selectId 为v-model 绑定的id
    return {
        'selectIds': selectIds,
        "resultIds": resultIds,
        'texts': texts,
        'lastSelectLength': selectIds.length
    }
}
