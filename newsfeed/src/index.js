import { Launch, Metrics } from '@lightningjs/sdk'
import App from './App.js'

export default function() {
  Metrics.app.launch()
  return Launch(App, ...arguments)
}
