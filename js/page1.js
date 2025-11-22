/**
 * Page 1 - 精致欢迎页逻辑
 * 功能：高级雪花动画、柔光粒子、页面跳转
 */

// ===================================
// 柔光粒子生成
// ===================================
class GlowParticles {
    constructor(container) {
        this.container = container;
        this.init();
    }

    init() {
        for (let i = 0; i < 10; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'glow-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        const size = Math.random() * 45 + 35;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.animationDelay = Math.random() * 25 + 's';
        particle.style.animationDuration = (Math.random() * 12 + 18) + 's';
        this.container.appendChild(particle);
    }
}

// ===================================
// 高级雪花动画（使用 requestAnimationFrame）
// ===================================
class ElegantSnowAnimation {
    constructor(container) {
        this.container = container;
        this.snowflakes = [];
        this.animationId = null;
        this.init();
    }

    init() {
        // 创建80个雪花
        for (let i = 0; i < 80; i++) {
            this.createSnowflake();
        }
        
        // 启动动画循环
        this.animate();
    }

    createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        
        // 随机大小分类
        const sizeClasses = ['tiny', 'small', 'medium', 'large'];
        const sizeClass = sizeClasses[Math.floor(Math.random() * sizeClasses.length)];
        snowflake.classList.add(sizeClass);
        
        // 15% 的概率成为发光雪粒子
        if (Math.random() < 0.15) {
            snowflake.classList.add('glow');
        }
        
        snowflake.textContent = '❄';
        
        // 初始化位置和属性
        const snowflakeData = {
            element: snowflake,
            x: Math.random() * window.innerWidth,
            y: -30,
            speed: Math.random() * 1.5 + 0.8, // 0.8 - 2.3
            swing: Math.random() * 0.5 + 0.2, // 左右摆动幅度
            swingSpeed: Math.random() * 0.03 + 0.01, // 摆动速度
            rotation: Math.random() * 360, // 初始旋转角度
            rotationSpeed: Math.random() * 2 - 1, // -1 到 1
            opacity: sizeClass === 'glow' ? 
                Math.random() * 0.25 + 0.85 : 
                Math.random() * 0.3 + 0.65,
            size: sizeClass === 'large' ? 22 : 
                  sizeClass === 'medium' ? 18 : 
                  sizeClass === 'small' ? 14 : 12
        };
        
        snowflake.style.left = snowflakeData.x + 'px';
        snowflake.style.opacity = snowflakeData.opacity;
        snowflake.style.fontSize = snowflakeData.size + 'px';
        
        this.container.appendChild(snowflake);
        this.snowflakes.push(snowflakeData);
    }

    animate() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.snowflakes.forEach((snow, index) => {
            // 更新位置
            snow.y += snow.speed;
            
            // 左右摆动（正弦波）
            snow.x += Math.sin(snow.y * snow.swingSpeed) * snow.swing;
            
            // 旋转
            snow.rotation += snow.rotationSpeed;
            
            // 透明度轻微变化
            const opacityVariation = Math.sin(Date.now() * 0.001 + index) * 0.1;
            snow.element.style.opacity = Math.max(0.5, Math.min(1, snow.opacity + opacityVariation));
            
            // 如果雪花飘出屏幕，重置位置
            if (snow.y > height + 30) {
                snow.y = -30;
                snow.x = Math.random() * width;
                snow.rotation = Math.random() * 360;
            }
            
            // 如果左右飘出屏幕，从另一侧出现
            if (snow.x < -30) {
                snow.x = width + 30;
            } else if (snow.x > width + 30) {
                snow.x = -30;
            }
            
            // 应用变换
            snow.element.style.transform = 
                `translate(${snow.x}px, ${snow.y}px) rotate(${snow.rotation}deg)`;
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// ===================================
// 页面跳转处理
// ===================================
class PageTransition {
    static goToPage2() {
        document.body.classList.add('page-fade-out');
        setTimeout(() => {
            window.location.href = 'page2.html';
        }, 500);
    }
}

// ===================================
// 页面初始化
// ===================================
let snowAnimation;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Page 1 初始化开始...');

    // 初始化柔光粒子
    const glowParticles = document.getElementById('glowParticles');
    if (glowParticles) {
        new GlowParticles(glowParticles);
    }

    // 初始化高级雪花动画
    const snowContainer = document.getElementById('snowContainer');
    if (snowContainer) {
        snowAnimation = new ElegantSnowAnimation(snowContainer);
    }

    // 绑定进入按钮事件
    const enterBtn = document.getElementById('enterBtn');
    if (enterBtn) {
        enterBtn.addEventListener('click', function() {
            PageTransition.goToPage2();
        });
    }

    // 窗口大小变化时重新计算
    window.addEventListener('resize', () => {
        if (snowAnimation) {
            // 可以根据需要重新计算位置
        }
    });

    console.log('Page 1 初始化完成');
});

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
    if (snowAnimation) {
        snowAnimation.destroy();
    }
});
