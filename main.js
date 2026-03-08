// 春日祝福H5 - 逐条弹出卡片版
document.addEventListener('DOMContentLoaded', function () {
  console.log('页面加载完成，开始初始化...');

  // 音乐控制组件引用
  let musicControl = null;
  let musicStatus = null;
  let particleIntervalId = null;
  let currentCardManager = null;

  // ==================== 祝福语数据 ====================
  const blessings = [
    // 温暖类
    '春风有信，花开有期，愿你的每一天都被温柔照亮 🌸',
    '把冬天的遗憾种进春天，等风一吹就开满希望',
    '愿你在这个春天，抬头有暖阳，低头有花香',
    '草木蔓发，春山可望，愿你所念皆有回响',
    '愿所有美好，都在春天里和你不期而遇',
    '春日迟迟，卉木萋萋，愿你平安喜乐',
    '把心放在春光里，日子自然会发芽',

    // 诗意类
    '等闲识得东风面，万紫千红总是春',
    '沾衣欲湿杏花雨，吹面不寒杨柳风',
    '春水初生，春林初盛，春风十里不如你',
    '人随春好，春与人宜，愿你诸事皆顺',
    '春色满园关不住，愿你的好运也挡不住',
    '最是一年春好处，愿你不负春光不负己',

    // 俏皮类
    '听说春天和见面更配，今天要不要出来走走？🌿',
    '花都开好了，就差你把笑容也打开啦 😄',
    '你的春日好运包裹已发货，请注意签收 📦',
    '风很软，阳光很甜，今天也要元气满满呀',
    '春困别怕，快乐会先醒来 😎',
    '把烦恼交给风，把好心情留给春天吧',
    '新芽都在努力长大，我们也一起向前吧 🌱',

    // 英文类
    'Spring writes a soft poem for everyone. May it include you.',
    'May this spring bring light, bloom, and good news to you.',
    'Let every breeze carry a little joy into your day.',
    'The sun is warmer now, and so is life.',
    'Fresh season, fresh hope, fresh smile.',
    'Bloom gently, live brightly, and stay kind.'
  ];

  // ==================== 卡片管理器 ====================
  class CardManager {
    constructor(container, blessingList) {
      this.container = container;
      this.blessings = blessingList;
      this.cards = [];
      this.currentIndex = 0;
      this.isPlaying = false;
      this.emojiList = ['🌸', '🌷', '🌼', '🌿', '🍃', '🪻', '💐', '✨', '☀️', '🌱', '🕊️', '🍀', '🩷'];

      this.layoutPlan = [];
      this.mainLayerCount = 0;
      this.isMobile = window.innerWidth < 768;
      this.targetCardCount = this.isMobile ? 24 : 28;
      this.overlapCount = this.isMobile ? 8 : 9;
      this.safePadding = this.isMobile ? 10 : 16;
      this.blessingQueue = [];
      this.viewport = this.getViewport();
    }

    getViewport() {
      return {
        width: window.innerWidth,
        height: window.innerHeight
      };
    }

    clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    shuffle(array) {
      const copy = [...array];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }

    nextBlessing() {
      if (!this.blessingQueue.length) {
        this.blessingQueue = this.shuffle(this.blessings);
      }
      return this.blessingQueue.pop();
    }

    getRandomEmoji() {
      return this.emojiList[Math.floor(Math.random() * this.emojiList.length)];
    }

    buildMainAnchors(count) {
      const cols = this.isMobile ? 4 : 5;
      const rows = Math.ceil(count / cols);
      const xMin = this.viewport.width * (this.isMobile ? 0.14 : 0.1);
      const xMax = this.viewport.width * (this.isMobile ? 0.86 : 0.9);
      const yMin = this.viewport.height * 0.14;
      const yMax = this.viewport.height * 0.86;
      const stepX = cols > 1 ? (xMax - xMin) / (cols - 1) : 0;
      const stepY = rows > 1 ? (yMax - yMin) / (rows - 1) : 0;
      const jitterX = stepX * (this.isMobile ? 0.16 : 0.22);
      const jitterY = stepY * (this.isMobile ? 0.18 : 0.24);
      const anchors = [];

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          anchors.push({
            x: xMin + col * stepX + (Math.random() - 0.5) * jitterX,
            y: yMin + row * stepY + (Math.random() - 0.5) * jitterY,
            stepX,
            stepY
          });
        }
      }

      return this.shuffle(anchors).slice(0, count);
    }

    buildLayoutPlan() {
      this.viewport = this.getViewport();
      this.isMobile = this.viewport.width < 768;
      this.targetCardCount = this.isMobile ? 24 : 28;
      this.overlapCount = this.isMobile ? 8 : 9;
      this.mainLayerCount = Math.max(12, this.targetCardCount - this.overlapCount);
      this.safePadding = this.isMobile ? 10 : 16;

      const mainAnchors = this.buildMainAnchors(this.mainLayerCount);
      const plan = [];

      for (let i = 0; i < mainAnchors.length; i++) {
        const anchor = mainAnchors[i];
        plan.push({
          x: anchor.x,
          y: anchor.y,
          rotation: (Math.random() - 0.5) * 18,
          zIndex: 40 + i
        });
      }

      for (let i = 0; i < this.overlapCount; i++) {
        const base = mainAnchors[i % mainAnchors.length];
        const offsetX = (Math.random() - 0.5) * base.stepX * 0.62;
        const offsetY = (Math.random() - 0.5) * base.stepY * 0.6;
        plan.push({
          x: base.x + offsetX,
          y: base.y + offsetY,
          rotation: (Math.random() - 0.5) * 30,
          zIndex: 220 + i
        });
      }

      this.layoutPlan = plan;
    }

    applyClampedPosition(card, point) {
      const width = card.offsetWidth || 220;
      const height = card.offsetHeight || 90;
      const safe = this.safePadding;
      const minLeft = safe;
      const minTop = safe;
      const maxLeft = Math.max(minLeft, this.viewport.width - width - safe);
      const maxTop = Math.max(minTop, this.viewport.height - height - safe);

      const left = this.clamp(point.x - width / 2, minLeft, maxLeft);
      const top = this.clamp(point.y - height / 2, minTop, maxTop);

      card.style.left = `${Math.round(left)}px`;
      card.style.top = `${Math.round(top)}px`;
      card.dataset.anchorRatioX = (point.x / this.viewport.width).toFixed(6);
      card.dataset.anchorRatioY = (point.y / this.viewport.height).toFixed(6);
      card.dataset.rotation = String(point.rotation || 0);
    }

    createCard(text, index, positionOverride) {
      const card = document.createElement('div');
      card.className = 'popup-card';

      const isNarrow = Math.random() < 0.22;
      const minW = isNarrow ? 156 : 196;
      const maxW = isNarrow ? 216 : 268;

      const emoji = this.getRandomEmoji();
      const hasEmoji = /[🌸🌷🌼🌿🍃🪻💐✨☀️🌱🕊️🍀🩷😄😎📦]/.test(text);
      card.textContent = hasEmoji ? text : `${text} ${emoji}`;
      card.dataset.index = String(index);

      const position = positionOverride || {
        x: this.viewport.width * 0.5,
        y: this.viewport.height * 0.5,
        zIndex: 60,
        rotation: 0
      };

      card.style.cssText = `
        position: absolute;
        left: 0px;
        top: 0px;
        z-index: ${position.zIndex};
        opacity: 0;
        transform: translateY(90px) scale(0.82) rotate(${position.rotation}deg);
        pointer-events: none;
        transform-origin: center center;
        width: fit-content;
        max-width: ${maxW}px;
        min-width: ${minW}px;
      `;

      this.container.appendChild(card);
      this.applyClampedPosition(card, position);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          card.style.pointerEvents = 'auto';
          card.style.opacity = '1';
          card.style.transform = `translateY(0) scale(1) rotate(${position.rotation}deg)`;
          card.style.transition = 'all 0.58s cubic-bezier(0.3, 1.45, 0.62, 1)';
        });
      });

      card.addEventListener('mouseenter', () => {
        const rotation = Number(card.dataset.rotation || 0);
        card.style.transform = `translateY(-10px) scale(1.05) rotate(${rotation}deg)`;
        card.style.zIndex = '1000';
        card.style.transition = 'all 0.26s ease';
      });

      card.addEventListener('mouseleave', () => {
        const rotation = Number(card.dataset.rotation || 0);
        card.style.transform = `translateY(0) scale(1) rotate(${rotation}deg)`;
      });

      // 触控单击放大、双击删除；桌面点击删除
      card.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'touch') {
          const now = Date.now();
          const last = Number(card.dataset.lastTap || 0);
          const rotation = Number(card.dataset.rotation || 0);

          if (now - last < 420) {
            card.dataset.lastTap = '0';
            this.removeCard(card);
            return;
          }

          card.dataset.lastTap = String(now);
          card.classList.add('active');
          card.style.transform = `translateY(-10px) scale(1.05) rotate(${rotation}deg)`;
          setTimeout(() => {
            card.classList.remove('active');
            card.style.transform = `translateY(0) scale(1) rotate(${rotation}deg)`;
          }, 1100);
        } else {
          this.removeCard(card);
        }
      });

      this.cards.push(card);
      return card;
    }

    removeCard(card) {
      const randomX = (Math.random() - 0.5) * 130;
      const randomY = -Math.random() * 130 - 65;
      const randomRotate = (Math.random() - 0.5) * 56;

      card.style.transition = 'transform 0.52s cubic-bezier(0.22, 0.61, 0.36, 1), opacity 0.52s ease, filter 0.52s ease';
      card.style.opacity = '0';
      card.style.filter = 'blur(2px)';
      card.style.transform = `translate(${randomX}px, ${randomY}px) scale(0.86) rotate(${randomRotate}deg)`;

      setTimeout(() => {
        if (card.parentNode) {
          card.remove();
        }
      }, 520);
    }

    startPopup() {
      if (this.isPlaying) return;
      this.isPlaying = true;
      this.currentIndex = 0;
      this.buildLayoutPlan();

      const popNext = () => {
        if (this.currentIndex >= this.targetCardCount) {
          this.onComplete();
          return;
        }

        const text = this.nextBlessing();
        const position = this.layoutPlan[this.currentIndex];
        this.createCard(text, this.currentIndex, position);
        this.currentIndex++;

        const isOverlapPhase = this.currentIndex > this.mainLayerCount;
        const delay = isOverlapPhase ? (Math.random() * 160 + 210) : (Math.random() * 230 + 320);
        setTimeout(popNext, delay);
      };

      setTimeout(popNext, 0);
    }

    reclampCards() {
      this.viewport = this.getViewport();
      this.isMobile = this.viewport.width < 768;
      this.safePadding = this.isMobile ? 10 : 16;

      this.cards.forEach((card) => {
        if (!card.isConnected) return;
        const ratioX = Number(card.dataset.anchorRatioX);
        const ratioY = Number(card.dataset.anchorRatioY);
        const fallbackX = card.offsetLeft + card.offsetWidth / 2;
        const fallbackY = card.offsetTop + card.offsetHeight / 2;
        const x = Number.isFinite(ratioX) ? ratioX * this.viewport.width : fallbackX;
        const y = Number.isFinite(ratioY) ? ratioY * this.viewport.height : fallbackY;
        const rotation = Number(card.dataset.rotation || 0);

        this.applyClampedPosition(card, {
          x,
          y,
          rotation,
          zIndex: Number(card.style.zIndex || 60)
        });
      });
    }

    onComplete() {
      console.log('所有春日卡片已弹出');
    }
  }

  // ==================== 春季粒子系统 ====================
  function getPerformanceProfile() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return 'reduced';

    const cores = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 4;
    const isMobile = window.innerWidth < 768;

    let score = 0;
    if (cores >= 8) score += 2;
    else if (cores >= 4) score += 1;

    if (memory >= 8) score += 2;
    else if (memory >= 4) score += 1;

    if (!isMobile) score += 1;

    if (score >= 4) return 'high';
    if (score >= 2) return 'medium';
    return 'low';
  }

  function createPetals(container, count, isMobile) {
    for (let i = 0; i < count; i++) {
      const petal = document.createElement('div');
      petal.classList.add('petal');

      const size = Math.random() * 8 + 8;
      petal.style.width = `${size}px`;
      petal.style.height = `${Math.max(7, size * 0.78)}px`;
      petal.style.left = `${Math.random() * 100}vw`;
      petal.style.top = `${Math.random() * -120 - 10}px`;

      const duration = Math.random() * 7 + 8;
      const drift = (Math.random() - 0.5) * (isMobile ? 82 : 140);
      const spin = `${(Math.random() - 0.5) * 460}deg`;

      petal.style.setProperty('--drift-x', `${drift}px`);
      petal.style.setProperty('--spin', spin);
      petal.style.animationDuration = `${duration}s`;
      petal.style.animationDelay = `${Math.random() * 2.2}s`;
      petal.style.opacity = `${Math.random() * 0.36 + 0.54}`;

      container.appendChild(petal);

      setTimeout(() => {
        if (petal.parentNode) {
          petal.remove();
        }
      }, (duration + 2.2) * 1000);
    }
  }

  function createGlowDots(container, count, isMobile) {
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('div');
      dot.classList.add('glow-dot');

      const size = Math.random() * 5 + 3;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.left = `${Math.random() * 100}vw`;
      dot.style.top = `${Math.random() * 100}vh`;

      dot.style.setProperty('--drift-x', `${(Math.random() - 0.5) * (isMobile ? 26 : 44)}px`);
      dot.style.setProperty('--drift-y', `${-Math.random() * (isMobile ? 22 : 36)}px`);
      dot.style.animationDuration = `${Math.random() * 3 + 2.6}s`;
      dot.style.animationDelay = `${Math.random() * 1.6}s`;
      dot.style.opacity = `${Math.random() * 0.35 + 0.45}`;

      container.appendChild(dot);

      setTimeout(() => {
        if (dot.parentNode) {
          dot.remove();
        }
      }, 5500);
    }
  }

  function createSpringParticles() {
    const container = document.querySelector('.particles') || document.body;
    const isMobile = window.innerWidth < 768;
    const profile = getPerformanceProfile();

    if (profile === 'reduced') return;

    if (profile === 'high') {
      createPetals(container, isMobile ? 10 : 14, isMobile);
      createGlowDots(container, isMobile ? 10 : 16, isMobile);
      return;
    }

    if (profile === 'medium') {
      createPetals(container, isMobile ? 8 : 11, isMobile);
      return;
    }

    // low: 保留轻量点光，确保流畅
    createGlowDots(container, isMobile ? 8 : 12, isMobile);
  }

  function startSpringParticles() {
    if (particleIntervalId) return;

    const profile = getPerformanceProfile();
    if (profile === 'reduced') return;

    createSpringParticles();
    const interval = profile === 'high' ? 1900 : (profile === 'medium' ? 2200 : 2600);
    particleIntervalId = setInterval(createSpringParticles, interval);
  }

  function stopSpringParticles() {
    if (!particleIntervalId) return;
    clearInterval(particleIntervalId);
    particleIntervalId = null;
  }

  // ==================== 页面切换 ====================
  function switchToPage2() {
    const page1 = document.getElementById('page1');
    const page2 = document.getElementById('page2');

    if (!page1 || !page2) {
      console.error('找不到页面元素');
      return;
    }

    page1.style.transition = 'opacity 0.6s ease';
    page1.style.opacity = '0';
    page1.style.pointerEvents = 'none';

    setTimeout(() => {
      page2.style.display = 'block';
      page2.style.opacity = '0';
      page2.style.visibility = 'visible';

      if (musicControl) {
        musicControl.classList.remove('hidden');
      }

      requestAnimationFrame(() => {
        page2.style.transition = 'opacity 0.6s ease';
        page2.style.opacity = '1';
      });

      setTimeout(() => {
        const container = document.getElementById('blessingsContainer');
        if (container) {
          currentCardManager = new CardManager(container, blessings);
          currentCardManager.startPopup();
        }

        if (window.audioManager) {
          if (typeof window.audioManager.forceUnlock === 'function') {
            window.audioManager.forceUnlock();
          }
          window.audioManager.play()
            .then((ok) => {
              updateMusicUI(Boolean(ok));
            })
            .catch(() => {
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
      updateMusicUI(Boolean(ok));
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
    const enterBtn = document.getElementById('enterBtn');
    musicControl = document.getElementById('musicControl');
    musicStatus = document.getElementById('musicStatus');

    if (!enterBtn) {
      console.error('找不到进入按钮');
      return;
    }

    enterBtn.addEventListener('click', function () {
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
        switchToPage2();
      }, 140);
    });

    if (musicControl) {
      musicControl.addEventListener('click', () => {
        toggleMusic();
      });
      updateMusicUI(false);
    }

    startSpringParticles();

    setTimeout(() => {
      const page2 = document.getElementById('page2');
      if (page2) {
        page2.style.display = 'none';
      }
    }, 100);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopSpringParticles();
      } else {
        startSpringParticles();
      }
    });

    window.addEventListener('resize', () => {
      stopSpringParticles();
      startSpringParticles();
      if (currentCardManager) {
        currentCardManager.reclampCards();
      }
    });

    window.addEventListener('orientationchange', () => {
      if (currentCardManager) {
        setTimeout(() => {
          currentCardManager.reclampCards();
        }, 120);
      }
    });

    console.log('春日主题初始化完成');
  }

  init();
});
