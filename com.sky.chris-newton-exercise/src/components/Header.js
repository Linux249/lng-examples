import { Lightning, Utils } from '@lightningjs/sdk'

export default class Header extends Lightning.Component {
  static _template() {
    return {
      Logo: {
        w: 498,
        h: 210,
        x: -40,
        y: 30,
        alpha: 0,
        transitions: { alpha: { duration: 1, timingFunction: 'ease' } },
      },
      Image: {
        w: 1215,
        h: 688,
        x: 733,
        y: 0,
        alpha: 0,
        transitions: { alpha: { duration: 1.5, timingFunction: 'ease' } },
      },
      TextYear: {
        mount: 0,
        x: 0,
        y: 228,
        text: {
          fontFace: 'Regular',
          fontSize: 25,
          textColor: 0xbbffffff,
        },
      },
      Rating: {
        mount: 0,
        x: 80,
        y: 220,
        w: 50,
        h: 50,
      },
      TextSeasons: {
        mount: 0,
        x: 150,
        y: 228,
        text: {
          fontFace: 'Regular',
          fontSize: 25,
          textColor: 0xbbffffff,
        },
      },
      TextQuality: {
        mount: 0,
        x: 320,
        y: 228,
        text: {
          fontFace: 'Regular',
          fontSize: 25,
          textColor: 0xbbffffff,
        },
      },
      TextInfo: {
        x: 0,
        y: 280,
        w: 940,
        text: {
          fontFace: 'Regular',
          fontSize: 28,
          textColor: 0xbbffffff,
          lineHeight: 32,
        },
      },
      Trophy: {
        w: 67,
        h: 65,
        x: 0,
        y: 390,
      },
      TextInfoExtra: {
        x: 80,
        y: 390,
        w: 700,
        text: {
          fontFace: 'Regular',
          fontSize: 25,
          textColor: 0xbbffffff,
          lineHeight: 32,
        },
      },
    }
  }

  update(data) {
    this.tag('Logo').patch({ alpha: 0, src: Utils.asset(data.headerLogo) })
    this.tag('Logo')
      .transition('alpha')
      .start(1)
    this.tag('Image').patch({ alpha: 0, src: Utils.asset(data.headerImage) })
    this.tag('Image')
      .transition('alpha')
      .start(1)
    this.tag('TextYear').patch({ text: { text: data.year } })
    this.tag('Rating').patch({ src: Utils.asset(data.rating) })
    this.tag('TextSeasons').patch({ text: { text: data.seasons } })
    this.tag('TextQuality').patch({ text: { text: data.quality } })
    this.tag('TextInfo').patch({ text: { text: data.info } })
    this.tag('Trophy').patch({ src: Utils.asset(data.trophy) })
    this.tag('TextInfoExtra').patch({ text: { text: data.extraInfo } })
  }

  _init() {
    // console.log('init header', this.data)
    this.update(this.data)
  }

  set header(data) {
    // console.log('update header', data)
    this.update(data)
  }
}
