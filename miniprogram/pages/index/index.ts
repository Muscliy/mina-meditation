// index.ts
// 获取应用实例
const app = getApp<IAppOption>()
const myaudio = wx.createInnerAudioContext()

Page({
  data: {
    motto: '念念不忘，必有回响',
    timer: 30,
    ring: '1',
    selectedRing: '1',
    showTimer: false,
    showTimerPicker: false,
    showRing: false,
    selfTime: false,
    timers: [
      2, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60,
    ],
    currentDate: '01:00',
    timerPicker: {
      minHour: 0,
      maxHour: 24,
    },
    rings: [1, 2, 3, 4],
    formatter(type: string, value: string) {
      if (type === 'hour') {
        return `${value}小时`;
      }
      if (type === 'minute') {
        return `${value}分钟`;
      }
      return value;
    },
  },

  onLoad() {
    const res = wx.getStorageSync('setting')
    const data = JSON.parse(res || "")
    const {timer, ring} = data;
    if (timer) {
      this.setData({
        timer,
        ring
      })
    }
  },

  onHide() {
    myaudio.pause()
  },

  onSelectTimer() {
    this.setData({showTimer: true})
  },

  onCloseTimerSelector() {
    this.setData({showTimer: false, showTimerPicker:false})
  },

  onSelectTimerPicker() {
    this.setData({showTimerPicker: true})
  },

  onCloseTimerPciker() {
    this.setData({showTimerPicker: false})
  },

  onSelectRing() {
    this.setData({showRing: true})
  },

  onCloseSelectRing() {
    this.setData({showRing: false})
  },

  onInput(event:any) {
    const hour = event.detail.split(":")[0];
    const minute = event.detail.split(":")[1];
    const time = Number(hour) * 60 + Number(minute);
    this.setData({
      currentDate: event.detail,
      timer: time,
      showTimerPicker: false,
      selfTime: true,
    })
  },

  onChangeTimer(event:any) {
    const time = event.currentTarget.dataset.item
    this.setData({
      timer: Number(time),
      showTimer: false,
      selfTime: false,
    })
  },

  onOverviewRing(event: any) {
    const ring = event.currentTarget.dataset.item
    myaudio.pause()
    myaudio.src=`/assets/${ring}.mp3`
    myaudio.play()
    this.setData({
      selectedRing: ring,
    })
  },

  onChangeRing() {
    this.setData({
      ring: this.data.selectedRing,
      showRing: false
    })
  },

  onTapStart() {
    wx.navigateTo({
      url: `/pages/countdown/index?t=${this.data.timer}&r=${this.data.ring}`,
    })
    wx.setStorageSync( 'setting', JSON.stringify({timer: this.data.timer, ring: this.data.ring}))
  }
})
