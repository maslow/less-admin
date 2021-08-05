## WARNING! (警告)

本仓库不再更新和维护，相关功能已并入主仓库 [`less-framework`](https://github.com/Maslow/less-framework) 。

## 前序准备

你需要在本地安装 [node](http://nodejs.org/) 和 [git](https://git-scm.com/)。本项目技术栈基于 [ES2015+](http://es6.ruanyifeng.com/)、[vue](https://cn.vuejs.org/index.html)、[vuex](https://vuex.vuejs.org/zh-cn/)、[vue-router](https://router.vuejs.org/zh-cn/) 、[vue-cli](https://github.com/vuejs/vue-cli) 、[axios](https://github.com/axios/axios) 和 [element-ui](https://github.com/ElemeFE/element)


## 功能

```
- 登录 / 注销

- 权限验证
  - 页面权限
  - 指令权限
  - 权限配置

- 多环境发布
  - dev
  - sit
  - stage
  - prod

- 功能
  - 角色管理
  - 权限管理
  - 管理员管理
  - 云函数管理、调试
  - 访问规则配置

- 错误日志
- Dashboard
```

## 开发

```bash
# 克隆项目
git clone https://github.com/Maslow/less-admin.git

# 进入项目目录
cd less-admin

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 http://localhost:9527

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```

less-admin 是基于 vue-element-admin 修改而来的：
更多信息请参考 [使用文档](https://panjiachen.github.io/vue-element-admin-site/zh/)
