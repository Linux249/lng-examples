import {Lightning} from '@lightningjs/sdk';


export default class Border extends Lightning.Component {
  get mountStroke() {
    return this._mountStroke;
  }

  set mountStroke(num) {
    this._mountStroke = Math.min(Math.max(num, 0), 1);
    this._update();
  }

  set strokeColor(argb) {
    this._strokeColor = argb;
    this._update();
  }

  get stroke() {
    return this._stroke;
  }

  set stroke(num) {
    if (!Array.isArray(num) && !isNaN(num)) {
      num = [num, num, num, num];
    } else {
      return;
    }
    this._stroke = num;
    this._update();
  }

  get strokeTop() {
    return this._stroke[3];
  }

  set strokeTop(num) {
    this._stroke[0] = num;
    this._update();
  }

  get strokeRight() {
    return this._stroke[1];
  }

  set strokeRight(num) {
    this._stroke[1] = num;
    this._update();
  }

  get strokeBottom() {
    return this._stroke[2];
  }

  set strokeBottom(num) {
    this._stroke[2] = num;
  }

  get strokeLeft() {
    return this._stroke[3];
  }

  set strokeLeft(num) {
    this._stroke[3] = num;
    this._update();
  }

  static _template() {
    return {
      w: w => w, h: h => h,
      Top: {rect: true},
      Right: {rect: true, mountX: 1, x: h => h},
      Bottom: {rect: true, mountY: 1, y: h => h},
      Left: {rect: true},
    };
  }

  _construct() {
    console.warn('Border is going to be replaced with a shader');
    this._mountStroke = 1;
    this._stroke = [0, 0, 0, 0];
    this._strokeColor = 0xffffffff;
  }

  _update() {
    if (!this.active) {
      return;
    }
    const top = this._stroke[0];
    const right = this._stroke[1];
    const bottom = this._stroke[2];
    const left = this._stroke[3];
    const color = this._strokeColor;
    const ms = this._mountStroke;

    this.patch({
      Top: {visible: top > 0, h: top, w: w => w + ((left + right) * ms), x: -(left * ms), mountY: ms, color},
      Right: {visible: right > 0, w: right, h: h => h + ((top + bottom) * ms), y: -(top * ms), mountX: 1 - ms, color},
      Bottom: {
        visible: bottom > 0,
        h: bottom,
        w: w => w + ((left + right) * ms),
        x: -(left * ms),
        mountY: 1 - ms,
        color,
      },
      Left: {visible: left > 0, w: left, h: h => h + ((top + bottom) * ms), y: -(top * ms), mountX: ms, color},
    });
  }

  _firstActive() {
    this._update();
  }
}
