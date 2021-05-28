# #2021 TCBC 云开发技术竞赛#-买单时间到-做什么都队

## 团队简介
- akayzhang: 队长（组织策划）
- jackleizhou: 队员（后台开发）
- ireneyuan:队员（前端开发）

## 作品介绍
### 应用场景
该小程序主要用于用户聚餐后，可以通过数字炸弹这种娱乐方式确定最终买单人是谁

### 目标用户
聚餐人员

### 实现思路：
整体玩法：
- 房主进入小程序创建房间并设置条件，如参与的人数、抽奖的形式，然后生成房间id和房间分享链接。在房主创建房间的时候需要判断当前房主是否已经有一个正在进行的游戏，如果有，则创建失败。
- 房主将房间id或者链接分享到微信或者其他社交平台, 用户点击链接或者直接进入小程序输入房间id后，进入页面, 提示: 类似是否参与该活动。（指定用户参与逻辑）
- 用户点击确认进入房间, 若人数已达上限、该活动已经被房主取消或者过期,该活动已经开始, 则提示失败, 否则提示进入房间成功, 且显示当前房间总人数；若用户已经在另外一房间中，需要提示是否退出目前房间并加入该房间。
- 房主可以踢出陌生人(极端情况下才可能出现)，人数一旦达到上限,房主可以开始游戏。普通用户也可以选择退出当前房间。
- 最终通过游戏，确定买单的人后, 所有参与者的页面均显示本次的买单人, 如昵称, id等信息。
- 任何用户进入页面, 均可以显示最近一段时间参与的买单活动, 包括参与人数, 时间, 最终买单人的id等, 如为自己主动发起的, 可标记为房主。

页面跳转图：

![image text](https://github.com/kongbai1kongbai/patTheBill/blob/master/images/%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC%E5%9B%BE.png)

用例图：

![image text](https://github.com/kongbai1kongbai/patTheBill/blob/master/images/%E6%8A%BD%E5%A5%96%E6%B8%B8%E6%88%8F%E7%94%A8%E4%BE%8B%E5%9B%BE.png)


### 系统架构（功能模块）
![image text](https://github.com/kongbai1kongbai/patTheBill/blob/master/images/%E4%B9%B0%E5%8D%95%E6%97%B6%E9%97%B4%E5%88%B0%E7%B3%BB%E7%BB%9F%E6%9E%B6%E6%9E%84%E5%9B%BE.png)

### 页面展示
主页：

![image text](https://github.com/kongbai1kongbai/patTheBill/blob/master/images/%E4%B8%BB%E9%A1%B5%E5%9B%BE.png)

创建房间：

![image text](https://github.com/kongbai1kongbai/patTheBill/blob/master/images/%E4%B9%B0%E5%8D%95%E6%97%B6%E9%97%B4%E5%88%B0%E7%B3%BB%E7%BB%9F%E6%9E%B6%E6%9E%84%E5%9B%BE.png)

历史记录：

![image text](https://github.com/kongbai1kongbai/patTheBill/blob/master/images/%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%E5%9B%BE.png)

游戏房间（未开始）：

![image text](https://github.com/kongbai1kongbai/patTheBill/blob/master/images/%E6%9C%AA%E5%BC%80%E5%A7%8B%E6%B8%B8%E6%88%8F%E5%9B%BE.png)

游戏房间（已开始）：

![image text](https://github.com/kongbai1kongbai/patTheBill/blob/master/images/%E5%BC%80%E5%A7%8B%E6%B8%B8%E6%88%8F%E5%9B%BE.png)

### 视频介绍
1

## 模块介绍
1

## 作品体验
- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

