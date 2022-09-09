import {Lightning} from '@lightningjs/sdk';

export default class Keyboard extends Lightning.Component {
    static _template() {
        return {
            Keys: {w: w => w}
        }
    }

    _construct() {
        this._inputField = null;
        this._maxCharacters = 56;
    }

    _setup() {
        this._keys = this.tag('Keys');
        this.reset();
        this._update();
    }

    get value() {
        return this._value;
    }

    get keyRows() {
        return this._keys.children;
    }

    set config(obj) {
        this._config = obj;
        if(obj.maxCharacters) {
            this.maxCharacters = obj.maxCharacters;
        }
    }

    set inputField(comp) {
        this._inputField = comp;
        if(comp.maxCharacters) {
            this.maxCharacters = comp.maxCharacters;
        }
    }

    set maxCharacters(num) {
        this._maxCharacters = num;
    }

    get maxCharacters() {
        return this._maxCharacters;
    }

    set layout(str) {
        this._layout = str;
    }

    get currentKeyRowLength() {
        return this._keys.children[this._rowIndex].children.length;
    }

    get currentKey() {
        return this._keys.children[this._rowIndex].children[this._colIndex];
    }

    reset() {
        this._colIndex = 0;
        this._rowIndex = 0;
        this._value = '';
        this._previous = null;
    }

    changeValue(value = '', action = 'onInput', reset = false) {
        switch(action) {
            case 'onSpace':
                value = ' ';
                break;
            case 'onDelete':
                value = this._value.substring(0, this._value.length - 1);
                reset = true;
                break;
            case 'onClear': {
                value = '';
                reset = true;
                break;
            }
        }
        const input = this._inputField;
        let mod = this._value + value;
        if(reset) {
            mod = value;
        }
        if(mod.length >= this._maxCharacters) {
            return;
        }

        input.feed(mod, reset);
        this._value = mod;
        this.signal('onValueChanged', {value: this._value, action, reset});
    }

    _navigate(dir, value) {
        dir = (dir === 'up' || dir === 'down') ? 'vertical' : 'horizontal';
        const targetIndex = (dir === 'horizontal' ? this._colIndex : this._rowIndex) + value;
        if(dir === 'horizontal' && targetIndex < this.currentKeyRowLength && targetIndex > -1) {
            this._previous = null;
            return this._colIndex = targetIndex;
        }
        if(dir === 'vertical' && targetIndex < this.keyRows.length && targetIndex > -1) {
            const currentColIndex = this._colIndex;
            if(this._previous && this._previous.row === targetIndex) {
                const tmp = this._previous.col;
                this._previous.col = this._colIndex;
                this._colIndex = tmp;
            }
            else {
                const targetRow = this.keyRows[targetIndex];
                const targetItems = targetRow.children;
                const currentKey = this.currentKey;
                let target = 0;
                for(let i = 0; i < targetItems.length; i++) {
                    const currentKeyX = this._getVirtualX(this.keyRows[this._rowIndex]) + currentKey.x;
                    const tix = this._getVirtualX(targetRow) + targetItems[i].x;
                    target = i;

                    if((currentKeyX < tix) ||
                        (currentKeyX >= tix && currentKeyX <= tix + targetItems[i].w)
                        || (tix >= currentKeyX && tix <= currentKeyX + currentKey.w)) {
                        break;
                    }
                }
                this._colIndex = target;
            }
            this._previous = {col: currentColIndex, row: this._rowIndex};
            return this._rowIndex = targetIndex;
        }
        return false;
    }

    _getVirtualX(row) {
        if(row.mountX === 0.5) {
            return row.x - row.w / 2;
        }
        if(row.mountX === 1) {
            return row.x - row.w;
        }
        return row.x;
    }

    _update() {
        this._setState('');
        if(!this.active || !this._config) {
            this._keys.childList.clear();
            this.reset();
            return;
        }
        let {layouts, buttonTypes, offsets = {}} = this._config;
        if(!this._layout || (this._layout && layouts[this._layout] === undefined)) {
            console.error(`Configured layout "${this._layout}" does not exist. Picking first available: "${Object.keys(layouts)[0]}"`);
            this._layout = Object.keys(layouts)[0];
        }
        const reg = /^on[A-Z][A-Za-z]*/;
        const reg2 = /\:/;
        const {buttonLeft: horizontalSpacing = 0, buttonTop: verticalSpacing = 0, align = 'left'} = offsets;

        this._keys.children = layouts[this._layout].map((row, rowIndex) => {
            let keyOffset = 0;
            const rowOffsets = offsets[`Row${rowIndex+1}`] || {};
            const {x = 0, buttonTop: rowVerticalSpacing = verticalSpacing, buttonLeft: rowHorizontalSpacing = horizontalSpacing, rowAlign = align} = rowOffsets;

            const items = row.map((k, kIndex) => {
                const prevOffset = keyOffset;
                let key = buttonTypes.default;
                let action = 'onInput';
                let label = k;
                if(reg.test(k)) {
                    if(reg2.test(k)) {
                        k = k.split(':');
                        label = k[1].toString();
                        k = k[0];
                    }
                    if(buttonTypes[k]) {
                        key = buttonTypes[k];
                        action = key.action || k;
                    }
                }
                const w = key.w || key.type.width || 0;
                const h = key.h || key.type.height || 0;
                const margin = key.margin || rowHorizontalSpacing;
                keyOffset = prevOffset + w + margin;

                return {ref: `Key-${kIndex + 1}-${key.type.name}`, label, x: prevOffset, k, action, w, h, ...key};
            });

            const rowWidth = keyOffset - (items[items.length - 1].margin || rowHorizontalSpacing);
            let rowOffset = x;
            let rowMount = 0;

            if(this.w && rowAlign === 'center') {
                rowOffset = this.w / 2;
                rowMount = 0.5;
            }

            if(this.w && rowAlign === 'right') {
                rowOffset = this.w;
                rowMount = 1;
            }

            return {ref: `Row-${rowIndex + 1}`, x: rowOffset, mountX: rowMount, w: rowWidth,  y: items[0].h * rowIndex + (rowIndex * rowVerticalSpacing), children: items};
        });
        this._setState('Keys');
    }

    _firstActive() {
        this._update();
    }

    _findKey(key) {
        let i = 0, j = 0;
        let found = false;
        for(; i < this.keyRows.length; i++) {
            for(j = 0; j < this.keyRows[i].children.length; j++) {
                if(this.keyRows[i].children[j].k.toLowerCase() === key.toLowerCase()) {
                    found = true;
                    break;
                }
            }
            if(found) {
                break;
            }
        }
        return {
            row: i,
            col: j,
            found
        }
    }

    _handleKey({key, code}) {
        if((code === 'Backspace' && this._value.length > 0)
            || (code === 'Space' && this._value.length > 0)
            || (key.length === 1 && /^[\w]/g.test(key))) {
            let action = 'onInput';
            let findKey = null;

            if(key.length === 1) {
                findKey = this._findKey(key)
            }

            if(code === 'Backspace') {
                action = 'onDelete';
            }

            if(code === 'Space') {
                action = 'onSpace';
                findKey = this._findKey('onSpace');
            }

            if(findKey === null || !findKey.found) {
                findKey = this._findKey('onDelete');
            }

            if(findKey.found) {
                this._rowIndex = findKey.row;
                this._colIndex = findKey.col;
            }
            this.changeValue(key, action);
            return true;
        }
        return false;
    }

    static _states() {
        return [
            class Keys extends this {
                _getFocused() {
                    return this.currentKey;
                }

                _handleRight() {
                    return this._navigate('right', 1);
                }

                _handleLeft() {
                    return this._navigate('left', -1);
                }

                _handleUp() {
                    return this._navigate('up', -1);
                }

                _handleDown() {
                    return this._navigate('down', 1);
                }

                _handleEnter() {
                    const key = this.currentKey;
                    const action = key.action;
                    if(action && typeof action === 'string') {
                        const s = action.split(':');
                        if(s.length === 2 && s[0] === 'layout') {
                            this.patch({
                                [s[0]]: s[1]
                            });
                            this._update();
                            return;
                        }
                    }

                    if(!!(action && action && action.call && action.apply)) {
                        this.signal(key.k);
                        action.call();
                        return;
                    }

                    if(action === 'onLayout') {
                        this._layout = key.label;
                        this._update();
                        return;
                    }

                    this.changeValue(key.k, key.action);
                }
            }
        ]
    }
}