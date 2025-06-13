<template lang="pug">
    Main.page-exchange 
        Form(:model='fromData', :label-width='100')
            FormItem(:label='$lang("用户名")' style="width:400px" )
                Input(v-model='username', :placeholder="$lang('请输入',$lang('用户名'))" disabled)
            FormItem(:label='$lang("当前密码")' style="width:400px" )
                Input(v-model='fromData.password', type="password", :placeholder="$lang('请输入',$lang('当前密码'))")
            FormItem(:label='$lang("修改密码")' style="width:400px" )
                Input(v-model='fromData.reset_password', type="password", :placeholder="$lang('请输入',$lang('修改密码'))")
            Button(type="primary" @click="onVerifyParam" style="width:400px" long) {{$lang('确认修改')}}
        Modal(v-model="submitStatus" :title="$lang('修改密码')" @on-ok="onSubmit")
           Alert {{$lang("您确定执行此操作吗？")}}
</template>
    <style lang="less">
    @import "../../libs/mixin";
    .username{
      font-size: 16px;
      margin-bottom: 0px;
    }
    </style>
    <script>
    export default {
      prop: {},
      data() {
        return {
            fromData:{
                password:"",
                reset_password:"",
            },
            submitStatus: false
        };
      },
      created() {
      },
      watch: {
        close() {
          localStorage.menuStatus = this.close;
        },
      },
      methods: {
        onVerifyParam(){
          if (this.username === "" ||this.fromData.password === "" || this.fromData.reset_password === "") {
            this.$Message.warning(this.$lang("用户名密码不能为空"));
            return   
          }
          this.submitStatus = true
        },
        onSubmit(){
          this.$axios
            .post("/api/v1/update_pwd", {
              username: this.username,
              password: this.fromData.password,
              reset_password: this.fromData.reset_password
            })
            .then((result) => {
              if (result.code === 10000) {
                this.fromData = {
                password:"",
                reset_password:"",
                }
                localStorage.clear();
                this.$axios.post("/api/v1/user/logout").then(() => location.reload());
              }else{
                this.$Message.warning("修改密码失败,",result.msg);
              }
            })
        }
      },
      computed: {
        username() {
          return this.$store.state.username;
       },
      },
    };
    </script>
    