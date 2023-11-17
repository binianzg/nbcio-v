NBCIO Vue
====
[![码云Gitee](https://gitee.com/nbacheng/nbcio-vue/badge/star.svg?theme=blue)](https://gitee.com/nbacheng/nbcio-vue)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://gitee.com/nbacheng/nbcio-vue/blob/master/LICENSE)
[![](https://img.shields.io/badge/Author-宁波阿成-orange.svg)](http://122.227.135.243:9888/)
[![](https://img.shields.io/badge/Blog-个人博客-blue.svg)](https://nbacheng.blog.csdn.net)
[![](https://img.shields.io/badge/version-1.0.0-brightgreen.svg)](https://gitee/nbacheng/nbcio-boot)

基于ant-design-vue-jeecg的前端版本： 3.0.0（发布日期：2021-11-01）

后端地址 https://gitee.com/nbacheng/nbcio-boot

Overview
----

基于 [Ant Design of Vue](https://vuecomponent.github.io/ant-design-vue/docs/vue/introduce-cn/) 实现的 Ant Design Pro  Vue 版
nbcio-boot 的前端UI框架，采用前后端分离方案，提供强大代码生成器的低代码平台。
前端页面代码和后端功能代码一键生成，不需要写任何代码，保持jeecg一贯的强大！！

## 在线演示(包括H5) ：[http://122.227.135.243:9888](http://122.227.135.243:9888)

    H5地址是：http://122.227.135.243:9888/h5/
    演示账号：目前演示用户只能通过gitee授权登录，或star后进群要账号与密码
	如果你对项目感兴趣，请Watch、Star项目

## 联系作者
- 有商业应用的请知会作者

- 欢迎bug反馈，需求建议，技术交流等

- 个人网页:  https://nbacheng.blog.csdn.net/

- QQ交流群 ：655054809

## 友情链接
- Ruoyi-NBCIO项目: https://gitee.com/nbacheng/ruoyi-nbcio
- Uniapp项目: https://gitee.com/pzy332/jeecg-app-flowable.git 

#### 前端技术
 
- 基础框架：[ant-design-vue](https://github.com/vueComponent/ant-design-vue) - Ant Design Of Vue 实现
- Element UI 
- JavaScript框架：Vue
- Webpack
- node
- yarn
- eslint
- @vue/cli 3.2.1
- fullcalendar 
- v-charts
- echarts
- luckysheet
- [vue-cropper](https://github.com/xyxiao001/vue-cropper) - 头像裁剪组件
- [@antv/g2](https://antv.alipay.com/zh-cn/index.html) - Alipay AntV 数据可视化图表
- [Viser-vue](https://viserjs.github.io/docs.html#/viser/guide/installation)  - antv/g2 封装实现



项目下载和运行
----

- 拉取项目代码
```bash
git clone https://gitee.com/nbacheng/nbcio-vue.git
cd  nbcio-vue
```

- 安装依赖
```
yarn install
```

- 开发模式运行
```
yarn run serve
```

- 编译项目
```
yarn run build
```

- Lints and fixes files
```
yarn run lint
```



其他说明
----

- 项目使用的 [vue-cli3](https://cli.vuejs.org/guide/), 请更新您的 cli

- 关闭 Eslint (不推荐) 移除 `package.json` 中 `eslintConfig` 整个节点代码

- 修改 Ant Design 配色，在文件 `vue.config.js` 中，其他 less 变量覆盖参考 [ant design](https://ant.design/docs/react/customize-theme-cn) 官方说明
```ecmascript 6
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* less 变量覆盖，用于自定义 ant design 主题 */

          'primary-color': '#F5222D',
          'link-color': '#F5222D',
          'border-radius-base': '4px',
        },
        javascriptEnabled: true,
      }
    }
  }
```



附属文档
----
- [Ant Design Vue](https://vuecomponent.github.io/ant-design-vue/docs/vue/introduce-cn)

- [报表 viser-vue](https://viserjs.github.io/demo.html#/viser/bar/basic-bar)

- [Vue](https://cn.vuejs.org/v2/guide)

- [路由/菜单说明](https://github.com/zhangdaiscott/jeecg-boot/tree/master/ant-design-vue-jeecg/src/router/README.md)

- [ANTD 默认配置项](https://github.com/zhangdaiscott/jeecg-boot/tree/master/ant-design-vue-jeecg/src/defaultSettings.js)

- 其他待补充...


备注
----

> @vue/cli 升级后，eslint 规则更新了。由于影响到全部 .vue 文件，需要逐个验证。既暂时关闭部分原本不验证的规则，后期维护时，在逐步修正这些 rules


Docker 镜像使用
----

 ``` 
# 1.修改前端项目的后台域名
    .env.development
    域名改成： http://nbcio-boot-system:8080/nbcio-boot
   
# 2.先进入打包前端项目
  yarn run build

# 3.构建镜像
  docker build -t nginx:nbcioboot .

# 4.启动镜像
  docker run --name nbcio-boot-nginx -p 80:80 -d nginx:nbcioboot

# 5.配置host

    # nbcioboot
    127.0.0.1   nbcio-boot-redis
    127.0.0.1   nbcio-boot-mysql
    127.0.0.1   nbcio-boot-system
  
# 6.访问前台项目
  http://localhost:9888
``` 
## 捐赠 

如果觉得还不错，请作者喝杯咖啡吧！

![](https://oscimg.oschina.net/oscnet/up-58088c35672c874bd5a95c2327300d44dca.png)
 
  系统效果
   ----
   ![](https://oscimg.oschina.net/oscnet/up-ce7d9e52f39df3c7c9c08fae2233b843c86.png)
   
   ![](https://oscimg.oschina.net/oscnet/up-5a590c9f230541b58d89a3d44c23de7ae2d.png)
   
   ![](https://oscimg.oschina.net/oscnet/up-0b37ae7cf543b1ccc92f04a89c242866a25.png)
   
   ![](https://oscimg.oschina.net/oscnet/up-a5dcf863f39bb9bb81493b71eb46b51b884.png)
   
   ![](https://oscimg.oschina.net/oscnet/up-971d9321e22618ad70db56bbc1a6de77e9c.png)
   
   ![](https://oscimg.oschina.net/oscnet/up-e9182f6d379a37f8a03f347beeeca4cc7ca.png)
   
   ![](https://oscimg.oschina.net/oscnet/up-d575a8dd5bdf6747bcb3b6cb9b82c677810.png)
   
   ![](https://oscimg.oschina.net/oscnet/up-639599563b744e92ee9533f5e040d37c6ce.png)
   
   ![](https://oscimg.oschina.net/oscnet/up-1cca12b07f43edf134df5df66c9781972aa.png)
   
   ![](https://oscimg.oschina.net/oscnet/up-d2b8047ace2640dd190891fb78c3a58fd7e.png)
   
   ![](https://oscimg.oschina.net/oscnet/up-db16aa50ad36d0e6acf64034db270aefb5a.png)

   ![](https://oscimg.oschina.net/oscnet/up-088311c5367c583703473389478514c653f.png)

   ![](https://oscimg.oschina.net/oscnet/up-9e800cbcd809a118b90cd8925187ff9633d.png)

   ![](https://oscimg.oschina.net/oscnet/up-71a44b1e44c656155b90eadd64edf3ce2a0.png)
   
   ![](https://oscimg.oschina.net/oscnet/up-dfb183d37a7ac8b7c66af4e84fc120da1e1.png)
   
   ![](https://oscimg.oschina.net/oscnet/up-9f41d75e82ff682061dcfaec0ff6cb3954d.png)
   
   ![](https://oscimg.oschina.net/oscnet/up-6af11135ef1e923ef9f75af716886bc1b51.png)
   
