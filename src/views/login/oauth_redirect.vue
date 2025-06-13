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
      img(src="../../assets/logo.png")
      .text {{$lang('正在登录')}}
      p {{$lang('SaaS管理平台')}}




</template>
<script>
    export default {
        //在这里调用ajax请求方法
        data() {
            return {
                requestDataForm: {
                    code: "",
                    state: "",
                    access_token: "",
                    token_type: "",
                    expires_in: 0,
                },
            }
        },
        created() {
            this.convert();
        },
        computed: {
            lang() {
                return this.$store.state.lang;
            }
        },
        methods: {

            convert: function () {
                this.loading = true;
                var paras = this.getUrlKey();
                this.requestDataForm.access_token = paras.access_token
                this.requestDataForm.state = paras.state
                this.requestDataForm.token_type= paras.token_type
                this.requestDataForm.expires_in= paras.expires_in

                this.$axios.get("/api/v1/oauth/redirect", {params: this.requestDataForm}).then(result => {
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
                });
            },
            getUrlKey: function () {
                var url = window.location.href;
                var url1 = url.replace("#", "&");
                var url2 = url1.replace("?", "&")
                var cs_arr = url2.split('&');
                //var cs = dz_url.split('?')[1];
                //var cs_arr = cs.split('&');
                var paras = {};
                for (var i = 0; i < cs_arr.length; i++) {
                    var keyValues = cs_arr[i].split('=')
                    if (keyValues.length == 2) {
                        paras[keyValues[0]] = keyValues[1]
                    }
                }

                return paras
            },
        },

    }
</script>
