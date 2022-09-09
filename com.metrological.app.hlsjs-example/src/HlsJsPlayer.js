import Hls from 'hls.js'

export default class HlsJsPlayer {
  constructor(config = {}) {
    const videoEls = document.getElementsByTagName('video')
    if (videoEls && videoEls.length > 0) this.videoEl = videoEls[0]
    else {
      this.videoEl = document.createElement('video')
      this.videoEl.setAttribute('id', 'video-player')
      this.videoEl.style.position = 'absolute'
      this.videoEl.style.zIndex = '1'
      this.videoEl.style.display = 'none'
      this.videoEl.setAttribute('width', '100%')
      this.videoEl.setAttribute('height', '100%')

      document.body.appendChild(this.videoEl)
    }

    this.hls = new Hls(config)
  }

  open(url) {
    this.videoEl.style.display = 'block'
    if (Hls.isSupported()) {
      this.hls.loadSource(url)
      this.hls.attachMedia(this.videoEl)
      this.videoEl.addEventListener('loadedmetadata', () => this.play())
    } else {
      console.log('HLS.js not supported')
    }
  }

  play() {
    this.videoEl.play()
  }
}
