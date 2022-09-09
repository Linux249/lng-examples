import {Lightning} from '@lightningjs/sdk';

export default class Grid extends Lightning.Component {
    static _template() {
        return {
            Wrapper: {
            }
        }
    }

    _construct() {
        this._orientation = Grid.ORIENTATION.vertical;
        this._crossSpacing = 5;
        this._mainSpacing = 5;
        this._spacing = 5;
        this._autoResize = true;
        this._items = [];
        this._lines = [];
        this._mainIndex = 0;
        this._crossIndex = 0;
        this._reset();
    }

    _reset() {
        this._replot = true;
        this._index = 0;
        this._crossIndex = 0;
        this._mainIndex = 0;
    }

    _navigate(target, dir) {
        const isVertical = this._orientation === Grid.ORIENTATION.vertical;
        const cross = isVertical ? 'x' : 'y';
        const crossDim = isVertical ? 'w' : 'h';

        let over = 'mainAxis';
        let targetMainIndex = this._mainIndex;
        let targetCrossIndex = this._crossIndex;
        let targetIndex = this._index;
        let indexChanged = false;

        if((isVertical && (dir === 'left' || dir === 'right')) || (!isVertical && (dir === 'up' || dir === 'down'))) {
            over = 'crossAxis';
            targetCrossIndex += target;
        }
        else {
            targetMainIndex += target;
        }

        if(over === 'crossAxis' && targetCrossIndex < this._lines[targetMainIndex].length && targetCrossIndex > -1) {
            this._previous = undefined;
            targetIndex = this._lines[targetMainIndex][targetCrossIndex];
            indexChanged = true;
        }

        if(over === 'mainAxis' && targetMainIndex < this._lines.length && targetMainIndex > -1) {
            if(this._previous && this._previous.mainIndex === targetMainIndex) {
                targetIndex = this._previous.realIndex;
                targetCrossIndex = this._previous.crossIndex;
                indexChanged = true;
            }
            else {
                const targetLine = this._lines[targetMainIndex];
                const currentItem = this.currentItem;
                const m = targetLine.map((item) => {
                    const targetItem = this.wrapper.children[item];
                    if(targetItem[cross] <= currentItem[cross] && currentItem[cross] <= targetItem[cross] + targetItem[crossDim]) {
                        return targetItem[cross] + targetItem[crossDim] - currentItem[cross];
                    }
                    if(targetItem[cross] >= currentItem[cross] && targetItem[cross] <= currentItem[cross] + currentItem[crossDim]) {
                        return currentItem[cross] + currentItem[crossDim] - targetItem[cross];
                    }
                    return -1;
                });
                const t = m.reduce((acc, val, index, arr) => val > arr[acc] ? index : acc, targetLine.length - 1);
                this._previous = this._index;
                targetCrossIndex = t;
                targetIndex = targetLine[t];
                indexChanged = true;
            }

            this._previous = {mainIndex: this._mainIndex, crossIndex: this._crossIndex, realIndex: this._index};
        }

        if(indexChanged) {
            const currentMainIndex = this._mainIndex;
            const currentCrossIndex = this._crossIndex;
            const currentIndex = this._index;

            this._index = targetIndex;
            this._mainIndex = targetMainIndex;
            this._crossIndex = targetCrossIndex;

            this._indexChanged({
                index: targetIndex,
                previousIndex: currentIndex,
                mainIndex: targetMainIndex,
                previousMainIndex: currentMainIndex,
                crossIndex: targetCrossIndex,
                previousCrossIndex: currentCrossIndex,
                dataLength: this._items.length
            });
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
        if(this.active && items.length > 0 && this._replot) {
            const wrapper = this.wrapper;
            const isVertical = this._orientation === Grid.ORIENTATION.vertical;
            const main = isVertical ? 'y' : 'x';
            const mainDim = isVertical ? 'h' : 'w';

            const cross = isVertical ? 'x' : 'y';
            const crossDim = isVertical ? 'w' : 'h';

            const crossSize = this[crossDim];
            let mainPos = 0;
            let crossPos = 0;
            let lineIndex = 0;

            //temporarily store currentLine
            let cl = [];

            //reset lines when childlist is empty
            if(wrapper.childList.length === 0) {
                this._lines = [[]];
            }

            if(wrapper.childList.length > 0) {
                lineIndex = this._lines.length - 1;
                cl = this._lines[lineIndex].map((itemIndex) => {
                    return wrapper.children[itemIndex];
                });

                const lastItem = cl[cl.length - 1];
                mainPos = lastItem[main];
                crossPos = lastItem[cross] + lastItem.margin;
            }

            const children = items.map((item, itemIdx) => {
                if(wrapper.childList.length > 0) {
                    itemIdx = wrapper.childList.length + itemIdx;
                }
                const sizes = this._calculateItemSize(item);
                let targetMain = mainPos;
                let targetCross = crossPos;

                if(targetCross + sizes[crossDim] > crossSize && cl.length > 0) {
                    const bil = this._getBiggestInLine(cl);
                    targetMain = mainPos += bil[mainDim] + bil.mainMargin;
                    targetCross = 0;
                    crossPos = sizes[crossDim] + sizes.crossMargin;
                    this._lines.push([]);
                    cl = [];
                    lineIndex++;
                }
                else {
                    crossPos += sizes[crossDim] + sizes.crossMargin;
                }
                const newItem = {
                    itemIdx,
                    ...item,
                    ...sizes,
                    [`assigned${main.toUpperCase()}`]: targetMain,
                    [`assigned${cross.toUpperCase()}`]: targetCross,
                    [main]: targetMain,
                    [cross]: targetCross
                };
                this._lines[lineIndex].push(itemIdx);
                cl.push(newItem);
                return newItem;
            });

            if(wrapper.childList.length > 0) {
                this._items = [...this._items, ...items];
            }

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

    $reposition() {
        const wrapper = this.wrapper;
        if(wrapper.children.length === 0) {
            return;
        }
        this._setState('');
        const isVertical = this._orientation === Grid.ORIENTATION.vertical;
        const main = isVertical ? 'y' : 'x';
        const mainDim = isVertical ? 'h' : 'w';

        const cross = isVertical ? 'x' : 'y';
        const crossDim = isVertical ? 'w' : 'h';

        const crossSize = this[crossDim];
        let mainPos = 0;
        let crossPos = 0;

        let lineIndex = 0;

        //temporarily store currentLine
        let cl = [];
        this._lines = [[]];

        wrapper.children.forEach((item, itemIdx) => {
            const sizes = this._calculateItemSize(item);
            let targetMain = mainPos;
            let targetCross = crossPos;

            if(targetCross + sizes[crossDim] > crossSize && cl.length > 0) {
                const bil = this._getBiggestInLine(cl);
                targetMain = mainPos += bil[mainDim] + bil.mainMargin;
                targetCross = 0;
                crossPos = sizes[crossDim] + sizes.crossMargin;
                this._lines.push([]);
                cl = [];
                lineIndex++;
            }
            else {
                crossPos += sizes[crossDim] + sizes.crossMargin;
            }

            item.patch({
                [`assigned${main.toUpperCase()}`]: targetMain,
                [`assigned${cross.toUpperCase()}`]: targetCross,
                [main]: targetMain,
                [cross]: targetCross
            });
            this._lines[lineIndex].push(itemIdx);
            cl.push(item);
        });

        const lastItem = wrapper.childList.last;
        this._resizeWrapper({
            [mainDim]: lastItem[main] + lastItem[mainDim],
            [crossDim]: crossSize
        });
        this._setState('Filled');
    }

    _getBiggestInLine(line) {
        const mainDim = this._orientation === Grid.ORIENTATION.vertical ? 'h' : 'w';
        return line.reduce((biggestItem, newItem) => {
            if(newItem[mainDim] > biggestItem[mainDim]) {
                return newItem;
            }
            return biggestItem;
        });
    }

    _calculateItemSize(item) {
        const w = item.w || (item.type && item.type['width']);
        const h = item.h || (item.type && item.type['height']);

        const margin = item.margin || (item.type && item.type['margin']) || this.spacing;
        const mainMargin = item.mainMargin || item.margin || (item.type && item.type['mainMargin'] || item.type['margin']) || this.spacing;
        const crossMargin = item.crossMargin || item.margin || (item.type && item.type['crossMargin'] || item.type['margin']) || this.spacing;
        return {w, h, margin, mainMargin, crossMargin};
    }

    _resizeWrapper(obj) {
        this.wrapper.patch(obj);
        if(this._autoResize) {
            this.patch(obj);
        }
    }

    _active() {
        this._plotItems();
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

    set crossSpacing(num) {
        this._crossSpacing = num;
    }

    get crossSpacing() {
        return this._crossSpacing;
    }

    set mainSpacing(num) {
        this._mainSpacing = num;
    }
    get mainSpacing() {
        return this._mainSpacing;
    }

    set spacing(num) {
        this._spacing = num;
        this._mainSpacing = num;
        this._crossSpacing = num;
    }

    get spacing() {
        return this._spacing;
    }

    set orientation(str) {
        if(Grid.ORIENTATION[str]) {
            this._orientation = Grid.ORIENTATION[str];
        }
        else {
            this._orientation = Grid.ORIENTATION.vertical;
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
                    return this._navigate(1, 'right');
                }

                _handleLeft() {
                    return this._navigate(-1, 'left');
                }

                _handleUp() {
                    return this._navigate(-1, 'up');
                }

                _handleDown() {
                    return this._navigate(1, 'down');
                }
            }
        ]
    }
}

Grid.ORIENTATION = {
    vertical: 0,
    horizontal: 1
};