# 部署指南

## 📦 部署前检查清单

### ✅ 必需文件
- [x] `index.html` - 主页面
- [x] `style.css` - 样式文件
- [x] `main.js` - 主逻辑
- [x] `audio-manager.js` - 音频管理器
- [x] `vercel.json` - Vercel配置
- [x] `package.json` - 项目配置

### ⚠️ 可选文件
- [ ] `assets/audio/bgm.mp3` - 背景音乐（如果没有，功能仍可正常使用）

## 🚀 Vercel 部署步骤

### 方法1：通过 GitHub（推荐）

1. **推送代码到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **在 Vercel 部署**
   - 访问 https://vercel.com
   - 点击 "New Project"
   - 导入 GitHub 仓库
   - **重要**：设置 Root Directory 为 `感恩祝福H5`
   - 点击 Deploy

3. **配置说明**
   - Framework Preset: Other
   - Build Command: 留空
   - Output Directory: `.` 或留空
   - Install Command: 留空

### 方法2：通过 Vercel CLI

```bash
npm i -g vercel
cd 感恩祝福H5
vercel
```

## 🌐 GitHub Pages 部署

1. **设置仓库**
   - 在 GitHub 仓库 Settings → Pages
   - Source: 选择分支和目录
   - 如果项目在子文件夹，选择 `感恩祝福H5` 目录

2. **访问地址**
   - `https://yourusername.github.io/repo-name/`

## ⚙️ 部署配置说明

### vercel.json
- 已配置静态文件服务
- 已设置缓存策略
- 已配置路由重写

### 音频文件处理
- 如果 `assets/audio/bgm.mp3` 不存在，功能仍可正常使用
- 音频加载失败不会影响卡片显示
- 可以稍后添加音频文件

## 🔧 常见问题

### 问题1：页面404
**解决**：检查 `vercel.json` 中的路由配置，确保 Root Directory 设置正确

### 问题2：资源加载失败
**解决**：检查所有文件路径使用相对路径（如 `./assets/audio/bgm.mp3`）

### 问题3：音频不播放
**解决**：
- 检查音频文件是否存在
- 检查浏览器控制台错误
- 音频文件缺失不影响其他功能

### 问题4：卡片不显示
**解决**：
- 检查浏览器控制台
- 确保所有JS文件正确加载
- 检查CSS文件路径

## 📱 测试清单

部署后请测试：
- [ ] 第一页正常显示
- [ ] 按钮点击能切换到第二页
- [ ] 卡片能逐条弹出
- [ ] 移动端显示正常
- [ ] 音频播放（如果文件存在）

## 🎯 性能优化建议

1. **压缩资源**
   - 使用工具压缩 CSS/JS
   - 优化图片大小

2. **CDN加速**
   - Vercel 自动提供 CDN
   - GitHub Pages 也支持 CDN

3. **缓存策略**
   - 静态资源长期缓存
   - HTML文件短期缓存

## 📞 技术支持

如遇问题，请检查：
1. 浏览器控制台错误信息
2. Network 标签查看资源加载
3. Vercel 部署日志


