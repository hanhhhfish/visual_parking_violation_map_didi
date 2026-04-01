# 停车违章地图可视化应用

## 项目简介

这是一个基于Vue 3和Leaflet开发的停车违章地图可视化应用，用于展示和分析停车违章罚单数据。应用支持两种视图模式：明细视图（显示单个罚单点）和热力图视图（显示罚单密度），并提供了时间范围、城市和关键词搜索功能。

## 功能特性

- **地图展示**：使用高德地图作为底图，显示停车违章罚单的位置
- **两种视图**：
  - 明细视图：显示罚单点，点击可查看详细信息
  - 热力图视图：显示罚单密度，红色区域表示罚单较多
- **搜索功能**：支持按时间范围、城市、POI/道路名称搜索罚单
- **热力图配置**：可调整热力图的半径、模糊度和最大热度值
- **响应式设计**：适配不同屏幕尺寸

## 技术栈

- **前端框架**：Vue 3
- **地图库**：Leaflet
- **热力图插件**：Leaflet.heat
- **UI组件库**：Element Plus
- **底图**：高德地图

## 项目结构

```
├── index.html        # 主页面文件
├── src/              # 源代码目录
│   └── main.js      # 主应用逻辑
└── .gitignore       # Git忽略文件
```

## 部署说明

### 方法一：GitHub Pages

1. 访问 GitHub 仓库：https://github.com/hanhhhfish/visual_parking_violation_map_didi
2. 进入 Settings > Pages
3. 选择 Branch: main，目录: / (root)
4. 点击 Save，等待部署完成
5. 访问生成的 URL（格式：https://hanhhhfish.github.io/visual_parking_violation_map_didi）

### 方法二：部署到公司服务器

1. 克隆仓库到服务器：
   ```bash
   git clone https://github.com/hanhhhfish/visual_parking_violation_map_didi.git
   ```

2. 将文件部署到 Web 服务器（如 Nginx、Apache 等）

3. 配置 Web 服务器指向项目目录

## 数据接入

### 数据结构

当前使用的 Mock 数据结构如下：

```javascript
const mockTickets = [
  {
    id: 1,
    time: '2025-03-15 08:30:00',
    location: '北京市朝阳区建国路88号',
    longitude: 116.4668,
    latitude: 39.9183,
    poi: '国贸中心',
    road: '建国路',
    type: '违停',
    amount: 200
  },
  // 更多数据...
];
```

### 删除 Mock 数据

当接入真实数据后，建议删除或注释掉 Mock 数据，以避免混淆。具体操作如下：

1. 找到 `index.html` 文件中的 Mock 数据定义：
   ```javascript
   // Mock数据 - 模拟正式API返回格式
   const mockTickets = [
     {
       id: 1,
       time: '2025-03-15 08:30:00',
       location: '北京市朝阳区建国路88号',
       longitude: 116.4668,
       latitude: 39.9183,
       poi: '国贸中心',
       road: '建国路',
       type: '违停',
       amount: 200
     },
     // 更多数据...
   ];
   ```

2. 注释掉或删除这段代码

3. 同时，确保 `fetchTicketsFromAPI` 函数中使用的是真实 API 数据，而不是 Mock 数据：
   ```javascript
   // 确保使用真实API数据
   const data = await response.json();
   // 而不是
   // const data = mockTickets;
   ```

### 接入真实数据

要接入公司的真实数据，请修改 `index.html` 文件中的 `fetchTicketsFromAPI` 函数：

1. 找到以下代码段：
   ```javascript
   // 发送请求（替换为公司实际API地址）
   // 注意：这里使用mock数据作为示例，实际项目中替换为真实API
   // const response = await fetch(`https://your-company-api.com/tickets?${params.toString()}`, {
   //   method: 'GET',
   //   headers: {
   //     'Content-Type': 'application/json',
   //     // 如果需要认证，添加token
   //     // 'Authorization': `Bearer ${yourToken}`
   //   }
   // });
   
   // 模拟API请求延迟
   await new Promise(resolve => setTimeout(resolve, 500));
   
   // 使用mock数据作为示例
   const data = mockTickets;
   ```

2. 取消注释并修改为公司的真实 API 地址：
   ```javascript
   // 发送请求（替换为公司实际API地址）
   const response = await fetch(`https://your-company-api.com/tickets?${params.toString()}`, {
     method: 'GET',
     headers: {
       'Content-Type': 'application/json',
       // 如果需要认证，添加token
       // 'Authorization': `Bearer ${yourToken}`
     }
   });
   
   // 解析响应数据
   const data = await response.json();
   ```

3. 根据公司 API 返回的数据结构，调整 `transformTicketData` 函数以确保数据格式正确：
   ```javascript
   // 数据转换函数
   const transformTicketData = (apiData) => {
     return apiData.map(item => ({
       id: item.id || item.ticketId,           // 适配不同字段名
       time: item.time || item.createTime,     // 适配不同字段名
       location: item.location || item.address, // 适配不同字段名
       longitude: parseFloat(item.longitude || item.lng), // 确保为数字类型
       latitude: parseFloat(item.latitude || item.lat),   // 确保为数字类型
       poi: item.poi || item.poiName,          // 适配不同字段名
       road: item.road || item.roadName,        // 适配不同字段名
       type: item.type || item.ticketType,      // 适配不同字段名
       amount: item.amount || item.fineAmount   // 适配不同字段名
     }));
   };
   ```

## 开发说明

### 本地开发

1. 克隆仓库：
   ```bash
   git clone https://github.com/hanhhhfish/visual_parking_violation_map_didi.git
   ```

2. 打开 `index.html` 文件即可在浏览器中查看应用

### 依赖项

应用使用了以下 CDN 资源：

- Vue 3：https://unpkg.com/vue@3/dist/vue.global.js
- Element Plus：https://unpkg.com/element-plus@2.4.4/dist/index.css 和 https://unpkg.com/element-plus@2.4.4/dist/index.full.js
- Leaflet：https://unpkg.com/leaflet@1.9.4/dist/leaflet.css 和 https://unpkg.com/leaflet@1.9.4/dist/leaflet.js
- Leaflet.heat：https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js

## 注意事项

- 本应用使用了高德地图作为底图，需要确保网络连接正常
- 热力图视图需要足够多的罚单数据才能显示明显的密度差异
- 接入真实数据时，需要确保 API 接口返回的数据格式与应用期望的格式一致
- 对于大量数据，可能需要优化加载性能，如使用分页加载或聚类展示

## 更换地图底图

本应用默认使用高德地图作为底图，如果需要更换为其他地图服务（如滴滴地图），可以按照以下步骤操作：

1. 找到 `index.html` 文件中的地图初始化代码：
   ```javascript
   // 添加底图（使用高德地图作为替代方案）
   const tileLayer = L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
     subdomains: ['1', '2', '3', '4'],
     attribution: '高德地图'
   });
   ```

2. 替换为其他地图服务的 URL 模板，例如滴滴地图（如果有公开的 API）：
   ```javascript
   // 添加底图（使用滴滴地图）
   const tileLayer = L.tileLayer('https://your-didi-map-url/{z}/{x}/{y}.png', {
     attribution: '滴滴地图'
   });
   ```

3. 注意：不同地图服务的 URL 模板和参数可能不同，需要根据具体地图服务的 API 文档进行调整

4. 如果地图服务需要 API key，需要在 URL 中添加相应的参数：
   ```javascript
   // 添加底图（使用需要 API key 的地图服务）
   const tileLayer = L.tileLayer('https://your-map-url/{z}/{x}/{y}.png?key=YOUR_API_KEY', {
     attribution: '地图服务名称'
   });
   ```

## 联系方式

如果有任何问题或建议，请联系项目维护者。