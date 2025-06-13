<template lang="pug">
.page-login
  Dropdown.locale(trigger="click")
    a(href="javascript:void(0)") {{lang[$i18n.locale]}}
      Icon(type="ios-arrow-down")
    DropdownMenu(slot="list")
      DropdownItem(@click.native="setLocale('zh-cn')") 中文
      DropdownItem(@click.native="setLocale('en-us')") English
  .loginBox
    .logo
      <!-- img(src="../../assets/logo.png" width="40px") -->
      .text {{$lang('欢迎登录')}}
      p 小鸽管理平台 
    Form(ref="formValidate", :model="formItem", :rules="ruleValidate")
      FormItem(:label="$lang('账号')" prop="username")
        Input(@on-enter="submit" v-model="formItem.username" prefix="md-person" , :placeholder="$lang('请输入',$lang('账号'))")
      FormItem(:label="$lang('密码')" prop="password")
        Input(@on-enter="submit" v-model="formItem.password" type="password" prefix="md-lock", :placeholder="$lang('请输入',$lang('密码'))")
      <!-- FormItem(:label="$lang('谷歌验证码')" prop="google_code")
        Input(@on-enter="submit" v-model="formItem.google_code" prefix="logo-google", :placeholder="$lang('请输入',$lang('谷歌验证码'))") -->
      FormItem
        Button(type="primary" @click="submit" long ghost icon="md-send") {{$lang('登录')}}
  Modal(v-model="codeStatus", title="绑定Google身份验证器")
      div(class="center")
        p 使用'Google Authenticator(身份验证器)'扫描下方二维码
        VueQr(:text="googleSecretURL" qid="qid" v-if="googleSecretURL")
        p 输入谷歌验证码完成认证
        div(style="width:200px;margin-top:10px")
         Input(@on-enter="onBindCode" v-model="formItem.google_code" prefix="logo-google", :placeholder="$lang('请输入',$lang('谷歌验证码'))")
      template(#footer)
        Button(type="primary" @click="onBindCode" long ghost icon="md-send") 确认   
   
</template>
<script>
import VueQr from "vue-qr";
import fingerprint from "../../common/js/fingerprint.js"
export default {
  components: { VueQr },
  data() {
    return {
      loading: false,
      codeStatus: false,
      googleSecretURL: "",
      google_secret: "",
      formItem: {
        username: "",
        password: "",
        google_code: "",
      },
      ruleValidate: {
        username: [
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error(this.$lang("请输入", this.$lang("账号"))));
              } /*else if (!/^[^@]{1,}@[^\.]{1,}\.[^\.0-9]{1,}$/.test(value)) {
                callback(new Error(this.$lang("账号不正确")));
              }*/
              callback();
            },
            trigger: "blur",
          },
        ],

        password: [
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error(this.$lang("请输入", this.$lang("密码"))));
              }
              callback();
            },
            trigger: "blur",
          },
        ],
      },
    };
  },
  created(){
    fingerprint()
  },
  computed: {
    lang() {
      return this.$store.state.lang;
    },
  },
  methods: {
    setLocale(lang) {
      this.$store.commit("setLocale", lang);
    },
    submit() {
      this.$refs["formValidate"].validate((valid) => {
        if (valid) {
          this.loading = true;
          const username = this.formItem.username;
          const password = this.formItem.password;
          const google_code = Number(this.formItem.google_code);
          this.$axios
            .post("/api/v1/user/login", { username, password, google_code })
            .then((result) => {
              this.loading = false;
              if (result.code === 10000) {
                let redirectUrl = sessionStorage.redirectUrl;
                if (redirectUrl) {
                  sessionStorage.removeItem("redirectUrl");
                } else {
                  redirectUrl = "/";
                }
                location.href = redirectUrl;
                this.$store.commit("setUserName", result.data);
              }
              if (result.code === 10003) {
                this.getGoogleSecret();
              }
            });
        }
      });
    },
    getGoogleSecret() {
      this.$axios.get("/api/v1/user/new_google_secret").then((result) => {
        this.googleSecretURL = `otpauth://totp/wallet-${this.formItem.username}?secret=${result.data}`;
        this.google_secret = result.data;
        this.codeStatus = true;
      });
    },
    onBindCode() {
      this.$refs["formValidate"].validate((valid) => {
        if (valid) {
          this.loading = true;
          const username = this.formItem.username;
          const password = this.formItem.password;
          const google_code = Number(this.formItem.google_code);
          const google_secret = this.google_secret;
          this.$axios
            .post("/api/v1/user/bind_google_code", {
              username,
              password,
              google_code,
              google_secret,
            })
            .then((result) => {
              this.loading = false;
              if (result.code === 10000) {
                let redirectUrl = sessionStorage.redirectUrl;
                if (redirectUrl) {
                  sessionStorage.removeItem("redirectUrl");
                } else {
                  redirectUrl = "/";
                }
                location.href = redirectUrl;
                this.$store.commit("setUserName", result.data);
              }
              if (result.code === 10003) {
                this.codeStatus = true;
              }
            });
        }
      });
    },
    gitLogin() {
      this.uuid();
      let username = this.formItem.username;
      if (username == "") {
        this.uuid();
        username = this.text;
      }
      location.href =
        process.env.VUE_APP_HOST +
        "/oauth/authorize?client_id=" +
        process.env.VUE_APP_CLIENT_ID +
        "&redirect_uri=" +
        process.env.VUE_APP_REDIRECT_URI +
        "&response_type=token&state=" +
        username +
        "&scope=read_user";
    },
    uuid() {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";

      var uuid = s.join("");
      this.text = uuid;
    },
  },
};
</script>
<style lang="less" scoped>
.center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 350px;
  p {
    font-size: 14px;
    font-weight: 600;
  }
}
</style>
