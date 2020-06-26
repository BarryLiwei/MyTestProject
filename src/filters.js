// 全局的一些过滤器
import Vue from 'vue';

//超长字符串显示省略号
Vue.filter('strLimitTo', function (value, num) {
    if (num < 1) num = 20;
    if (!value) return '';
    value = value.toString();
    return value.length > num ? value.slice(0, num) + '...' : value;
});

// 过滤时间
Vue.filter('dateFilter', function (value, format = 'YYYY-MM-DD HH:mm:ss') {
  return moment(value).format(format)
})

// 过滤空格
Vue.filter("filterBlank", function(value, agr) {
    let val = String(value).replace(/(^\s*)|(\s*$)/g, "");
    if (val == "" || val == "null" ||  val == "undefined") { 
        return "--";
    } else {
        return value;
    }
})

// 时间日期 分隔符自定义
Vue.filter("normalTime", function (value, Separator='至') {
  if (value && value[0] && value[1]) {
    return `${value[0]} ${Separator} ${value[1]}`
  }
});


//select下拉过滤，只符合单选， options为下拉数组，key为匹配每个对象的属性, value为每个对象需要返回值的属性， currentVal为绑定v-model的值
Vue.filter("getOptionsValue", function (options, key, value, currentValue) {
  for (var i = 0; i < options.length; i++) {
    if (options[i][key] === currentValue) {
      return options[i][value]
    }
  }
})

// 满足select下拉满足单选/多选;  options为下拉数组; key为匹配每个对象的属性, value为每个对象需要返回值的属性，  selectIsAll 为单选下拉是否有全部的选项，
// 此组件可能还有些覆盖不了，到时候灵活运用，不行重新写一个
Vue.filter("selectGetTitle", function (options, key, value, currentVal, selectIsAll = false) {
  let str = [];
  let copyCurrentVal = []; // 把单选/多选 选中的值都同意转为数组形式
  if (currentVal instanceof Array) { // select多选，选择全部返回来的currentVal为：['']，一个不选返回来[]
    copyCurrentVal = JSON.parse(JSON.stringify(currentVal));
  } else {
    if (currentVal === '' && selectIsAll) { // select 单选, 有下拉全部选项
      copyCurrentVal.push(currentVal)
    } else if (currentVal !== '' && currentVal !== null && currentVal !== undefined) { // select 单选, 没有下拉全部选项
      copyCurrentVal.push(currentVal);
    }
  }
  if (copyCurrentVal && copyCurrentVal.length) {
    for (var i = 0; i < copyCurrentVal.length; i++) {
      if (copyCurrentVal[i] === '') { // 如果数组中有[''],就表示取全部
        str = ['全部'];
        break;
      } else {
        for (var j = 0; j < options.length; j++) {
          if (options[j][key] === copyCurrentVal[i]) {
            str.push(options[j][value]);
            break;
          }
        }
      }
    }
  }
  return str.length ? str.join('、') : ''
})


// 时间日期 分隔符自定义
Vue.filter("changePwd", function (value) {
  let text='';
  if(value && value.length){
    for(let i=0; i<value.length; i++){
      text = text + "."
    }
  }
  return text;
});