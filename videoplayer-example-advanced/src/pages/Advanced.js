import { Lightning, VideoPlayer } from '@lightningjs/sdk'
import Button from '@/components/Button'
import ProgressBar from '@/components/ProgressBar'
import Playlist from '@/components/Playlist'
import ErrorScreen from '@/components/ErrorScreen.js'
import { videos, buttons } from '@/lib/helpers'

const bgColor = 0xff444444
const interfaceTimeout = 5000

export default class Advanced extends Lightning.Component {
  static _template() {
    return {
      w: 1920,
      h: 1080,
      rect: true,
      color: bgColor,
      Text: {
        x: w => w / 2,
        y: h => h / 2,
        mount: 0.5,
        text: {
          text: 'Advanced example',
        },
      },
      ErrorScreen: {
        type: ErrorScreen,
        alpha: 0,
      },
      Ui: {
        x: 20,
        y: 790,
        w: w => w - 40,
        Playlist: {
          type: Playlist,
          signals: {
            itemSelected: true,
          },
        },
        Buttons: {
          y: 120,
          flex: { direction: 'row' },
        },
        ProgressBar: {
          y: 190,
          type: ProgressBar,
        },
      },
    }
  }

  _init() {
    this._index = 0
    this._rowIndex = 1
    this._videoIndex = 0
    // Initially video control interface is visible
    this._interfaceVisible = true
    // This variable will store timeout id for the interface hide functionality
    this._timeout = null
    this._setInterfaceTimeout()
    this.tag('Ui.Playlist').videos = videos
    this.tag('Ui.Playlist').selected = this._videoIndex
    // Fill Ui.Buttons tag with buttons from the buttons array
    this.tag('Ui.Buttons').children = buttons.map((button, index) => ({
      type: Button,
      icon: button.icon,
      label: button.label,
      action: button.action,
      ref: button.ref || 'Button' + index,
      flexItem: { marginRight: 20 },
    }))
  }

  itemSelected(index) {
    this._videoIndex = index
    VideoPlayer.clear()
    this.$playPause()
  }

  _toggleInterface(visible) {
    this.patch({
      Ui: {
        smooth: {
          y: [visible ? 790 : 840],
          alpha: [visible ? 1 : 0],
        },
      },
    })
    this.tag('Ui')
      .transition('y')
      .on('finish', () => {
        this._interfaceVisible = visible
      })
    if (visible) {
      this._setInterfaceTimeout()
    }
  }

  _setInterfaceTimeout() {
    // Clear timeout if it already exists
    if (this._timeout) {
      clearTimeout(this._timeout)
    }
    this._timeout = setTimeout(() => {
      this._toggleInterface(false)
    }, interfaceTimeout)
  }

  _active() {
    // Show video interface
    this._toggleInterface(true)
    // Set this object to receive VideoPlayer events
    VideoPlayer.consumer(this)
  }

  _inactive() {
    // Cleanup player and ui
    VideoPlayer.clear()
    this.patch({
      color: bgColor,
      Text: {
        alpha: 1,
      },
      ErrorScreen: {
        alpha: 0,
      },
    })
    this.playing = false
    this.tag('Ui.ProgressBar').duration = 0
    this.tag('Ui.ProgressBar').currentTime = 0
  }

  _focus() {
    // Show video interface
    this._toggleInterface(true)
  }

  // Capture every key and toggle interface. If it is visible, pass event to event handlers
  _captureKey() {
    this._toggleInterface(true)
    return !this._interfaceVisible
  }

  _handleLeft() {
    this._index = Math.max(0, this._index - 1)
  }

  _handleRight() {
    this._index = Math.min(this.tag('Ui.Buttons').children.length - 1, this._index + 1)
  }

  _handleUp() {
    if (this._rowIndex === 1) {
      this._rowIndex = 0
    } else {
      return false
    }
  }

  _handleDown() {
    this._rowIndex = 1
  }

  _getFocused() {
    return this._rowIndex === 0
      ? this.tag('Ui.Playlist')
      : this.tag('Ui.Buttons').children[this._index]
  }

  set playing(v) {
    this.tag('Ui.Buttons.PlayPause').icon = v === true ? 'pause' : 'play'
  }

  // Button actions
  $playPause(next = false) {
    // If next is true, clear VideoPlayer (which also sets src to null)
    next === true && VideoPlayer.clear()
    if (!VideoPlayer.src) {
      if (next === true) {
        this._videoIndex = (this._videoIndex + 1) % videos.length
      }
      VideoPlayer.open(videos[this._videoIndex])
      this.tag('Ui.Playlist').selected = this._videoIndex
    } else {
      VideoPlayer.playPause()
    }
  }

  $stop() {
    VideoPlayer.clear()
    this.tag('Ui.Playlist').selected = null
  }

  $previous() {
    if (this._videoIndex > 0) {
      this._videoIndex--
      VideoPlayer.clear()
      this.$playPause()
    }
  }

  $next() {
    if (this._videoIndex < videos.length - 1) {
      this._videoIndex++
      VideoPlayer.clear()
      this.$playPause()
    }
  }

  $rewind() {
    VideoPlayer.skip(-10)
  }

  $forward() {
    VideoPlayer.skip(10)
  }

  $toggleMute() {
    VideoPlayer.mute(!VideoPlayer.muted)
  }

  $toggleResize() {
    let resizeIcon = 'unshrink'
    if (VideoPlayer.top === 0) {
      VideoPlayer.area(100, 1820, 640, 860)
    } else {
      VideoPlayer.area()
      resizeIcon = 'shrink'
    }
    this.tag('Ui.Buttons.Resize').icon = resizeIcon
  }

  $toggleLoop() {
    VideoPlayer.loop(!VideoPlayer.looped)
    this.tag('Ui.Buttons.Loop').icon = VideoPlayer.looped === true ? 'loop' : 'unloop'
  }

  $reload() {
    VideoPlayer.reload()
  }

  $showHide() {
    const visible = VideoPlayer.visible
    if (visible === true) {
      this.setSmooth('color', bgColor)
      VideoPlayer.hide()
    } else {
      this.setSmooth('color', 0x00000000)
      VideoPlayer.show()
    }
    this.tag('Ui.Buttons.Visible').icon = visible ? 'hidden' : 'visible'
  }

  // Hooks for VideoPlayer events
  $videoPlayerPlaying() {
    this.patch({
      smooth: {
        color: [0x00000000],
      },
      Text: {
        smooth: {
          alpha: [0],
        },
      },
      ErrorScreen: {
        smooth: {
          alpha: [0],
        },
      },
    })
    this.playing = true
  }

  $videoPlayerPause() {
    this.playing = false
  }

  $videoPlayerVolumeChange() {
    this.tag('Ui.Buttons.Mute').icon = VideoPlayer.muted === true ? 'muted' : 'unmuted'
  }

  $videoPlayerAbort() {
    this.setSmooth('color', bgColor)
    this.playing = false
    this.tag('Ui.ProgressBar').duration = 0
    this.tag('Ui.ProgressBar').currentTime = 0
  }

  $videoPlayerEnded() {
    this.$playPause(true)
  }

  $videoPlayerTimeUpdate() {
    this.tag('Ui.ProgressBar').currentTime = VideoPlayer.currentTime
  }

  $videoPlayerLoadedMetadata() {
    this.tag('Ui.ProgressBar').duration = VideoPlayer.duration
  }

  $videoPlayerError() {
    this.patch({
      ErrorScreen: {
        smooth: {
          alpha: [1],
        },
      },
      Text: {
        smooth: {
          alpha: [0],
        },
      },
    })
  }
}
