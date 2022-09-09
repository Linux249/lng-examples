import { Lightning, Utils, VideoPlayer } from '@lightningjs/sdk'
import VideoUi from './components/VideoUi.js'
import { videos } from './helpers'

export default class App extends Lightning.Component {
  static getFonts() {
    return [{ family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') }]
  }

  static _template() {
    return {
      w: w => w,
      h: h => h,
      Bg: {
        w: w => w,
        h: h => h,
        src: Utils.asset('images/bg.png'),
      },
      Ui: {
        x: 0,
        y: 0,
        w: w => w,
        h: h => h,
        type: VideoUi,
      },
      Error: {
        x: w => w / 2,
        y: h => h / 2,
        mount: 0.5,
        alpha: 0,
        text: {
          text: 'Error',
        },
      },
    }
  }

  _init() {
    VideoPlayer.consumer(this)
    this.videos = [...videos]
  }

  randomVideo() {
    return this.videos[Math.round(Math.random() * (this.videos.length - 1))]
  }

  _getFocused() {
    return this.tag('Ui')
  }

  // Actions
  $playPause(next = false) {
    next === true && VideoPlayer.clear()
    if (!VideoPlayer.src) {
      const nextVideo = this.randomVideo()
      // this.tag('Ui').title = nextVideo.title
      // this.tag('Ui').subtitle = nextVideo.subtitle
      VideoPlayer.open('https://podcasts.canstream.co.uk/bcb/audio/bcb_28-09-21_2-9_1632816002.mp3')
    } else {
      VideoPlayer.playPause()
    }
  }

  $stop() {
    VideoPlayer.clear()
  }

  $rewind() {
    VideoPlayer.skip(-10)
  }

  $forward() {
    VideoPlayer.skip(10)
  }

  // $toggleResize() {
  //   if (VideoPlayer.top === 0) {
  //     VideoPlayer.area(100, 1820, 640, 860)
  //     this.tag('Ui').size = 'small'
  //   } else {
  //     VideoPlayer.area()
  //     this.tag('Ui').size = 'full'
  //   }
  // }

  // $toggleLoop() {
  //   VideoPlayer.loop(!!!VideoPlayer.looped)
  //   this.tag('Ui').loop = VideoPlayer.looped
  // }

  // $reload() {
  //   VideoPlayer.reload()
  // }

  // $showHide() {
  //   const visible = VideoPlayer.visible
  //   if (visible === true) {
  //     this.setSmooth('color', bgColor)
  //     VideoPlayer.hide()
  //   } else {
  //     this.setSmooth('color', 0x00000000)
  //     VideoPlayer.show()
  //   }
  //   this.tag('Ui').visible = visible
  // }

  // hooks for VideoPlayer events
  $videoPlayerPlaying() {
    this.setSmooth('color', 0x00000000)
    this.tag('Ui').playing = true
    this.tag('Error').alpha = 0
    this.tag('Bg').alpha = 0
  }

  $videoPlayerPause() {
    this.tag('Ui').playing = false
  }

  // $videoPlayerVolumeChange() {
  //   this.tag('Ui').muted = VideoPlayer.muted
  // }

  $videoPlayerAbort() {
    this.setSmooth('color', 0xff444444)
    this.tag('Ui').title = ''
    this.tag('Ui').subtitle = ''
    this.tag('Bg').alpha = 1
    this.tag('Ui').playing = false
    this.tag('Ui').duration = 0
    this.tag('Ui').currentTime = 0
  }

  $videoPlayerError() {
    this.tag('Error').alpha = 1
  }

  $videoPlayerEnded() {
    this.$playPause(true)
  }

  $videoPlayerTimeUpdate() {
    this.tag('Ui').currentTime = VideoPlayer.currentTime
  }

  $videoPlayerLoadedMetadata() {
    this.tag('Ui').duration = VideoPlayer.duration
  }
}
