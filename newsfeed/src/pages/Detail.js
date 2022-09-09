import { Lightning, Router, Storage } from '@lightningjs/sdk'

export default class Detail extends Lightning.Component {
  static _template() {
    return {
      Label: {
        x: 960,
        y: 540,
        mount: 0.5,
        text: { textAlign: 'center', lineHeight: 52, text: 'Detail page' },
      },
      Explanation: {
        x: 960,
        y: 690,
        mount: 0.5,
        alpha: 0.5,
        text: {
          fontSize: 27,
          textAlign: 'center',
          lineHeight: 39,
          text: 'Loading...',
        },
      },
    }
  }

  set params(args) {
    console.log(args)
    // do something with data passed in the navigate
    this.tag('Explanation').text.text = args.details
  }

  _handleBack() {
    // @TODO not rendering home
    Router.back()
  }

  _onUrlParams(args) {
    const headlines = Storage.get('headlines').filter(el => el.value == args.headlineId)
    if (headlines.length == 0) {
      Router.navigate('*')
    }
    console.log('headlines', headlines)
    //this._headlineId = args.headlineId
    this.tag('Label').text = `Detail page \nheadlineId: ${args.headlineId}`
  }

  pageTransition() {
    return 'crossFade'
  }
}
