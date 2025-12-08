// 大雪祝福H5 - 逐条弹出卡片版
document.addEventListener('DOMContentLoaded', function() {
  console.log('页面加载完成，开始初始化...');
  
  // 音乐控制组件引用
  let musicControl = null;
  let musicStatus = null;
  
  // ==================== 祝福语数据 ====================
  const blessings = [
    // 温馨类
    "大雪至，寒冬深，愿有人问你粥可温，有人陪你立黄昏 ❄️",
    "雪落无声，思念有痕，愿这个冬天你被温暖紧紧拥抱",
    "愿每一片雪花，都带着我的祝福落在你肩头",
    "大雪纷飞时，最暖不过一句：我在 ❤️",
    "愿这个冬天，你的笑容比阳光还温暖",
    "寒夜有灯，冬日有暖，愿你有爱",
    "冬天适合思念，更适合相见",
    
    // 古风类
    "晚来天欲雪，能饮一杯无？我温好了酒，等你",
    "忽如一夜春风来，千树万树梨花开",
    "梅须逊雪三分白，雪却输梅一段香",
    "柴门闻犬吠，风雪夜归人",
    "山回路转不见君，雪上空留马行处",
    "六出飞花入户时，坐看青竹变琼枝",
    
    // 俏皮类
    "听说大雪和火锅更配哦！今晚约吗？🍲",
    "雪人已就位，就差一个你啦！⛄️",
    "冷空气充值成功，你的温暖包裹正在派送中 📦",
    "雪天路滑，小心摔倒～除非摔进我怀里 😉",
    "雪那么大，是不是老天爷在撒糖呀？🍬",
    "冬天要把小可爱裹成小熊才暖和哦！🐻",
    "听说初雪要和喜欢的人一起看 🌨️",
    
    // 英文类
    "Snowflakes are winter's butterflies. Let them bring magic to your day.",
    "Warm thoughts on a cold day. Stay cozy!",
    "Winter is not a season, it's a celebration when I'm with you.",
    "May every snowflake bring you joy and peace.",
    "Cold hands, warm heart. Always thinking of you.",
    "The beauty of winter is that it makes you appreciate the warmth."
  ];
  
  // ==================== 卡片管理器 ====================
  class CardManager {
    constructor(container, blessings) {
      this.container = container;
      this.blessings = blessings;
      this.cards = [];
      this.currentIndex = 0;
      this.isPlaying = false;
      
      // 表情符号库
      this.emojiList = ['❄️', '🌨️', '✨', '💝', '❤️', '🌟', '💫', '🌸', '🕊️', '🌈', '☃️', '🎁', '💖', '🧡', '💛'];
    }
    
    /**
     * 获取随机表情符号
     */
    getRandomEmoji() {
      return this.emojiList[Math.floor(Math.random() * this.emojiList.length)];
    }
    
    /**
     * 生成随机位置和角度
     */
    getRandomPosition() {
      // 保证可见：横向 12-78vw，纵向 20-82vh，且尽量避开中间彩蛋区域
      // 中心区域大致为 32-68vw, 32-66vh，尽量不落在中间
      let left = 50, top = 50;
      for (let i = 0; i < 8; i++) {
        left = Math.random() * 66 + 12; // 12vw - 78vw
        top = Math.random() * 62 + 20;  // 20vh - 82vh
        const isCenter = left > 32 && left < 68 && top > 32 && top < 66;
        if (!isCenter) break;
      }
      const zIndex = Math.floor(Math.random() * 90) + 10; // 10 - 100
      
      // 随机角度：50%概率正着，50%概率斜着（-15度到15度）
      const isTilted = Math.random() > 0.5;
      const rotation = isTilted ? (Math.random() - 0.5) * 30 : 0; // -15度到15度
      
      return { left, top, zIndex, rotation };
    }
    
    /**
     * 创建单张卡片
     */
    createCard(text, index, positionOverride) {
      const card = document.createElement('div');
      card.className = 'popup-card';
      
      // 随机长宽倾向，窄屏适配：有 25% 概率生成稍窄的竖向卡
      const isNarrow = Math.random() < 0.25;
      const minW = isNarrow ? 160 : 200;
      const maxW = isNarrow ? 220 : 260;
      
      // 检查文案是否已有表情符号，如果没有则添加
      const emoji = this.getRandomEmoji();
      const hasEmoji = /[❄️🌨️✨💝❤️🌟💫🌸🕊️🌈☃️🎁💖🧡💛🍲⛄️📦😉🍬🐻☃️🌨️👣🛏️]/.test(text);
      card.textContent = hasEmoji ? text : text + ' ' + emoji;
      card.dataset.index = index;
      
      // 获取位置和角度，开场可以传入居中位置
      const position = positionOverride || this.getRandomPosition();
      
      // 设置初始样式（包含旋转角度）
      card.style.cssText = `
        position: absolute;
        left: ${position.left}vw;
        top: ${position.top}vh;
        z-index: ${position.zIndex};
        opacity: 0;
        transform: translateY(100px) scale(0.8) rotate(${position.rotation}deg);
        pointer-events: none;
        transform-origin: center center;
        width: fit-content;
        max-width: ${maxW}px;
        min-width: ${minW}px;
      `;
      
      // 保存初始旋转角度
      card.dataset.rotation = position.rotation;
      
      // 添加到容器
      this.container.appendChild(card);
      
      // 触发弹出动画
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          card.style.pointerEvents = 'auto';
          card.style.opacity = '1';
          card.style.transform = `translateY(0) scale(1) rotate(${position.rotation}deg)`;
          card.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
      });
      
      // 桌面悬停效果
      card.addEventListener('mouseenter', () => {
        const rotation = parseFloat(card.dataset.rotation);
        card.style.transform = `translateY(-10px) scale(1.05) rotate(${rotation}deg)`;
        card.style.zIndex = '1000';
        card.style.transition = 'all 0.3s ease';
      });
      
      card.addEventListener('mouseleave', () => {
        const rotation = parseFloat(card.dataset.rotation);
        card.style.transform = `translateY(0) scale(1) rotate(${rotation}deg)`;
        const pos = this.getRandomPosition();
        card.style.zIndex = pos.zIndex;
      });
      
      // 触控：单击放大展示，双击（双触）删除；桌面点击仍然删除
      card.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'touch') {
          const now = Date.now();
          const last = Number(card.dataset.lastTap || 0);
          const rotation = parseFloat(card.dataset.rotation);
          
          if (now - last < 450) {
            card.dataset.lastTap = 0;
            this.removeCard(card);
            return;
          }
          
          card.dataset.lastTap = now;
          card.classList.add('active');
          card.style.transform = `translateY(-10px) scale(1.05) rotate(${rotation}deg)`;
          setTimeout(() => {
            card.classList.remove('active');
            // 恢复原位但保持当前 z-index
            card.style.transform = `translateY(0) scale(1) rotate(${rotation}deg)`;
          }, 1200);
        } else {
          this.removeCard(card);
        }
      });
      
      this.cards.push(card);
      return card;
    }
    
    /**
     * 移除卡片（飞出动画）
     */
    removeCard(card) {
      const randomX = (Math.random() - 0.5) * 120;
      const randomY = -Math.random() * 140 - 60;
      const randomRotate = (Math.random() - 0.5) * 50;
      
      card.style.transition = 'transform 0.55s cubic-bezier(0.22, 0.61, 0.36, 1), opacity 0.55s ease, filter 0.55s ease';
      card.style.opacity = '0';
      card.style.filter = 'blur(2px)';
      card.style.transform = `translate(${randomX}px, ${randomY}px) scale(0.86) rotate(${randomRotate}deg)`;
      
      setTimeout(() => {
        if (card.parentNode) {
          card.remove();
        }
      }, 550);
    }
    
    /**
     * 开始逐条弹出
     */
    startPopup() {
      if (this.isPlaying) return;
      this.isPlaying = true;
      this.currentIndex = 0;
      
      console.log('开始逐条弹出卡片...');
      
      // 开场快速覆盖中心彩蛋：优先在中部投放 6-8 张
      const coverCount = 0; // 现在不在中心区域铺卡，直接常规随机
      
      const popNext = () => {
        if (this.currentIndex >= this.blessings.length) {
          this.onComplete();
          return;
        }
        
        this.createCard(this.blessings[this.currentIndex], this.currentIndex);
        this.currentIndex++;
        
        // 随机间隔 380-630ms，稍稀疏
        const delay = Math.random() * 250 + 380;
        setTimeout(popNext, delay);
      };
      
      // 等待开场覆盖后，再进入常规弹出
      setTimeout(popNext, 0);
    }
    
    /**
     * 所有卡片弹出完成
     */
    onComplete() {
      console.log('✅ 所有卡片已弹出');
    }
  }
  
  // ==================== 简单雪花效果 ====================
  function createSnowflakes() {
    const container = document.querySelector('.particles') || document.body;
    const snowflakeCount = window.innerWidth < 768 ? 18 : 32;
    
    for (let i = 0; i < snowflakeCount; i++) {
      const snowflake = document.createElement('div');
      snowflake.classList.add('snowflake');
      
      const size = Math.random() * 10 + 5;
      snowflake.style.width = `${size}px`;
      snowflake.style.height = `${size}px`;
      snowflake.style.left = `${Math.random() * 100}vw`;
      snowflake.style.top = `${Math.random() * -100}px`;
      snowflake.style.opacity = Math.random() * 0.6 + 0.3;
      
      const duration = Math.random() * 10 + 10;
      snowflake.style.animationDuration = `${duration}s`;
      snowflake.style.animationDelay = `${Math.random() * 5}s`;
      
      container.appendChild(snowflake);
      
      setTimeout(() => {
        if (snowflake.parentNode) {
          snowflake.remove();
        }
      }, duration * 1000);
    }
  }
  
  // ==================== 页面切换 ====================
  function switchToPage2() {
    console.log('切换到第二页...');
    
    const page1 = document.getElementById('page1');
    const page2 = document.getElementById('page2');
    
    if (!page1 || !page2) {
      console.error('找不到页面元素！');
      return;
    }
    
    // 第一页淡出
    page1.style.transition = 'opacity 0.6s ease';
    page1.style.opacity = '0';
    page1.style.pointerEvents = 'none';
    
    // 第二页显示
    setTimeout(() => {
      page2.style.display = 'block';
      page2.style.opacity = '0';
      page2.style.visibility = 'visible';
      
      // 显示音乐控制
      if (musicControl) {
        musicControl.classList.remove('hidden');
      }
      
      // 淡入动画
      requestAnimationFrame(() => {
        page2.style.transition = 'opacity 0.6s ease';
        page2.style.opacity = '1';
      });
      
      // 延迟500ms后开始弹出卡片和播放音乐
      setTimeout(() => {
        // 开始弹出卡片
        const container = document.getElementById('blessingsContainer');
        if (container) {
          const cardManager = new CardManager(container, blessings);
          cardManager.startPopup();
        }
        
        // 播放背景音乐（如果音频文件存在）
        if (window.audioManager) {
          if (typeof window.audioManager.forceUnlock === 'function') {
            window.audioManager.forceUnlock();
          }
          window.audioManager.play()
            .then((ok) => {
              updateMusicUI(!!ok);
            })
            .catch(() => {
              console.log('音频播放失败，继续其他功能');
              updateMusicUI(false);
            });
        } else {
          updateMusicUI(false);
        }
      }, 500);
      
    }, 300);
  }
  
  // ==================== 音乐控制 ====================
  async function toggleMusic() {
    if (!window.audioManager) return;
    
    if (typeof window.audioManager.forceUnlock === 'function') {
      window.audioManager.forceUnlock();
    }
    
    if (window.audioManager.isPlaying) {
      window.audioManager.pause();
      updateMusicUI(false);
    } else {
      const ok = await window.audioManager.play();
      updateMusicUI(!!ok);
    }
  }
  
  function updateMusicUI(isPlaying) {
    if (!musicControl) return;
    musicControl.classList.toggle('paused', !isPlaying);
    if (musicStatus) {
      musicStatus.textContent = isPlaying ? '播放中' : '已暂停';
    }
  }
  
  // ==================== 初始化 ====================
  function init() {
    console.log('初始化应用...');
    
    const enterBtn = document.getElementById('enterBtn');
    musicControl = document.getElementById('musicControl');
    musicStatus = document.getElementById('musicStatus');
    
    if (!enterBtn) {
      console.error('找不到进入按钮！');
      return;
    }
    
    // 绑定点击事件
    enterBtn.addEventListener('click', function() {
      console.log('按钮被点击');
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
        switchToPage2();
      }, 150);
    });
    
    // 音乐控制按钮
    if (musicControl) {
      musicControl.addEventListener('click', () => {
        toggleMusic();
      });
      updateMusicUI(false);
    }
    
    // 初始雪花效果
    createSnowflakes();
    setInterval(createSnowflakes, 5000);
    
    // 预加载第二页
    setTimeout(() => {
      const page2 = document.getElementById('page2');
      if (page2) {
        page2.style.display = 'none';
      }
    }, 100);
    
    console.log('初始化完成');
  }
  
  // 启动应用
  init();
  
  // 添加CSS动画
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
});
