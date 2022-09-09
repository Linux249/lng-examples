import { Lightning } from 'wpe-lightning-sdk'

import HlsJsPlayer from './HlsJsPlayer'

export default class App extends Lightning.Component {
  _init() {
    this.hlsPlayer = new HlsJsPlayer()
  }

  _handleEnter() {
    this.hlsPlayer.open('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8')
  }
}
