
[![Build Status](https://travis-ci.org/joehecn/j.svg?branch=master)](https://travis-ci.org/joehecn/j)
[![Coverage Status](https://coveralls.io/repos/github/joehecn/j/badge.svg?branch=master)](https://coveralls.io/github/joehecn/j?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/ab2abfd34d8cd46a074c/maintainability)](https://codeclimate.com/github/joehecn/j/maintainability)

# j v2
> 微信个人桌面机器人
- 微信网页版 API
- electron vue webpack jest

## 介绍
微信个人网页版API的微信机器人

- 扫码登录
![扫码登录](https://raw.githubusercontent.com/joehecn/j/master/login.gif)

- 发送消息
![发送消息](https://raw.githubusercontent.com/joehecn/j/master/sendmsg.gif)
## 安装
- Windows, MacOS 两个版本
- 百度网盘：https://pan.baidu.com/s/1i4QFrzn
## 功能
- 群发
## 开发
``` bash
# install dependencies
yarn

# serve with hot reload at localhost:9080
yarn dev

# run unit tests
yarn test

# unit and coverage
yarn cover

# build electron application for production
yarn build
```

---

## 问题
欢迎 issues

## 更新
### v2
全面重构项目

- [x] 保留核心功能 v2.0.0
- [x] 最新依赖关系 v2.0.0
- [x] jest单元测试 v2.0.0

### v1
- [x] 名单选中状态加深对比度 v0.0.2
- [x] 消息发送完成后清空消息框 v0.0.3
- [x] 没有选择组时，不显示 tabs v0.0.3
- [x] 显示版本号 v0.0.4
- [x] 软件版本更新提示 github api v0.0.5
- [x] 构建 Windows 版本 v0.0.6
- [x] F 修复 Windows 下侧边栏太窄添加按钮显示不全的问题 v0.0.6
- [x] N 新增 群 v0.0.7
- [x] N 新增 发送图片 v0.0.7
- [x] F 修复 login 200 重定向动态域名 v0.0.8
- [x] F 修复 MacOS 不能复制粘贴 添加菜单映射 v0.0.9
- [x] N 新增 导出好友列表完成后通知消息 v0.0.9
- [x] F 修复 侧边栏分组人数在切换用户后不对 - 分组对应用户 v0.1.0
- [x] N 新增 自定义 图灵key v0.1.0
- [x] N 新增 心跳图标 v0.1.0
- [x] F 修复 导出好友取消键弹错误框 v0.1.1
- [x] F 修复 选择好友后，搜索框清空 v0.1.1
- [x] N 新增 版本更新项列表 v0.1.1
- [x] N 新增 其它设备登录web微信下线通知 v0.1.2
- [x] N 新增 阿里云oss同步分组配置 v0.1.2
- [x] U 优化 调整 看参数配置 v0.1.2
- [x] F 修复 好友大于1000不全 v0.1.3
- [x] U 优化 发送多图 v0.1.3
- [x] N 新增 好友分页 v0.1.3
- [x] N 新增 是否显示头像选项 v0.1.3
- [x] N 新增 备注用户名及搜索 v0.1.3

## 主要依赖
- [electron](https://github.com/electron/electron)
- [electron-webpack](https://github.com/electron-userland/electron-webpack)
- [vue](https://github.com/vuejs/vue)
- [element-ui](https://github.com/ElemeFE/element)
- [localforage](https://github.com/localForage/localForage)
- [superagent](https://github.com/visionmedia/superagent)
- [jest](https://github.com/facebook/jest)

## License
MIT
