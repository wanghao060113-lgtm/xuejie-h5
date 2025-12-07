// 大雪祝福H5 - 逐条弹出卡片版
document.addEventListener('DOMContentLoaded', function() {
  console.log('页面加载完成，开始初始化...');
  
  // ==================== 祝福语数据 ====================
  const blessings = [
    // 温馨祝福类 (20条)
    "大雪至，寒冬深，愿有人问你粥可温，有人陪你立黄昏 ❄️",
    "雪落无声，思念有痕，愿这个冬天你被温暖紧紧拥抱",
    "听说下雪的时候，所有愿望都会被精灵听见 ✨",
    "寒潮来袭，记得添衣；大雪纷飞，记得想我",
    "愿这个冬天，有人暖你手，有人暖你心",
    "大雪纷飞时，最暖不过一句：我在 ❤️",
    "冬雪再冷，也冷不过没有你的消息",
    "雪天路滑，牵好我的手，我们一起慢慢走",
    "听说初雪时许的愿望，都会实现哦！",
    "愿每一片雪花，都带着我的祝福落在你肩头",
    "大雪已至，春天还会远吗？",
    "寒夜有灯，冬日有暖，愿你有爱",
    "雪是冬的来信，你是我的牵挂",
    "愿这个冬天，你的笑容比阳光还温暖",
    "大雪压枝低，思念漫心头",
    "天寒地冻，唯真情可融化冰雪",
    "愿有人与你共黄昏，有人问你粥可温",
    "雪是大浪漫，你是小人间",
    "冬天适合思念，更适合相见",
    "愿冬雪洗净尘埃，带来崭新开始",
    
    // 诗意古风类 (15条)
    "晚来天欲雪，能饮一杯无？我温好了酒，等你",
    "白雪却嫌春色晚，故穿庭树作飞花",
    "应是天仙狂醉，乱把白云揉碎",
    "雪满山中高士卧，月明林下美人来",
    "忽如一夜春风来，千树万树梨花开",
    "孤舟蓑笠翁，独钓寒江雪",
    "柴门闻犬吠，风雪夜归人",
    "山回路转不见君，雪上空留马行处",
    "夜深知雪重，时闻折竹声",
    "燕山雪花大如席，片片吹落轩辕台",
    "梅须逊雪三分白，雪却输梅一段香",
    "有梅无雪不精神，有雪无诗俗了人",
    "北国风光，千里冰封，万里雪飘",
    "雪花似掌难遮眼，风力如刀不断愁",
    "六出飞花入户时，坐看青竹变琼枝",
    
    // 可爱俏皮类 (15条)
    "听说大雪和火锅更配哦！今晚约吗？🍲",
    "雪人已就位，就差一个你啦！⛄️",
    "冷空气充值成功，你的温暖包裹正在派送中 📦",
    "雪天路滑，小心摔倒～除非摔进我怀里 😉",
    "冬天有三好：雪好，火锅好，有你最好！",
    "雪那么大，是不是老天爷在撒糖呀？🍬",
    "今天的雪是甜甜的味道，你尝到了吗？",
    "冬天要把小可爱裹成小熊才暖和哦！🐻",
    "雪天四件套：奶茶、烤红薯、糖炒栗子、你 ☃️",
    "听说初雪要和喜欢的人一起看 🌨️",
    "雪地里的脚印，是我走向你的痕迹 👣",
    "冬天不端奶茶杯，孤独一生无人追",
    "下雪了，我可以申请进入你的被窝吗？🛏️",
    "雪天适合谈恋爱，一不小心就白头了",
    "冬天就是要靠近温暖的人和事 ❤️",
    
    // 英文祝福类 (10条)
    "May your winter be as warm as a hug from someone you love. ❄️",
    "Snowflakes are winter's butterflies. Let them bring magic to your day.",
    "Warm thoughts on a cold day. Stay cozy!",
    "In the midst of winter, I found there was, within me, an invincible summer.",
    "Let the cold wind blow, my heart will keep you warm.",
    "Snow falling silently, my thoughts for you are endless.",
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
      // 确保卡片在可见区域内（留出边距）
      const left = Math.random() * 80 + 10; // 10% - 90%
      const top = Math.random() * 70 + 10;  // 10% - 80%
      const zIndex = Math.floor(Math.random() * 90) + 10; // 10 - 100
      
      // 随机角度：50%概率正着，50%概率斜着（-15度到15度）
      const isTilted = Math.random() > 0.5;
      const rotation = isTilted ? (Math.random() - 0.5) * 30 : 0; // -15度到15度
      
      return { left, top, zIndex, rotation };
    }
    
    /**
     * 创建单张卡片
     */
    createCard(text, index) {
      const card = document.createElement('div');
      card.className = 'popup-card';
      
      // 检查文案是否已有表情符号，如果没有则添加
      const emoji = this.getRandomEmoji();
      const hasEmoji = /[❄️🌨️✨💝❤️🌟💫🌸🕊️🌈☃️🎁💖🧡💛🍲⛄️📦😉🍬🐻☃️🌨️👣🛏️]/.test(text);
      card.textContent = hasEmoji ? text : text + ' ' + emoji;
      card.dataset.index = index;
      
      // 获取随机位置和角度
      const position = this.getRandomPosition();
      
      // 设置初始样式（包含旋转角度）
      card.style.cssText = `
        position: absolute;
        left: ${position.left}%;
        top: ${position.top}%;
        z-index: ${position.zIndex};
        opacity: 0;
        transform: translateY(100px) scale(0.8) rotate(${position.rotation}deg);
        pointer-events: none;
        transform-origin: center center;
        width: fit-content;
        max-width: 320px;
        min-width: 200px;
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
      
      // 添加悬停效果
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
      
      // 点击卡片消失
      card.addEventListener('click', () => {
        this.removeCard(card);
      });
      
      this.cards.push(card);
      return card;
    }
    
    /**
     * 移除卡片（飞出动画）
     */
    removeCard(card) {
      const randomX = (Math.random() - 0.5) * 200;
      const randomY = -Math.random() * 200 - 100;
      
      card.style.transition = 'all 0.8s ease-out';
      card.style.opacity = '0';
      card.style.transform = `translate(${randomX}px, ${randomY}px) scale(0.5) rotate(${Math.random() * 360}deg)`;
      
      setTimeout(() => {
        if (card.parentNode) {
          card.remove();
        }
      }, 800);
    }
    
    /**
     * 开始逐条弹出
     */
    startPopup() {
      if (this.isPlaying) return;
      this.isPlaying = true;
      this.currentIndex = 0;
      
      console.log('开始逐条弹出卡片...');
      
      const popNext = () => {
        if (this.currentIndex >= this.blessings.length) {
          this.onComplete();
          return;
        }
        
        this.createCard(this.blessings[this.currentIndex], this.currentIndex);
        this.currentIndex++;
        
        // 随机间隔 300-500ms
        const delay = Math.random() * 200 + 300;
        setTimeout(popNext, delay);
      };
      
      // 开始弹出
      popNext();
    }
    
    /**
     * 所有卡片弹出完成
     */
    onComplete() {
      console.log('✅ 所有卡片已弹出');
      
      // 显示完成提示
      const completeMsg = document.createElement('div');
      completeMsg.className = 'complete-message';
      completeMsg.innerHTML = '❄️ 60条祝福已全部送达 ❄️<br><span style="font-size: 14px; opacity: 0.8;">点击卡片可查看详情</span>';
      completeMsg.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 255, 255, 0.95);
        padding: 20px 40px;
        border-radius: 50px;
        color: #1a237e;
        font-size: 18px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: fadeInUp 0.5s ease-out;
      `;
      
      document.body.appendChild(completeMsg);
      
      // 3秒后淡出
      setTimeout(() => {
        completeMsg.style.opacity = '0';
        completeMsg.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
          if (completeMsg.parentNode) {
            completeMsg.remove();
          }
        }, 500);
      }, 3000);
    }
  }
  
  // ==================== 简单雪花效果 ====================
  function createSnowflakes() {
    const container = document.querySelector('.particles') || document.body;
    const snowflakeCount = window.innerWidth < 768 ? 30 : 50;
    
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
          window.audioManager.play().catch(() => {
            // 音频播放失败不影响其他功能
            console.log('音频播放失败，继续其他功能');
          });
        }
      }, 500);
      
    }, 300);
  }
  
  // ==================== 初始化 ====================
  function init() {
    console.log('初始化应用...');
    
    const enterBtn = document.getElementById('enterBtn');
    
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
