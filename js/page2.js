/**
 * Page 2 - 浪漫祝福卡片雨页面
 * 功能：卡片从中心弹出、随机分布全屏、背景音乐自动播放
 */

// ===================================
// 祝福语数据（温柔治愈风格，20+条）
// ===================================
const MESSAGES = [
    "希望你的冬天永远温柔又明亮",
    "你值得一切美好",
    "愿你每天都能被温暖包围",
    "这个冬天，因为有你会更美好",
    "愿你被世界温柔以待",
    "你是我心中最温暖的角落",
    "我想把所有的温暖都给你",
    "希望你的每一天都充满阳光",
    "愿你心里永远亮亮的",
    "你真的很特别",
    "冬天来了，也要对自己好一点",
    "早点休息，我会想你",
    "注意保暖，我想看到你健康的样子",
    "希望你每天都被温柔包围",
    "愿这个冬天，有我在你身边",
    "我会一直在",
    "希望你开心，也希望我能让你更开心",
    "愿你的每一天都充满阳光",
    "你是我心中最温暖的角落",
    "这个冬天因为有你会更美好",
    "愿你的笑容像冬日暖阳",
    "你值得被深深爱着",
    "愿所有美好都与你相遇",
    "你是我生命中最美的风景"
];

// 卡片颜色类（浅色系）
const CARD_COLORS = [
    'color-1',  // 浅蓝
    'color-2',  // 浅粉
    'color-3',  // 浅黄
    'color-4',  // 浅青
    'color-5'   // 浅紫
];

// ===================================
// 柔光粒子生成
// ===================================
class GlowParticles {
    constructor(container) {
        this.container = container;
        this.init();
    }

    init() {
        for (let i = 0; i < 8; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'glow-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        const size = Math.random() * 40 + 35;
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
        for (let i = 0; i < 80; i++) {
            this.createSnowflake();
        }
        this.animate();
    }

    createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        const sizeClasses = ['tiny', 'small', 'medium', 'large'];
        const sizeClass = sizeClasses[Math.floor(Math.random() * sizeClasses.length)];
        snowflake.classList.add(sizeClass);
        if (Math.random() < 0.15) {
            snowflake.classList.add('glow');
        }
        snowflake.textContent = '❄';
        
        const snowflakeData = {
            element: snowflake,
            x: Math.random() * window.innerWidth,
            y: -30,
            speed: Math.random() * 1.5 + 0.8,
            swing: Math.random() * 0.5 + 0.2,
            swingSpeed: Math.random() * 0.03 + 0.01,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 2 - 1,
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
            snow.y += snow.speed;
            snow.x += Math.sin(snow.y * snow.swingSpeed) * snow.swing;
            snow.rotation += snow.rotationSpeed;
            
            const opacityVariation = Math.sin(Date.now() * 0.001 + index) * 0.1;
            snow.element.style.opacity = Math.max(0.5, Math.min(1, snow.opacity + opacityVariation));
            
            if (snow.y > height + 30) {
                snow.y = -30;
                snow.x = Math.random() * width;
                snow.rotation = Math.random() * 360;
            }
            
            if (snow.x < -30) {
                snow.x = width + 30;
            } else if (snow.x > width + 30) {
                snow.x = -30;
            }
            
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
// 背景音乐管理（微信兼容）
// ===================================
class AudioManager {
    constructor() {
        this.audio = document.getElementById('bgMusic');
        this.hasPlayed = false;
        this.init();
    }

    init() {
        if (!this.audio) {
            console.warn('音频元素不存在');
            return;
        }

        this.audio.volume = 0.5;

        if (typeof WeixinJSBridge !== 'undefined') {
            this.playInWechat();
        } else {
            document.addEventListener('WeixinJSBridgeReady', () => {
                this.playInWechat();
            }, false);
            this.tryAutoPlay();
        }

        const tryPlayOnInteraction = () => {
            if (!this.hasPlayed) {
                this.playAudio();
            }
        };

        document.addEventListener('click', tryPlayOnInteraction, { once: true });
        document.addEventListener('touchstart', tryPlayOnInteraction, { once: true });
    }

    playInWechat() {
        if (typeof WeixinJSBridge !== 'undefined') {
            WeixinJSBridge.invoke('getNetworkType', {}, () => {
                this.playAudio();
            });
        }
    }

    tryAutoPlay() {
        setTimeout(() => {
            this.playAudio();
        }, 800);
    }

    playAudio() {
        if (!this.audio || this.hasPlayed) return;

        const playPromise = this.audio.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    this.hasPlayed = true;
                    console.log('背景音乐播放成功');
                })
                .catch(error => {
                    console.warn('自动播放被阻止:', error);
                });
        }
    }
}

// ===================================
// 卡片从中心弹出系统（重点功能）
// ===================================
class CardPopAnimation {
    constructor(container) {
        this.container = container;
        this.cards = [];
        this.cardCount = 0;
        this.maxCards = 30;  // 初始卡片数量
        this.centerX = window.innerWidth / 2;
        this.centerY = window.innerHeight / 2;
        this.init();
    }

    init() {
        // 页面加载后开始弹出卡片
        setTimeout(() => {
            this.startPopping();
        }, 300);
    }

    // 获取随机目标位置（真正铺满全屏）
    getRandomPosition() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // 确保卡片分布在屏幕的各个区域
        // top: 5% ~ 90%（避免太靠边）
        // left: 5% ~ 85%
        const top = Math.random() * 85 + 5;
        const left = Math.random() * 80 + 5;
        
        return {
            top: top + '%',
            left: left + '%',
            // 转换为像素用于计算
            topPx: (height * top / 100),
            leftPx: (width * left / 100)
        };
    }

    // 创建并弹出卡片
    createCard() {
        if (this.cardCount >= this.maxCards) {
            return;
        }

        const card = document.createElement('div');
        card.className = 'blessing-card';

        // 随机消息
        const message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
        card.textContent = message;

        // 随机颜色
        const colorClass = CARD_COLORS[Math.floor(Math.random() * CARD_COLORS.length)];
        card.classList.add(colorClass);

        // 获取随机目标位置
        const targetPos = this.getRandomPosition();
        card.style.top = targetPos.top;
        card.style.left = targetPos.left;

        // 随机旋转角度（-8° ~ +8°）
        const rotation = Math.random() * 16 - 8;
        card.style.setProperty('--card-rotation', rotation + 'deg');

        // 随机 z-index（1-50）
        const zIndex = Math.floor(Math.random() * 50) + 1;
        card.style.zIndex = zIndex;

        // 添加到容器
        this.container.appendChild(card);
        this.cards.push(card);
        this.cardCount++;

        // 从中心弹出的动画
        requestAnimationFrame(() => {
            // 计算从中心到目标位置的偏移
            const offsetX = targetPos.leftPx - this.centerX;
            const offsetY = targetPos.topPx - this.centerY;
            
            // 添加轻微的随机偏移（使弹出更有趣）
            const randomOffsetX = (Math.random() - 0.5) * 40;
            const randomOffsetY = (Math.random() - 0.5) * 40;
            
            // 设置初始位置（从中心偏移）
            card.style.transform = 
                `translate(${offsetX + randomOffsetX}px, ${offsetY + randomOffsetY}px) scale(0.7) rotate(0deg)`;
            card.style.opacity = '0';
            
            // 动画到目标位置
            requestAnimationFrame(() => {
                const duration = Math.random() * 120 + 200; // 200-320ms
                card.style.transition = 
                    `transform ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1), 
                     opacity ${duration}ms ease-out`;
                card.style.transform = 
                    `translate(0, 0) scale(1) rotate(${rotation}deg)`;
                card.style.opacity = '1';
                
                // 添加 visible 类
                setTimeout(() => {
                    card.classList.add('visible');
                }, duration);
            });
        });
    }

    startPopping() {
        // 逐个弹出卡片
        const popNext = () => {
            if (this.cardCount < this.maxCards) {
                this.createCard();
                // 随机间隔 180-300ms
                const delay = Math.random() * 120 + 180;
                setTimeout(popNext, delay);
            }
        };
        
        popNext();
    }

    // 继续生成更多卡片（如果需要）
    generateMore(count = 15) {
        this.maxCards = this.cardCount + count;
        this.startPopping();
    }
}

// ===================================
// 页面初始化
// ===================================
let snowAnimation;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Page 2 初始化开始...');

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

    // 初始化背景音乐
    const audioManager = new AudioManager();

    // 初始化卡片弹出系统
    const cardsContainer = document.getElementById('cardsContainer');
    if (cardsContainer) {
        new CardPopAnimation(cardsContainer);
    }

    // 窗口大小变化时重新计算中心点
    window.addEventListener('resize', () => {
        if (snowAnimation) {
            // 可以重新初始化或调整
        }
    });

    console.log('Page 2 初始化完成');
});

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
    if (snowAnimation) {
        snowAnimation.destroy();
    }
});
