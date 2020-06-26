import { hasArrContent } from './handleResponse'
// 获取用户一些方法
export function getUserInfo(){
  return localStorage.getItem("userInfo") || '';
}

export function getUserName(){
  var userInfo = getUserInfo();
  if(userInfo){
    userInfo = JSON.parse(userInfo);
    return userInfo.username || '';
  }
  return '';
}

export function getAuthorization() {
  var userInfo = getUserInfo();
  if (userInfo) {
    userInfo = JSON.parse(userInfo);
    return userInfo.authorization || '';
  }
  return '';
}

export function getStorageLoginType(){
  let type = '';
  let userInfo = localStorage.getItem('userInfo');
  if(userInfo){
    userInfo = JSON.parse(userInfo);
    type = userInfo.loginType;
  }
  return type
}

export function checkPermision(data){ // 把check为false的菜单删除
  for(let i=data.length-1; i > -1; i--){
    if(!data[i].checked){
      data.splice(i, 1);
    }else if(data[i].checked && data[i].child && data[i].child.length){
      checkPermision(data[i].child)
    }
  }
}
export function getAllMenu(permissions) { // 获取所有菜单
  let loginType = ''; // 
  let tree = JSON.parse(JSON.stringify(permissions));
  if(tree && tree.length){
    for(var i=0; i<tree.length; i++){
      if(tree[i].name == '工作台' && tree[i].checked && tree[i].child && tree[i].child.length){ 
        for(var j=0; j< tree[i].child.length; j++){
          if(tree[i].child[j].checked){
            loginType = tree[i].child[j].url; // 设置url路径上的
            break;
          }
        }
        delete tree[i].child;
        break;
      }
    }
    checkPermision(tree); // 去掉非checked菜单
  }else {
    tree=[]
  }
  return {'type': loginType, 'menu': tree}
}

export function getAllMenuPath(menu){
  let menuObj={};
  getMenuPath(menu, menuObj)
  return menuObj;
}

export function getMenuPath(menu, obj){
  if(menu && menu.length){
    for(let i=0; i<menu.length; i++){
      if(menu[i].child && menu[i].child.length){
        getMenuPath(menu[i].child, obj)
      }else {
        obj['/'+menu[i].url] = menu[i].name; 
      }
    }
  }
}

// 获取路径
export function getHashPath(){
  let hash = window.location.hash;
  if(hash.indexOf('?') > -1){
    hash = hash.substring(0, hash.indexOf('?'))
  }
  return hash.split('/');
}

// 获取当前是哪个模块的一级菜单
export function getFirstMenu(){
  let hash = getHashPath();
  if (hash && hash[1]) {
    return hash[1];
  }
  return ''
}

// 通过头部的菜单，获取左侧子菜单
export function getSubMenu(){
  let name = getFirstMenu(); // 获取一级菜单
  let headerMenu = localStorage.getItem("headerMenu"); 
  if(name && headerMenu){
    headerMenu = JSON.parse(headerMenu);
    for(let i=0; i < headerMenu.length; i++){
      if(name == headerMenu[i].url){
        if(headerMenu[i].child && headerMenu[i].child.length){
          return headerMenu[i].child;
        }
        break;
      }
    }
  }
  return []
}

// 获取当前url对应个菜单
export function menuPath(n=3) { // 取两层还是取三层菜单, 默认三层菜单的长度

  let hash = getHashPath();
  let arr = [];
  if (hash && hash.length) {
    for (let i = 1; i <= n; i++) { // 有三级菜单，取三级，没有就二级菜单
      if (hash[i]) {
        arr.push(hash[i])
      }
    }
  }
  return arr;
}

// 判断此菜单是否存在, 尝试过用递归，好像return不回来
export function isExistMenu(path){ 
  let headerMenu = localStorage.getItem("headerMenu");
  if(path && headerMenu) {
    headerMenu = JSON.parse(headerMenu);
    for (let i = 0; i < headerMenu.length; i++) {
      if(hasArrContent(headerMenu[i].child)) {
        for(let j=0; j < headerMenu[i].child.length; j++){
          if(hasArrContent(headerMenu[i].child[j].child)){
            for(let z=0; z<headerMenu[i].child[j].child.length; z++){
              if(path == headerMenu[i].child[j].child[z].url){
                return true;
              }
            }
          }else if(path == headerMenu[i].child[j].url){
            return true;
          }
        }
      }else if(path == headerMenu[i].url){
        return true;
      }
    }
  }
  return false;
}

// 获取所有菜单的path
export function getAllPath(){
  let obj = {};
  let headerMenu = localStorage.getItem("headerMenu");
  if(headerMenu){
    headerMenu = JSON.parse(headerMenu);
    for (let i = 0; i < headerMenu.length; i++) {
      if(hasArrContent(headerMenu[i].child)) {
        for(let j=0; j < headerMenu[i].child.length; j++){
          if(hasArrContent(headerMenu[i].child[j].child)){
            for(let z=0; z<headerMenu[i].child[j].child.length; z++){
              obj[headerMenu[i].child[j].child[z].url] = headerMenu[i].child[j].child[z];
            }
          }else{
            obj[headerMenu[i].child[j].url] = headerMenu[i].child[j];
          }
        }
      }else {
        obj[headerMenu[i].url] = headerMenu[i];
      }
    }
  }
  return obj;
}




