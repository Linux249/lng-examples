import {Lightning} from '@lightningjs/sdk';

export default class List extends Lightning.Component {
    static _template() {
        return {
            Wrapper: {
            }
        }
    }

    _construct() {
        this._orientation = List.ORIENTATION.vertical;
        this._spacing = 5;
        this._autoResize = true;
        this._items = [];
        this._reset();
    }

    _reset() {
        this._index = 0;
        this._replot = true;
    }

    _navigate(shift, orientation = this._orientation) {
        const targetIndex = this._index + shift;
        if(this._orientation === orientation && targetIndex >= 0 && targetIndex < this.items.length) {
            const previousIndex = this._index;
            this._index = targetIndex;
            this._indexChanged({previousIndex, newIndex: targetIndex, dataLength: this.items.length});
            return true;
        }
        return false;
    }

    _indexChanged(obj) {
        this.signal('indexChanged', obj);
    }

    setItems(items) {
        this._setState('');
        this.tag('Wrapper').children = [];
        this._plotItems(items);
        this._items = items;
        this._reset();
        this._indexChanged({newIndex: 0, previousIndex: 0});
    }

    addItems(items) {
        this._replot = true;
        this._plotItems(items);
        this._items = [...this._items, ...items];
    }

    _plotItems(items = this._items) {
        if(items.length && this._replot) {
            const wrapper = this.wrapper;

            const isVertical = this._orientation === List.ORIENTATION.vertical;
            const main = isVertical ? 'y' : 'x';
            const mainDim = isVertical ? 'h' : 'w';
            const cross = isVertical ? 'x' : 'y';
            const crossDim = isVertical ? 'w' : 'h';
            let crossPos = 0;
            let crossSize = 0;
            let position = 0;

            if(wrapper.childList.length > 0) {
                const lastChild = wrapper.childList.last;
                position = lastChild[main] + lastChild[mainDim] + lastChild.margin;
            }

            const children = items.map((item) => {
                if(item[main]) {
                    position = item[main];
                }
                if(item[cross]) {
                    crossPos = item[cross];
                }
                const mainPos = position;
                const sizes = this._calculateItemSize(item);
                if(crossSize < sizes[crossDim]){
                    crossSize = sizes[crossDim]
                }
                position += sizes[mainDim] + sizes.margin;
                return {
                    ...item,
                    ...sizes,
                    [`assigned${main.toUpperCase()}`]: mainPos,
                    [`assigned${cross.toUpperCase()}`]: crossPos,
                    [main]: mainPos,
                    [cross]: 0
                };
            });

            wrapper.add(children);
            const lastItem = wrapper.childList.last;
            this._resizeWrapper({
                [mainDim]: lastItem[main] + lastItem[mainDim],
                [crossDim]: crossSize
            });
            this._replot = false;
            this._setState('Filled');
        }
    }

    _calculateItemSize(item) {
        const w = item.w || (item.type && item.type['width']);
        const h = item.h || (item.type && item.type['height']);
        const margin = item.margin || (item.type && item.type['margin']) || this.spacing;
        return {w, h, margin};
    }

    _resizeWrapper(obj) {
        this.wrapper.patch(obj);
        if(this._autoResize) {
            this.patch(obj);
        }
    }

    _reposition() {
        if(this.wrapper.children.length === 0) {
            return;
        }
        const wrapper = this.wrapper;
        let position = 0;
        const isVertical = this._orientation === List.ORIENTATION.vertical;
        const main = isVertical ? 'y' : 'x';
        const mainDim = isVertical ? 'h' : 'w';
        const cross = isVertical ? 'x' : 'y';
        const crossDim = isVertical ? 'w' : 'h';
        let crossSize = 0;

        wrapper.children.forEach((item) => {
            const newPos = position;
            const sizes = this._calculateItemSize(item);
            if(crossSize < sizes[crossDim]){
                crossSize = sizes[crossDim]
            }
            position += (isVertical ? sizes.h : sizes.w || 0) + sizes.margin;
            item.patch({
                [`assigned${main.toUpperCase()}`]: newPos,
                [`assigned${cross.toUpperCase()}`]: 0,
                [main]: newPos,
                [cross]: 0
            });
        });

        const lastItem = wrapper.childList.last;
        this._resizeWrapper({
            [mainDim]: lastItem[main] + lastItem[mainDim],
            [crossDim]: crossSize
        });
    }

    set autoResize(bool) {
        this._autoResize = bool;
    }

    get autoResize() {
        return this._autoResize;
    }

    set items(arr) {
        this.setItems(arr);
    }

    set index(num) {
        this._navigate(num - this._index);
    }

    get index() {
        return this._index;
    }

    get currentItem() {
        return this.items[this._index];
    }

    get items() {
        return this.tag('Wrapper').children;
    }

    get wrapper() {
        return this.tag('Wrapper');
    }

    set spacing(num) {
        this._spacing = num;
    }

    get spacing() {
        return this._spacing;
    }

    set orientation(str) {
        if(List.ORIENTATION[str]) {
            this._orientation = List.ORIENTATION[str];
        }
        else {
            this._orientation = List.ORIENTATION.vertical;
        }
    }

    get orientation() {
        return this._orientation;
    }

    _getFocused() {
        return this;
    }

    static _states() {
        return [
            class Filled extends this {
                _getFocused() {
                    if(this.currentItem.isComponent) {
                        return this.currentItem;
                    }
                    return this;
                }

                _handleRight() {
                    return this._navigate(1, List.ORIENTATION.horizontal);
                }

                _handleLeft() {
                    return this._navigate(-1, List.ORIENTATION.horizontal);
                }

                _handleUp() {
                    return this._navigate(-1, List.ORIENTATION.vertical);
                }

                _handleDown() {
                    return this._navigate(1, List.ORIENTATION.vertical);
                }
            }
        ]
    }
}

List.ORIENTATION = {
    vertical: 0,
    horizontal: 1
};