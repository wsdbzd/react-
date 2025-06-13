import Vue from "vue";
import Vuex from "vuex";
import cookie from "@/libs/common";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    lang: {
      'zh-cn': "中文",
      'en-us': "English"
    },
    username: "",
    orgName:"",
    auth_ids:[]
  },
  getters:{
    auth_ids: state => state.auth_ids
  },
  mutations: {
    setUserName(state, payload) {
      state.username = payload.username;
      state.orgName = payload.orgName;
    },
    setLocale(state, lang){
      cookie("locale", lang, { path: "/", day: 3000 });
      location.reload();
    },
    SET_AUTHIDS:(state,ids)=>{
      state.auth_ids = ids
    }
  },
  actions:{
    async getAuthIds({commit}){
      return new Promise((resolve,reject)=>{
        axios.get("/api/v1/auth_path").then(result => {
          // console.log("getAuthIds", result)
          if (result.code === 10000) {
            resolve(result.data)
            commit('SET_AUTHIDS',result.data)
          }else(
            reject(result.data)
          )
        }).catch(err=>{
          reject(err)
          if (location.href.indexOf("/404") === -1){
            location.href = "/404"
          }
        });
    })
    }
}
});
