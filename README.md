# #2021 TCBC 云开发技术竞赛#-买单时间到-做什么都队

## 团队简介
- akayzhang: 队长（组织策划）
- jackleizhou: 队员（后台开发）
- ireneyuan:队员（前端开发）

## 作品介绍
### 应用场景
该小程序主要用于用户聚餐后，可以通过数字炸弹这种娱乐方式确定最终买单人是谁。该小程序可应用于多人场景下。

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

![image text](https://github.com/kongbai1kongbai/patTheBill/blob/master/images/%E5%88%9B%E5%BB%BA%E6%88%BF%E9%97%B4%E5%BC%B9%E7%AA%97.png)

历史记录：

![image text](https://github.com/kongbai1kongbai/patTheBill/blob/master/images/%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%E5%9B%BE.png)

游戏房间（未开始）：

![image text](https://github.com/kongbai1kongbai/patTheBill/blob/master/images/%E6%9C%AA%E5%BC%80%E5%A7%8B%E6%B8%B8%E6%88%8F%E5%9B%BE.png)

游戏房间（已开始）：

![image text](https://github.com/kongbai1kongbai/patTheBill/blob/master/images/%E5%BC%80%E5%A7%8B%E6%B8%B8%E6%88%8F%E5%9B%BE.png)

### 视频介绍
<iframe 
src="https://github.com/kongbai1kongbai/patTheBill/blob/master/images/%E4%BD%93%E9%AA%8C%E8%A7%86%E9%A2%91.mp4" 
scrolling="no" 
border="0" 
frameborder="no" 
framespacing="0" 
allowfullscreen="true" 
height=600 
width=800> 
</iframe>

## 模块介绍
由上图系统架构可看出，整个系统主要分为三个大模块：
- 小程序端模块：该部分主要以小程序的形式与用户进行交互，用户可以通过小程序进行房间交互，游戏交互和查看历史记录交互
- 云函数模块：该部分模块主要是负责用户的请求，用户需要进行创建房间，加入房间，退出房间，删除房间等一系列需要与后台数据库交互操作时都是通过调用云函数请求进行实现。
- 云数据库模块：该部分模块主要分为三部分组成：第一部分用户信息表，用来管理用户信息。第二部分是房间信息表：用来存储当前房间的一些状态以及查询历史记录时也通过房间表进行查询。最后一个表是最重要的一个表，游戏日志表，该游戏是一种多人游戏，需要多个玩家进行信息交互，在这里我才用云数据库的实时推送能力进行实现的。当用户进行游戏操作后会调用云函数，云函数会根据房间ID在游戏日志表中写入相应的操作日志，同时小程序端通过watch函数监听到这次变化并读取相应的信息在前端显示。

## 作品体验


