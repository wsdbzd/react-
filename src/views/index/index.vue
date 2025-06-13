<template lang="pug">
.page-index
  MenuList(v-model='close', :list="menu_list")
  .page-index-right(:class="{'page-index-right-close':close}")
    router-view
</template>
<style lang="less">
@import "../../libs/mixin";

.page-index {
  min-width: 1200px;
  width: 100%;
  min-height: 100vh;
  position: relative;

  &-right {
    float: right;
    width: calc(100% - 260px);
    position: relative;
    padding: 24px;
  }
}
</style>
<script>
export default {
  prop: {},
  data() {
    return {
      close: localStorage.menuStatus === "true" || false,
      menu_list: [],
      menu_base: [
        {
          id: 1,
          open: false,
          name: "首页",
          type: "md-home",
          link: "/",
        },
        {
          id: 4,
          open: false,
          name: "飞行管理",
          type: "md-build",
          children: [
            {
              id: 401,
              name: "飞行设置",
              link: "/flight_setting",
            },
            {
              id: 402,
              name: "起飞设置",
              link: "/takeoff_setting",
            },
            {
              id: 403,
              name: "飞行任务",
              link: "/flight_task",
            },
          ],
        },
        {
          id: 5,
          open: false,
          name: "项目管理",
          type: "md-build",
          children: [
            {
              id: 501,
              name: "项目信息",
              link: "/project_info",
            },
            {
              id: 601, // 502
              name: "机场信息",
              link: "/dock",
            },
          ],
        },
        {
          id: 6,
          open: false,
          name: "设备管理",
          type: "md-build",
          children: [
            {
              id: 601,
              name: "设备信息",
              link: "/device_info",
            },
            {
              id: 601, // 602
              name: "机场环境",
              link: "/airport_environment",
            },
            {
              id: 601, // 603
              name: "航线管理",
              link: "/wayline_manage",
            },
          ],
        },
        {
          id: 2,
          open: false,
          name: "权限管理",
          type: "logo-snapchat",
          children: [
            {
              id: 201,
              name: "用户管理",
              link: "/user_manage",
            },
            {
              id: 202,
              name: "角色管理",
              link: "/role_manage",
            },
          ],
        },
        {
          id: 3,
          open: false,
          name: "系统管理",
          type: "md-build",
          children: [
            {
              id: 302,
              name: "操作日志",
              link: "/admin_log",
            },
          ],
        },
        {
          id: 6, // 7
          open: false,
          name: "媒体管理",
          type: "md-build",
          children: [
            {
              id: 601, // 701
              name: "媒体文件",
              link: "/media_file",
            }
          ]
        },
        {
          id: 7, 
          open: false,
          name: "账号管理",
          type: "md-build",
          children: [
            {
              id: 701, 
              name: "项目方账号",
              link: "/web_ctrl_user"
            },
            {
              id: 701, 
              name: "微信账号",
              link: "/wechat_user"
            },
            {
              id: 701, 
              name: "MQTT账号",
              link: "/mqtt_user"
            },
          ]
        }
      ],
    };
  },
  created() {
    this.$axios.get("/api/v1/user/login_user_info").then((result) => {
      if (result.code === 10000) {
        this.$store.commit("setUserName", result.data);
      }
    });
    this.getAuth(); 
    // this.menu_list = this.menu_base;
  },
  watch: {
    close() {
      localStorage.menuStatus = this.close;
    },
  },
  methods: {
    async getAuth() { // 根据用户权限获取菜单列表
      // let authIds = await this.$store.dispatch("getAuthIds")
      const authIds = this.$store.getters.auth_ids;
      if (!authIds) {
        return;
      }

      for (var i = 0; i < this.menu_base.length; i++) {
        let level1 = this.menu_base[i];
        let temp = {};

        if (authIds.includes(level1.id)) {
          temp = {
            id: level1.id,
            open: level1.open,
            name: level1.name,
            type: level1.type,
            link: level1.link,
            children: level1.children && [],
          };

          if (level1.children) {
            for (var n = 0; n < level1.children.length; n++) {
              let level2 = level1.children[n];

              if (authIds.includes(level2.id)) {
                temp.children.push({
                  id: level2.id,
                  name: level2.name,
                  link: level2.link,
                });
              }
            }
          }
        }
        if (Object.keys(temp).length > 0) {
          this.menu_list.push(temp);
        }
      }
    },
  },
  computed: {
    user_info() {
      return this.$store.state.user_info;
    },
  },
};
</script>
