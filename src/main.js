import App from "./app.vue";
import components from "./components";
import router from "./router";
import Vue from "vue";
import VueI18n from "vue-i18n";
import iView from "iview";
import store from "./store";
import cookie from "./libs/common";
import en from "iview/dist/locale/en-US";
import zh from "iview/dist/locale/zh-CN";
import "./libs/common.less";
import axios from "axios";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import fingerprint from "./common/js/fingerprint";
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

Vue.use(ElementUI);
Vue.use(VueI18n);
Vue.use(iView, {
  transfer: true,
  size: "large",
});

Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999
  }
})

Vue.locale = () => { };

let i18n;
i18n = new VueI18n({
  silentTranslationWarn: true,
  locale: cookie("locale") === "zh-cn" ? "zh-cn" : "en-us", // 语言标识

  //this.$i18n.locale // 通过切换locale的值来实现语言切换
  messages: {
    "zh-cn": Object.assign(require("./locale/zh"), zh), // 中文语言包
    "en-us": Object.assign(require("./locale/en"), en), // 英文语言包
  },
});

Object.keys(components).forEach((key) => {
  Vue.component(key, components[key]);
});

document.setTitle = function (title) {
  document.title = title;
};

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  if (response.data.code === 10002) {
    if (!/\/login/.test(location.href)) {
      sessionStorage.setItem("redirectUrl", location.href);
    }
    location.href = "/login";
  } else if (response.data.code === 10001) {
    vm.$Message.error(response.data.msg);
  }
  return response.data;
});

// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    fingerprint();
    if (localStorage) {
      if (localStorage.getItem("canvas-hash")) {
        config.headers["canvas-hash"] = localStorage.getItem("canvas-hash");
      }
      if (localStorage.getItem("fingerprint-hash")) {
        config.headers["fingerprint-hash"] = localStorage.getItem("fingerprint-hash");
      }
      if (localStorage.getItem("platform")) {
        config.headers["platform"] = localStorage.getItem("platform");
      }
      if (localStorage.getItem("timezone")) {
        config.headers["timezone"] = localStorage.getItem("timezone");
      }
      if (localStorage.getItem("timezone-offset")) {
        config.headers["timezone-offset"] = localStorage.getItem("timezone-offset");
      }
      if (localStorage.getItem("screen-resolution")) {
        config.headers["screen-resolution"] = localStorage.getItem("screen-resolution");
      }
      if (localStorage.getItem("webgl-vendor-and-renderer")) {
        config.headers["webgl-vendor-and-renderer"] = localStorage.getItem("webgl-vendor-and-renderer");
      }
      if (localStorage.getItem("fingerprint-hash")) {
        config.headers["fingerprint-hash"] = localStorage.getItem("fingerprint-hash");
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.defaults.transformRequest = [
  function (data) {
    return JSON.stringify(data);
  },
];
axios.defaults.responseType = "json";
axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
axios.defaults.headers.put["Content-Type"] = "application/json;charset=UTF-8";
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
window.___version = `v2021.3.2.${process.env.VUE_APP_BASE_URL}`;

Object.defineProperty(Vue.prototype, "$lang", {
  value(name, text) {
    return this.$t(`default['${name}']`, {
      text,
    });
  },
});

Vue.prototype.$axios = axios;

let vm = new Vue({
  el: "#app",
  router,
  i18n,
  store,
  render: (h) => h(App),
});

// 放在axios下面
