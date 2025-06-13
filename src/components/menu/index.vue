<template lang="pug">
.v-side-wrap
  .v-side(:class="{'v-sideClose':close}")
    .logo
      <!-- img(src="./logo.png") -->
    .menu
      ul
        li.user
          a.master(:class="{'master-open':user}" @click="show")
            Avatar(style="color:#f56a00;background-color:#fff;") {{username.toLocaleUpperCase()[0]}}
            span.text {{username}}
            b
          div.sub-menu(:style="userStyle")
            div(ref="userStatus")
              a.salver(@click="resetPassword" v-if="showUpdatePwd")
                span {{$lang('修改密码')[0]}}
                | {{$lang('修改密码')}}
              a.salver(@click="logout")
                span {{$lang('退出登录')[0]}}
                | {{$lang('退出登录')}}
                
        li(v-for="(item,index) in list")
          a.master(:to="item.link", :class="{'master-open':item.open,'master-current':index==currentIndex}" @click.prevent='switchMenu(index)' v-if="item.children", :title="$lang(item.name)")
            Icon(:type="item.type")
            span.text {{item.name}}
            b
          router-link.master(:to="item.link", :class="{'master-open':item.open,'master-current':index==currentIndex}" @click='switchMenu(index)' v-else , :title="$lang(item.name)")
            Icon(:type="item.type")
            span.text {{item.name}}
            b
          div.sub-menu(:style="objStyle(item,index)")
            div(:ref="item.name" v-if="item.children")
              router-link.salver(:to="_item.link" v-for="_item in item.children", :key="_item.id", :title="$lang(_item.name)")
                span {{_item.name[0]}}
                | {{_item.name}}
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      height: 0,
      user: false,
      close: false,
      showUpdatePwd: false,
    };
  },
  methods: {
    resetPassword() {
      location.href = "/update_pwd";
    },
    show() {
      this.user = !this.user;
      this.height = this.$refs["userStatus"].offsetHeight;
    },
    objStyle(item, index) {
      if (item.open) {
        if (this.$refs[item.name]) {
          return {
            height: `${this.$refs[item.name][0].offsetHeight}px`,
          };
        } else if (index == this.currentIndex) {
          return {
            height: "auto",
          };
        }
      } else {
        return {};
      }
    },
    switchMenu(index) {
      this.list[index].open = !this.list[index].open;
    },
    logout() {
      localStorage.clear();
      this.$axios.post("/api/v1/user/logout").then(() => location.reload());
    },
  },
  created() {
    const authIds = this.$store.getters.auth_ids;
    if (!authIds) {
      return;
    }
    if (authIds.includes(101)) {
      this.showUpdatePwd = true;
    }
  },
  computed: {
    orgName() {
      return this.$store.state.orgName;
    },
    username() {
      return this.$store.state.username;
    },
    userStyle() {
      if (this.user) {
        return {
          height: `${this.height}px`,
        };
      }
      return {};
    },
    currentIndex() {
      let _index = 0;
      this.list.forEach((el, index) => {
        if (el.children) {
          el.children.forEach((_el) => {
            if (_el.link == this.$route.path) {
              _index = index;
              el.open = true;
            }
          });
        }
      });
      return _index;
    },
  },
};
</script>
