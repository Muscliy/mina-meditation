// pages/countdown/index.ts
const myaudio: any = wx.createInnerAudioContext();
const backgroundAudioManager:any = wx.getBackgroundAudioManager()
const waitSecode = 4;
Page({

  /**
   * Page initial data
   */
  data: {
    totalTime: 10 + waitSecode,
    time: 10 * 1000 + waitSecode * 1000,
    progress: 0,
    timeData: {},
    ring: 1,
    finished: false,
    brightness: 1,
    canBrightness: true,
    title: ""
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(option: any) {
    const {t, r} = option || {t: 30, r: 1}
    wx.setKeepScreenOn({keepScreenOn: true})
    this.setData({
      totalTime: Number(t) * 60 + waitSecode,
      time: Number(t) * 60 * 1000 + waitSecode * 1000,
      ring: Number(r),
    })

    wx.getScreenBrightness({success: (val) => {
      this.setData({brightness: Number(val.value)})
    }})
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {
    this.start()
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {
    backgroundAudioManager.onEnded(()=>{
        backgroundAudioManager.src=`https://wlhyos-web-dev.oss-cn-hangzhou.aliyuncs.com/resource/video/3.mp3`
        backgroundAudioManager.title = '测试音频';
        backgroundAudioManager.epname = '测试副标题';
        backgroundAudioManager.play()
      })
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {
    wx.setScreenBrightness({value: this.data.brightness})
  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {
    // myaudio.pause()
    backgroundAudioManager.stop();
    this.pause()
    wx.setKeepScreenOn({keepScreenOn: false})
    wx.setScreenBrightness({value: this.data.brightness})
  },


  onChange(e: any) {
    const remainTime = e.detail.hours * 60 * 60 + e.detail.minutes * 60 + e.detail.seconds;
    const value = ( (this.data.totalTime - remainTime) / this.data.totalTime ) * 100
    if ((remainTime + waitSecode) === this.data.totalTime) {
      this.onStart()
    }
    if (remainTime > 15 && (this.data.totalTime - remainTime) > 15 && (remainTime - 15) % 15 == 0 ) {
      if (this.data.canBrightness) {
        wx.setScreenBrightness({value: 0})
      } else {
        this.setData({
          canBrightness: true
        })
      } 
    }

    if (remainTime === 5) {
      wx.setScreenBrightness({value: this.data.brightness})
    }
    this.setData({
      timeData: e.detail,
      progress: value
    });
  },

  onFinish() {
    // myaudio.pause()
    // myaudio.src=`/assets/${this.data.ring}.mp3`
    // myaudio.play()
    backgroundAudioManager.title = this.data.ring;
    backgroundAudioManager.src=`https://wlhyos-web-dev.oss-cn-hangzhou.aliyuncs.com/resource/video/${this.data.ring}.mp3`
    
    this.setData({
      finished: true
    })
  },

  onTapEnd() {
    wx.showModal({
      title: '提示',
      content: '确定结束吗？',
      success (res) {
        if (res.confirm) {
          wx.navigateBack()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  onBack() {
    wx.navigateBack()
  },

  onStart() {
    // myaudio.pause()
    // myaudio.src=`/assets/${this.data.ring}.mp3`
    // myaudio.play()
    backgroundAudioManager.title = this.data.ring;
    backgroundAudioManager.src=`https://wlhyos-web-dev.oss-cn-hangzhou.aliyuncs.com/resource/video/${this.data.ring}.mp3`
    backgroundAudioManager.play()
  },

  start() {
    const countDown = this.selectComponent('.control-count-down');
    countDown.start();
  },

  pause() {
    const countDown = this.selectComponent('.control-count-down');
    countDown.pause();
  },

  reset() {
    const countDown = this.selectComponent('.control-count-down');
    countDown.reset();
  },

  onTapWake() {
    this.setData({
      canBrightness: false
    })
    wx.setScreenBrightness({value: this.data.brightness})
  }
})