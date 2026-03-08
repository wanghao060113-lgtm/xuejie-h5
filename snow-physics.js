/**
 * 大雪节气H5 - Canvas雪花物理系统
 * 性能优化：对象池、硬件加速、FPS监控、动态降级
 */

class SnowPhysics {
    constructor(containerId = 'page2') {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.warn('❌ 容器元素未找到，雪花系统初始化失败');
            return;
        }
        
        // 创建Canvas
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'snow-canvas';
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '2';
        this.ctx = this.canvas.getContext('2d');
        
        // 性能检测
        this.devicePerformance = this.detectPerformance();
        this.maxSnowflakes = this.devicePerformance === 'high' ? 150 : 
                            this.devicePerformance === 'medium' ? 80 : 40;
        
        // 雪花对象池
        this.snowflakePool = [];
        this.activeSnowflakes = [];
        this.poolSize = this.maxSnowflakes * 2;
        
        // 动画控制
        this.animationId = null;
        this.isPaused = false;
        this.lastTime = 0;
        this.deltaTime = 0;
        
        // FPS监控
        this.fps = 60;
        this.frameCount = 0;
        this.lastFpsTime = performance.now();
        
        // 交互状态
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseVelocityX = 0;
        this.mouseVelocityY = 0;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.touchActive = false;
        
        // 暴风雪模式
        this.blizzardMode = false;
        this.blizzardTimer = 0;
        
        // 初始化
        this.init();
    }
    
    /**
     * 检测设备性能
     */
    detectPerformance() {
        const cores = navigator.hardwareConcurrency || 4;
        const memory = navigator.deviceMemory || 4;
        const connection = navigator.connection;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        let score = 0;
        
        // CPU核心数评分
        if (cores >= 8) score += 3;
        else if (cores >= 4) score += 2;
        else score += 1;
        
        // 内存评分
        if (memory >= 8) score += 3;
        else if (memory >= 4) score += 2;
        else score += 1;
        
        // 网络评分
        if (connection) {
            if (connection.effectiveType === '4g') score += 2;
            else if (connection.effectiveType === '3g') score += 1;
        }
        
        // 移动端降级
        if (isMobile) score -= 1;
        
        if (score >= 7) return 'high';
        if (score >= 4) return 'medium';
        return 'low';
    }
    
    /**
     * 初始化
     */
    init() {
        this.resize();
        this.container.appendChild(this.canvas);
        
        // 初始化对象池
        this.initPool();
        
        // 绑定事件
        this.bindEvents();
        
        // 开始动画
        this.start();
        
        console.log(`✅ 雪花系统已初始化 (性能: ${this.devicePerformance}, 最大雪花数: ${this.maxSnowflakes})`);
    }
    
    /**
     * 初始化对象池
     */
    initPool() {
        for (let i = 0; i < this.poolSize; i++) {
            this.snowflakePool.push(this.createSnowflake(true));
        }
    }
    
    /**
     * 创建雪花对象
     */
    createSnowflake(poolMode = false) {
        const types = ['hexagon', 'star', 'petal'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        const size = Math.random() * 4 + 2;
        const speed = Math.random() * 2 + 0.5;
        
        return {
            x: poolMode ? 0 : Math.random() * this.canvas.width,
            y: poolMode ? -10 : Math.random() * this.canvas.height,
            size: size,
            speed: speed,
            angle: Math.random() * Math.PI * 2,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.02,
            opacity: Math.random() * 0.5 + 0.5,
            type: type,
            sway: Math.random() * 0.5 + 0.5,
            swayOffset: Math.random() * Math.PI * 2,
            active: !poolMode
        };
    }
    
    /**
     * 从对象池获取雪花
     */
    getSnowflake() {
        let snowflake = this.snowflakePool.find(s => !s.active);
        if (!snowflake) {
            snowflake = this.createSnowflake();
        }
        snowflake.x = Math.random() * this.canvas.width;
        snowflake.y = -10;
        snowflake.active = true;
        return snowflake;
    }
    
    /**
     * 回收雪花到对象池
     */
    recycleSnowflake(snowflake) {
        snowflake.active = false;
    }
    
    /**
     * 调整Canvas尺寸
     */
    resize() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        // 窗口大小调整
        window.addEventListener('resize', () => {
            this.resize();
        });
        
        // 鼠标移动
        this.container.addEventListener('mousemove', (e) => {
            const rect = this.container.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
            
            // 计算鼠标速度
            this.mouseVelocityX = this.mouseX - this.lastMouseX;
            this.mouseVelocityY = this.mouseY - this.lastMouseY;
            this.lastMouseX = this.mouseX;
            this.lastMouseY = this.mouseY;
        });
        
        // 鼠标点击 - 生成漩涡
        this.container.addEventListener('click', (e) => {
            const rect = this.container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.createVortex(x, y);
        });
        
        // 触摸事件
        this.container.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.container.getBoundingClientRect();
            this.mouseX = touch.clientX - rect.left;
            this.mouseY = touch.clientY - rect.top;
            this.touchActive = true;
        });
        
        this.container.addEventListener('touchend', () => {
            this.touchActive = false;
        });
        
        // 设备方向 - 摇动检测（移动端）
        if (window.DeviceOrientationEvent) {
            let lastBeta = 0;
            let shakeCount = 0;
            
            window.addEventListener('deviceorientation', (e) => {
                if (e.beta !== null) {
                    const delta = Math.abs(e.beta - lastBeta);
                    if (delta > 15) {
                        shakeCount++;
                        if (shakeCount > 3) {
                            this.triggerBlizzard();
                            shakeCount = 0;
                        }
                    }
                    lastBeta = e.beta;
                }
            });
        }
        
        // 页面可见性 - 暂停/恢复
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
    }
    
    /**
     * 创建漩涡效果
     */
    createVortex(x, y) {
        const vortexRadius = 150;
        const vortexStrength = 5;
        
        this.activeSnowflakes.forEach(snowflake => {
            const dx = snowflake.x - x;
            const dy = snowflake.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < vortexRadius) {
                const angle = Math.atan2(dy, dx);
                const force = (vortexRadius - distance) / vortexRadius * vortexStrength;
                
                snowflake.x += Math.cos(angle + Math.PI / 2) * force;
                snowflake.y += Math.sin(angle + Math.PI / 2) * force;
            }
        });
    }
    
    /**
     * 触发暴风雪模式
     */
    triggerBlizzard() {
        this.blizzardMode = true;
        this.blizzardTimer = 3000; // 3秒
        
        // 临时增加雪花数量
        const targetCount = Math.min(this.maxSnowflakes * 2, 200);
        while (this.activeSnowflakes.length < targetCount) {
            this.activeSnowflakes.push(this.getSnowflake());
        }
        
        console.log('🌨️ 暴风雪模式已激活');
    }
    
    /**
     * 绘制六边形冰晶
     */
    drawHexagon(x, y, size, rotation, opacity) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        this.ctx.globalAlpha = opacity;
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const px = Math.cos(angle) * size;
            const py = Math.sin(angle) * size;
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        this.ctx.closePath();
        this.ctx.stroke();
        
        // 内部线条
        this.ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            const angle = (Math.PI / 3) * i * 2;
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(Math.cos(angle) * size, Math.sin(angle) * size);
        }
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    /**
     * 绘制星形雪花
     */
    drawStar(x, y, size, rotation, opacity) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        this.ctx.globalAlpha = opacity;
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        
        const spikes = 6;
        const outerRadius = size;
        const innerRadius = size * 0.5;
        
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (Math.PI / spikes) * i;
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    /**
     * 绘制梅花花瓣
     */
    drawPetal(x, y, size, rotation, opacity) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        this.ctx.globalAlpha = opacity;
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.beginPath();
        
        // 绘制5个花瓣
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 / 5) * i;
            const px = Math.cos(angle) * size;
            const py = Math.sin(angle) * size;
            
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.quadraticCurveTo(0, 0, px, py);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
        
        // 中心点
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    /**
     * 绘制单个雪花
     */
    drawSnowflake(snowflake) {
        switch (snowflake.type) {
            case 'hexagon':
                this.drawHexagon(snowflake.x, snowflake.y, snowflake.size, snowflake.rotation, snowflake.opacity);
                break;
            case 'star':
                this.drawStar(snowflake.x, snowflake.y, snowflake.size, snowflake.rotation, snowflake.opacity);
                break;
            case 'petal':
                this.drawPetal(snowflake.x, snowflake.y, snowflake.size, snowflake.rotation, snowflake.opacity);
                break;
        }
    }
    
    /**
     * 更新雪花位置
     */
    updateSnowflake(snowflake, deltaTime) {
        // 基础下落
        snowflake.y += snowflake.speed * (deltaTime / 16);
        
        // 左右摆动
        snowflake.x += Math.sin(snowflake.swayOffset + snowflake.y * 0.01) * snowflake.sway * (deltaTime / 16);
        
        // 旋转
        snowflake.rotation += snowflake.rotationSpeed * (deltaTime / 16);
        
        // 鼠标/触摸影响
        if (this.mouseX > 0 && this.mouseY > 0) {
            const dx = snowflake.x - this.mouseX;
            const dy = snowflake.y - this.mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100 * 0.5;
                const angle = Math.atan2(dy, dx);
                snowflake.x += Math.cos(angle) * force * (deltaTime / 16);
                snowflake.y += Math.sin(angle) * force * (deltaTime / 16);
            }
        }
        
        // 暴风雪模式
        if (this.blizzardMode) {
            snowflake.speed *= 1.1;
            snowflake.x += (Math.random() - 0.5) * 2 * (deltaTime / 16);
        }
        
        // 边界检查
        if (snowflake.y > this.canvas.height + 10) {
            snowflake.y = -10;
            snowflake.x = Math.random() * this.canvas.width;
        }
        
        if (snowflake.x < -10) {
            snowflake.x = this.canvas.width + 10;
        } else if (snowflake.x > this.canvas.width + 10) {
            snowflake.x = -10;
        }
    }
    
    /**
     * 更新FPS
     */
    updateFPS(currentTime) {
        this.frameCount++;
        if (currentTime - this.lastFpsTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsTime = currentTime;
            
            // 动态降级
            if (this.fps < 30 && this.activeSnowflakes.length > 20) {
                // 移除部分雪花
                const removeCount = Math.floor(this.activeSnowflakes.length * 0.1);
                for (let i = 0; i < removeCount; i++) {
                    const index = Math.floor(Math.random() * this.activeSnowflakes.length);
                    this.recycleSnowflake(this.activeSnowflakes[index]);
                    this.activeSnowflakes.splice(index, 1);
                }
                console.log(`⚠️ FPS过低(${this.fps})，已减少${removeCount}个雪花`);
            }
        }
    }
    
    /**
     * 动画循环
     */
    animate(currentTime) {
        if (this.isPaused) return;
        
        // 计算时间差
        if (this.lastTime === 0) {
            this.lastTime = currentTime;
        }
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // 限制最大时间差（防止标签页切换后时间差过大）
        if (this.deltaTime > 100) {
            this.deltaTime = 16;
        }
        
        // 更新FPS
        this.updateFPS(currentTime);
        
        // 添加新雪花
        if (this.activeSnowflakes.length < this.maxSnowflakes) {
            if (Math.random() < 0.1) {
                this.activeSnowflakes.push(this.getSnowflake());
            }
        }
        
        // 更新暴风雪模式
        if (this.blizzardMode) {
            this.blizzardTimer -= this.deltaTime;
            if (this.blizzardTimer <= 0) {
                this.blizzardMode = false;
                // 恢复正常速度
                this.activeSnowflakes.forEach(s => {
                    s.speed = Math.random() * 2 + 0.5;
                });
            }
        }
        
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 更新并绘制雪花
        this.activeSnowflakes.forEach(snowflake => {
            this.updateSnowflake(snowflake, this.deltaTime);
            this.drawSnowflake(snowflake);
        });
        
        // 继续动画
        this.animationId = requestAnimationFrame((time) => this.animate(time));
    }
    
    /**
     * 开始动画
     */
    start() {
        if (this.animationId) return;
        this.isPaused = false;
        this.lastTime = 0;
        this.animationId = requestAnimationFrame((time) => this.animate(time));
    }
    
    /**
     * 暂停动画
     */
    pause() {
        this.isPaused = true;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    /**
     * 恢复动画
     */
    resume() {
        if (!this.isPaused) return;
        this.start();
    }
    
    /**
     * 销毁
     */
    destroy() {
        this.pause();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// 导出到全局
window.SnowPhysics = SnowPhysics;


