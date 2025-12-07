/**
 * 音频管理器 - 自动播放背景音乐
 * 处理浏览器自动播放策略和用户交互解锁
 */

class AudioManager {
    constructor() {
        this.audio = null;
        this.userInteracted = false;
        this.isPlaying = false;
        this.init();
    }
    
    init() {
        // 创建音频实例（使用相对路径，兼容部署）
        const audioPath = './assets/audio/bgm.mp3';
        this.audio = new Audio(audioPath);
        this.audio.loop = true;
        this.audio.volume = 0.6;
        this.audio.preload = 'auto';
        
        // 监听用户交互
        this.setupUserInteraction();
        
        // 错误处理（优雅降级）
        this.audio.addEventListener('error', (e) => {
            console.warn('⚠️ 音频文件不存在或加载失败，将静默运行（不影响其他功能）');
            // 音频加载失败不影响其他功能
            this.audio = null;
        });
        
        this.audio.addEventListener('loadeddata', () => {
            console.log('✅ 音频加载成功');
        });
    }
    
    /**
     * 设置用户交互监听
     */
    setupUserInteraction() {
        // 监听所有可能的用户交互
        const events = ['click', 'touchstart', 'keydown'];
        
        events.forEach(eventType => {
            document.addEventListener(eventType, () => {
                if (!this.userInteracted) {
                    this.userInteracted = true;
                    console.log('👆 用户已交互，音频已解锁');
                }
            }, { once: true });
        });
    }
    
    /**
     * 播放音乐
     */
    async play() {
        // 如果音频不存在，静默返回
        if (!this.audio) {
            return false;
        }
        
        if (!this.userInteracted) {
            console.warn('⚠️ 用户尚未交互，无法自动播放');
            return false;
        }
        
        if (this.isPlaying) {
            return true;
        }
        
        try {
            await this.audio.play();
            this.isPlaying = true;
            console.log('✅ 背景音乐开始播放');
            return true;
        } catch (error) {
            console.warn('⚠️ 自动播放被阻止（不影响其他功能）:', error);
            return false;
        }
    }
    
    /**
     * 暂停音乐
     */
    pause() {
        if (this.audio && !this.audio.paused) {
            this.audio.pause();
            this.isPlaying = false;
            console.log('⏸️ 背景音乐已暂停');
        }
    }
    
    /**
     * 显示手动播放按钮（fallback）
     */
    showPlayButton() {
        // 如果自动播放失败，可以显示一个播放按钮
        // 这里暂时不实现，因为按钮点击已经解锁了音频
    }
    
    /**
     * 设置音量
     */
    setVolume(volume) {
        if (this.audio) {
            this.audio.volume = Math.max(0, Math.min(1, volume));
        }
    }
}

// 创建全局实例
window.audioManager = new AudioManager();
