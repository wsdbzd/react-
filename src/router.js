import Vue from "vue";
import Router from "vue-router";
import iView from "iview";
import store from "./store";

Vue.use(Router);

const routes = [
  {
    path: "/login",
    component: () => import("./views/login/index.vue"),
  },
  {
    path: "/password/find",
    component: () => import("./views/password/find.vue"),
  },
  {
    path: "/oauth/redirect",
    component: () => import("./views/login/oauth_redirect.vue"),
  },
  {
    path: "/401",
    component: () => import("./views/error/401.vue"),
  },
  {
    path: "/404",
    component: () => import("./views/error/404.vue"),
  },
  {
    path: "/",
    component: () => import("./views/index/index.vue"),
    children: [
      {
        path: "/",
        meta: {
          name: "首页",
          id: 1,
        },
        component: () => import("./views/index/home.vue"),
      },
      {
        path: "/update_pwd",
        meta: {
          name: "修改密码",
          id: 101,
        },
        component: () => import("./views/index/update_pwd.vue"),
      },
      // 权限管理
      {
        path: "/user_manage",
        meta: {
          name: "用户管理",
          id: 201,
        },
        component: () => import("./views/auth/user_manage.vue"),
      },
      {
        path: "/role_manage",
        meta: {
          name: "角色管理",
          id: 202,
        },
        component: () => import("./views/auth/role_manage.vue"),
      },
      {
        path: "/admin_log",
        meta: {
          name: "操作日志",
          id: 302,
        },
        component: () => import("./views/system/admin_log.vue"),
      },

      //飞行管理
      {
        path: "/flight_setting",
        meta: {
          name: "飞行设置",
          id: 401,
        },
        component: () => import("./views/flight/flight_setting.vue"),
      },
      {
        path: "/takeoff_setting",
        meta: {
          name: "起飞设置",
          id: 402,
        },
        component: () => import("./views/flight/takeoff_setting.vue"),
      },
      {
        path: "/flight_task",
        meta: {
          name: "飞行任务",
          id: 403,
        },
        component: () => import("./views/flight/flight_task.vue"),
      },

      //项目管理
      {
        path: "/project_info",
        meta: {
          name: "项目信息",
          id: 501,
        },
        component: () => import("./views/project/project.vue"),
      },
      {
        path: "/dock",
        meta: {
          name: "机场信息",
          id: 502
        },
        component: () => import("./views/project/dock.vue"),
      },
      //设备管理
      {
        path: "/device_info",
        meta: {
          name: "设备信息",
          id: 601,
        },
        component: () => import("./views/device/device.vue"),
      },
      {
        path: "/airport_environment",
        meta: {
          name: "机场环境",
          id: 601, // 602
        },
        component: () => import("./views/device/airport_environment.vue"),
      },
      {
        path: "/wayline_manage",
        meta: {
          name: "航线信息",
          id: 601 // 603
        },
        component: () => import("./views/device/wayline_manage.vue"),
      },
      {
        path: "/media_file",
        meta: {
          name: "媒体文件",
          id: 601 // 701
        },
        component: () => import("./views/media/media_file.vue"),
      },
      {
        path: "/web_ctrl_user",
        meta: {
          name: "项目方账号",
          id: 701 
        },
        component: () => import("./views/account/web_ctrl_user.vue"),
      },
      {
        path: "/wechat_user",
        meta: {
          name: "微信账号",
          id: 702 
        },
        component: () => import("./views/account/wechat_user.vue"),
      },
      {
        path: "/mqtt_user",
        meta: {
          name: "MQTT账号",
          id: 703 
        },
        component: () => import("./views/account/mqtt_user.vue"),
      },
    ],
  },
];

const router = new Router({
  routes,
  mode: "history",
});

router.beforeEach(async (to, from, next) => {
  iView.LoadingBar.start();
  const pathArr = [
    "/",
    "/login",
    "/oauth/redirect",
    "/401",
    "/404",
    "/password/find",
  ];
  if (pathArr.indexOf(to.path) > -1) {
    if (to.path === "/") {
      if (store.getters.auth_ids && store.getters.auth_ids.length === 0) {
        await store.dispatch("getAuthIds");
      }
    }
    next();
  } else {
    if (store.getters.auth_ids && store.getters.auth_ids.length === 0) {
      await store.dispatch("getAuthIds");
    }

    let localAuths = routes[5].children.map((v) => {
      return { id: v.meta.id, path: v.path };
    });

    try {
      if (isIncludes(store.getters.auth_ids, localAuths, to.path)) {
        next();
      } else {
        // next("/401");
        next()
      }
    } catch (error) {
      console.error("====", error);
    }
  }
});

function isIncludes(arr1, arr2, path) {
  let temp = [];
  for (const item of arr2) {
    arr1.includes(item.id) ? temp.push(item.path) : "";
  }
  if (temp.indexOf(path) != -1) {
    return true;
  } else {
    return false;
  }
}

router.afterEach((route) => {
  iView.LoadingBar.finish();
  window.scrollTo(0, 0);
  let arr = ["小鸽-管理系统"];
  if (route.meta.name) {
    arr.unshift(route.meta.name);
  }
  document.setTitle(arr.join("-"));
});

export default router;
