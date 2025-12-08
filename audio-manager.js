/**
 * 音频管理器 - 自动播放背景音乐
 * 处理浏览器自动播放策略和用户交互解锁
 */

class AudioManager {
    constructor() {
        this.audio = null;
        // 播放列表：第一首固定为当前文件，第二首请替换为你的新文件名
        this.playlist = [
            './assets/audio/我的秘密0.8x.mp3',
            './assets/audio/反正路也要一个人走.mp3'
        ];
        this.trackIndex = 0;
        this.currentSrc = '';
        this.userInteracted = false;
        this.isPlaying = false;
        this.init();
    }
    
    init() {
        // 创建音频实例（使用相对路径，兼容部署）
        this.audio = new Audio();
        this.audio.loop = false; // 由播放列表顺序循环
        this.audio.volume = 0.6;
        this.audio.preload = 'auto';
        this.loadCurrentTrack();
        
        // 监听用户交互
        this.setupUserInteraction();
        
        // 错误处理：尝试切到下一首
        this.audio.addEventListener('error', (e) => {
            console.warn('⚠️ 当前音频加载失败，尝试下一首', e);
            this.nextTrack(true);
        });
        
        this.audio.addEventListener('loadeddata', () => {
            console.log('✅ 音频加载成功');
        });
        
        // 播放状态同步，方便外部 UI 控制
        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
        });
        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
        });
        this.audio.addEventListener('ended', () => {
            this.isPlaying = false;
            this.nextTrack(true);
        });
    }
    
    /**
     * 加载当前索引的音频
     */
    loadCurrentTrack() {
        if (!this.audio || !this.playlist.length) return;
        const src = this.playlist[this.trackIndex % this.playlist.length];
        this.currentSrc = src;
        this.isPlaying = false;
        this.audio.src = src;
        this.audio.load();
    }
    
    /**
     * 跳到下一首（auto=true 表示结束自动切换）
     */
    nextTrack(auto = false) {
        if (!this.playlist.length) return;
        this.trackIndex = (this.trackIndex + 1) % this.playlist.length;
        this.loadCurrentTrack();
        if (this.isPlaying || auto) {
            this.isPlaying = false;
            this.play();
        }
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
     * 手动解锁（已确认用户点击了交互按钮）
     */
    forceUnlock() {
        this.userInteracted = true;
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
        
        if (this.isPlaying && this.audio.src === this.currentSrc) {
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
