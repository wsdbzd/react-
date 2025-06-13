import Fingerprint2 from "fingerprintjs2";
import cookie from "../../libs/common";

export default async function () {
  return new Promise((resolve,reject)=>{ 
    Fingerprint2.get(function (components) {
        let canvasHash = ""  //Canvas 绘图指纹
        let platform = ""  //运行浏览器的操作系统和(或)硬件平台
        let timezone = "" //时区
        let timezoneOffset = "" //本地时间与 GMT 时间之间的时间差，以分钟为单位
        let screenResolution = "" //当前屏幕分辨率
        let webglVendorAndRenderer = "" //具有大量熵的WebGL指纹的子集
        const values = components.map(function (component, index) {
          if (index === 0) {
            //把微信浏览器里UA的wifi或4G等网络替换成空,不然切换网络会ID不一样
            return component.value.replace(/\bNetType\/\w+\b/, "");
          }
          if (component.key == "canvas" && component.value.length == 2){
            canvasHash = Fingerprint2.x64hash128(component.value[1], 31); // 选择Canvas指纹  
          }
          
          if (component.key == "platform"){
            platform = component.value
          }

          if (component.key == "timezone"){
            timezone = component.value
          }
          
          if (component.key == "timezoneOffset"){
            timezoneOffset = component.value
          }

          if (component.key == "webglVendorAndRenderer"){
            webglVendorAndRenderer = component.value
          }

          if (component.key == "screenResolution"){
            screenResolution = component.value
          }

          return component.value;
        });
    
        // 生成最终id fingerprint
        const fingerprint = Fingerprint2.x64hash128(values.join(""), 31);
        
        localStorage.setItem('platform', platform)
        localStorage.setItem('canvas-hash', canvasHash);
        localStorage.setItem('fingerprint-hash', fingerprint);
        
        localStorage.setItem('timezone', timezone)
        localStorage.setItem('timezone-offset', timezoneOffset);
        localStorage.setItem('screen-resolution', screenResolution);
        localStorage.setItem('webgl-vendor-and-renderer', webglVendorAndRenderer);

        resolve(fingerprint);
      })
    });
}
