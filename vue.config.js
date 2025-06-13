const getIp = () => {
  var interfaces = require("os").networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (
        alias.family === "IPv4" &&
        alias.address !== "127.0.0.1" &&
        !alias.internal
      ) {
        return alias.address;
      }
    }
  }
};
module.exports = {
  // 选项...
  outputDir: "build",

  assetsDir: "static",

  productionSourceMap: false,

  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    open: true,
    host: "127.0.0.1",
    https:false,
    proxy: {
      "/api": {
        // target: "http://127.0.0.1:8888",
        target: "http://admin-test-api.pigeonflying.com",
        changeOrigin: true,
        cookieDomainRewrite: "127.0.0.1",
        secure: false,
        headers: {
          "x-forwarded-host": "127.0.0.1"
        }
      }
    }
  },

  lintOnSave: undefined
};
