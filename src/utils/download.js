import moment from 'moment'
// 下载的函数集合
export function getBase64Image(img) { // 获取base64图片转化为 url， 裁剪功能后传给后端的url
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, img.width, img.height);
  var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
  var dataURL = canvas.toDataURL("image/" + ext);
  return dataURL;
}

export function downloadBase64Img(url, imgName, ext) { // 下载base64图片
  let blob = convertBase64UrlToBlob(url, ext);
  let downloadValue = `${imgName}.${ext}`;
  downloadBlobFn(blob, downloadValue); // 下载执行
}

// let the_blob = downloadService.convertBase64UrlToBlob(canvas[0].toDataURL(), 'png'); // 转换为blob对象,第一个参数为dataUrl,第一个为格式
export function convertBase64UrlToBlob(urlData, ext) { // base64转blob, 
  let bytes = window.atob(urlData.split(",")[1]);
  let ab = new ArrayBuffer(bytes.length);
  let ia = new Uint8Array(ab);
  let i = 0;
  for (i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  return new Blob([ab], {
    type: `image/${ext}`
  });
}

export function downloadBlobFn(blob, downloadValue) { // blob 格式下载
  const a = document.createElement("a");
  a.href = window.URL.createObjectURL(blob);
  a.download = downloadValue; // downloadValue为下载文件的名字，在函数外处理好再传传进来
  a.textContent = "export data";
  a.style.textIndent = "-1000px";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function downloadUrlFn(url, downloadValue) { // url 格式下载
  var a = document.createElement("a");
  a.href = url;
  a.download = downloadValue; // downloadValue为下载文件的名字，在函数外处理好再传传进来
  a.textContent = "export data";
  a.style.textIndent = "-1000px";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function downloadFileDeal(item, url_attr = 'url', callback) { // 文件格式处理 item 传进来的格式，url_attr是对象那个属性是url
  if (!item || (item && typeof item != 'object')) {
    if (typeof callback === 'function') {
      callback('没有该信息');
    }
    return;
  }
  const url = item[url_attr] ? item[url_attr] : '';
  let fileName, ext;
  if (url) {
    fileName = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("."));
    ext = url.substring(url.lastIndexOf(".") + 1);
  }
  if ("jpg/jpeg/gif/png/bmp".indexOf(ext) > -1) { // 裁剪功能后下载的图片
    var image = new Image();
    image.crossOrigin = "";
    image.src = url;
    let url2 = getBase64Image(image); // 取不到宽
    setTimeout(() => {
      url2 = getBase64Image(image); // 重新取图片的宽度
      downloadBase64Img(url2, fileName, ext);
    }, 500);
  } else {
    // 非图片
    downloadUrlFn(url, `${fileName}.${ext}`);
  }

}

export function downloadPoster(item, url_attr = 'url', callback) { // 下载海报
  if (!item || (item && typeof item != 'object')) {
    if (typeof callback === 'function') {
      callback('没有该信息');
    }
    return;
  }
  const url = item[url_attr] ? item[url_attr] : '';
  let fileName, ext;
  if (url) {
    fileName = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("."));
    ext = url.substring(url.lastIndexOf(".") + 1);
  }
  
  downloadUrlFn(url, `${fileName}.${ext}`);
}

// 裁剪后把dataUrl 转为file对象 
// let file = dataURLtoFile(dataUrl,arr[arr.length-1]); // 第一个参数dateUrl, 第二个文件名 转为file 文件  IE不支持file对象
export function dataURLtoFile(dataurl, filename) {
  let arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, {
    type: mime
  })
}