/**
 * 全局背景音乐管理器（单例模式）
 * 确保整个应用只有一个 Audio 实例
 */

window.BGMAudio = window.BGMAudio || (function() {
    // 创建 Audio 实例（使用相对路径）
    const bgm = new Audio('assets/audio/bgm.mp3');
    
    // 设置音频属性
    bgm.loop = true;
    bgm.volume = 0.7;
    bgm.preload = 'auto';
    
    // 标记用户是否已激活
    let userActivated = false;
    
    // 音频加载错误处理
    bgm.addEventListener('error', function(e) {
        console.error('❌ 音频加载错误:', e);
        console.error('音频路径:', bgm.src);
        if (bgm.error) {
            console.error('错误代码:', bgm.error.code);
        }
    });
    
    // 音频加载成功
    bgm.addEventListener('loadeddata', function() {
        console.log('✅ 音频数据加载成功');
    });
    
    bgm.addEventListener('canplay', function() {
        console.log('✅ 音频可以播放');
    });
    
    bgm.addEventListener('playing', function() {
        console.log('🎵 音频正在播放');
    });
    
    bgm.addEventListener('pause', function() {
        console.log('⏸️ 音频已暂停');
    });
    
    bgm.addEventListener('ended', function() {
        console.log('⏹️ 音频播放结束');
    });
    
    return {
        getAudio: function() {
            return bgm;
        },
        
        userActivate: function() {
            if (userActivated) return;
            userActivated = true;
            console.log('👆 用户已激活音频');
            
            // 尝试播放
            const playPromise = bgm.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('✅ 音频播放成功');
                    })
                    .catch(error => {
                        console.warn('⚠️ 音频播放失败:', error);
                    });
            }
        },
        
        play: function() {
            if (!userActivated) {
                console.warn('⚠️ 用户尚未激活音频，无法自动播放');
                return;
            }
            
            if (bgm.paused) {
                const playPromise = bgm.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            console.log('✅ 音频继续播放');
                        })
                        .catch(error => {
                            console.warn('⚠️ 音频播放失败:', error);
                        });
                }
            }
        },
        
        pause: function() {
            bgm.pause();
        },
        
        isPlaying: function() {
            return !bgm.paused && !bgm.ended && bgm.readyState > 2;
        }
    };
})();

