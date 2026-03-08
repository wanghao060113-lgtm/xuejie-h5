# 大雪节气祝福H5 ❄️

一个精美的大雪节气主题H5页面，包含60条祝福语、逐条弹出卡片效果、音频管理和丰富的交互体验。

## 🚀 快速部署

### Vercel 部署（推荐）

1. 将项目推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 无需配置，自动部署完成
4. 访问生成的 URL

### GitHub Pages 部署

1. 在 GitHub 仓库设置中启用 Pages
2. 选择分支和目录（选择根目录或 `感恩祝福H5` 文件夹）
3. 访问 `https://yourusername.github.io/repo-name`

### 本地运行

```bash
# 使用 npm
npm install -g http-server
http-server -p 8080

# 或使用 Python
python -m http.server 8080

# 或使用 Node.js
npx http-server -p 8080
```

## ✨ 功能特点

### 视觉设计
- **厚重华丽主题**：深蓝银白渐变，营造冬季厚重感
- **冰晶纹理边框**：卡片采用冰晶纹理效果
- **积雪堆积动画**：卡片出现采用积雪堆积效果
- **霜花纹理背景**：页面背景添加霜花纹理
- **硬件加速优化**：使用`transform: translateZ(0)`和`will-change`优化性能

### 交互体验
- **Canvas雪花系统**：三种雪花类型（六边形冰晶、星形雪花、梅花花瓣）
- **鼠标/触摸交互**：滑动影响雪花流向，点击生成漩涡
- **移动端增强**：
  - 滑动翻页
  - 长按保存贺卡
  - 双指缩放调整雪花密度
  - 摇动手机触发暴风雪
- **桌面端增强**：
  - 鼠标轨迹影响雪花
  - 滚轮控制动画速度
  - 键盘快捷键支持

### 音频系统
- **多音轨管理**：背景音乐、环境音、交互音效
- **智能播放**：用户交互检测，自动播放
- **音量渐变**：平滑的音量切换
- **移动端振动反馈**：触控反馈增强体验

### 性能优化
- **设备性能检测**：自动适配高/中/低端设备
- **对象池技术**：减少GC压力
- **FPS监控**：动态降级保证流畅度
- **电池节省模式**：低电量自动优化
- **首屏优化**：目标加载时间<2秒

## 📁 文件结构

```
感恩祝福H5/
├── index.html              # 主HTML文件
├── style.css               # 样式文件（大雪主题）
├── main.js                 # 主逻辑（60条祝福语）
├── snow-physics.js         # Canvas雪花物理系统
├── audio-manager.js        # 音频管理器
├── assets/
│   └── audio/
│       └── bgm.mp3         # 背景音乐
├── vercel.json             # Vercel部署配置
├── .gitignore              # Git忽略文件
└── README.md               # 项目说明
```

## 🚀 快速开始

### 本地开发

1. 克隆或下载项目
2. 使用本地服务器打开`index.html`
   ```bash
   # 使用Python
   python -m http.server 8000
   
   # 使用Node.js
   npx http-server
   ```
3. 访问 `http://localhost:8000`

### 部署到Vercel

1. 将项目推送到GitHub
2. 在[Vercel](https://vercel.com)导入项目
3. 自动部署完成

### 部署到GitHub Pages

1. 在GitHub仓库设置中启用Pages
2. 选择分支和目录
3. 访问 `https://yourusername.github.io/repo-name`

## 🎨 自定义配置

### 修改祝福语

编辑 `main.js` 中的 `blessings` 数组：

```javascript
const blessings = [
    "你的祝福语1 ❄️",
    "你的祝福语2 🌨️",
    // ...
];
```

### 调整雪花数量

编辑 `snow-physics.js` 中的性能检测逻辑：

```javascript
this.maxSnowflakes = this.devicePerformance === 'high' ? 150 : 
                    this.devicePerformance === 'medium' ? 80 : 40;
```

### 修改音频

1. 将音频文件放入 `assets/audio/` 目录
2. 编辑 `audio-manager.js` 中的配置：

```javascript
const config = {
    bgm: {
        src: 'assets/audio/your-bgm.mp3',
        volume: 0.6,
        // ...
    }
};
```

## 📱 浏览器支持

- Chrome/Edge (最新版)
- Firefox (最新版)
- Safari (最新版)
- 移动端浏览器（iOS Safari, Chrome Mobile）

## ⚙️ 技术栈

- **HTML5**：语义化结构
- **CSS3**：现代CSS特性（backdrop-filter, CSS变量, 动画）
- **JavaScript ES6+**：类、箭头函数、async/await
- **Canvas API**：雪花渲染
- **Web Audio API**：音频管理
- **Performance API**：性能监控

## 🎯 性能指标

- **首屏加载**：< 2秒（目标）
- **动画帧率**：60fps（稳定）
- **Lighthouse评分**：> 90（目标）
- **移动端适配**：完全响应式

## 📝 祝福语分类

- **诗词类**（20条）：古诗词引用
- **养生类**（20条）：大雪养生建议
- **温情类**（20条）：现代祝福语
- **英文类**（10条）：国际友人祝福

## 🔧 开发说明

### 性能优化要点

1. **硬件加速**：使用`transform`和`will-change`
2. **对象池**：减少内存分配
3. **FPS监控**：动态调整特效
4. **懒加载**：按需加载资源

### 渐进增强

- 基础功能在所有设备可用
- 高级特效在高端设备展示
- 自动降级保证流畅度

## 📄 许可证

MIT License

## 🙏 致谢

感谢所有为这个项目提供灵感和帮助的朋友们！

---

**大雪纷飞，温情如春 ❄️**

