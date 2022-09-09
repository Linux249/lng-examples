    import {Lightning} from '@lightningjs/sdk';

export default class Carousel extends Lightning.Component {
    static _template() {
        return {
            Wrapper: {}
        }
    }

    set orientation(str) {
        if(Carousel.ORIENTATION[str]) {
            this._orientation = Carousel.ORIENTATION[str];
        }
        else {
            this._orientation = Carousel.ORIENTATION.vertical;
        }
    }

    get orientation() {
        return this._orientation;
    }

    get scrollTransitionSettings() {
        return this._scrollTransitionSettings;
    }

    set scrollTransition(v) {
        this._scrollTransitionSettings.patch(v);
    }

    get scrollTransition() {
        return this._scrollTransition;
    }

    set scrollOffset(num) {
        this._scrollOffsetStart = num;
        this._scrollOffsetEnd = num;
    }

    get scrollOffset() {
        return {
            start: this._scrollOffsetStart,
            end: this._scrollOffsetEnd
        }
    }

    set scrollOffsetStart(num) {
        this._scrollOffsetStart = num;
    }

    get scrollOffsetStart() {
        return this._scrollOffsetStart;
    }

    set scrollOffsetEnd(num) {
        this._scrollOffsetEnd = num;
    }

    get scrollOffsetEnd() {
        return this._scrollOffsetEnd;
    }

    set threshold(num) {
        this._thresholdStart = num;
        this._thresholdEnd = num;
    }

    set thresholdStart(num) {
        this._thresholdStart = num;
    }

    set thresholdEnd(num) {
        this._thresholdEnd = num;
    }

    get currentItem() {
        return this.tag("Wrapper").children[this._index];
    }

    _construct() {
        this._spacing = 5;
        this._scrollOffsetStart = 0;
        this._scrollOffsetEnd = 0;
        this._thresholdStart = 100;
        this._thresholdEnd = 100;
        this._reset();
    }

    _reset() {
        this._index = 0;
        this._plot = true;
    }

    _init() {
        this._setupTransition();
    }

    _setupTransition() {
        const isVertical = this._orientation === Carousel.ORIENTATION.vertical;
        const wrapper = this.tag('Wrapper');
        wrapper.transition(isVertical ? 'y' : 'x', this._scrollTransitionSettings);
        this._mainTransition = wrapper.transition(isVertical ? 'y' : 'x');
    }

    setItems(items, index = 0) {
        this._setState('');
        this.tag('Wrapper').children = [];
        this._items = items;
        this._reset();
        this._plotItems(items, index);
        this._indexChanged({newIndex: index, previousIndex: index});
    }

    setIndex(index) {
        this._plotItems(this._items, index);
    }

    _plotItems(items = this._items, targetIndex = 0) {
        if(items.length && this._plot) {
            const wrapper = this.tag('Wrapper');

            const isVertical = this._orientation === Carousel.ORIENTATION.vertical;
            const main = isVertical ? 'y' : 'x';
            const mainDim = isVertical ? 'h' : 'w';
            const cross = isVertical ? 'x' : 'y';
            const crossDim = isVertical ? 'w' : 'h';

            const viewBound = this[mainDim];

            let crossPos = 0;
            let crossSize = 0;

            if(!this._mainTransition) {
                this._setupTransition();
            }
            this._mainTransition.start(this._scrollOffsetStart);
            this._mainTransition.finish();

            let position = 0;
            const positiveHalf = [];
            const negativeHalf = [];
            let index = targetIndex;
            while((viewBound - this._scrollOffsetStart) + this._thresholdEnd > position) {
                const item = this._items[index];
                const sizes = this._calculateItemSize(item);
                if(crossSize < sizes[crossDim]){
                    crossSize = sizes[crossDim]
                }
                item.w = sizes.w;
                item.h = sizes.h;

                positiveHalf.push({
                    type: ItemWrapper,
                    dataIndex: index,
                    w: sizes.w,
                    h: sizes.h,
                    [main]: position,
                    [cross]: crossPos,
                    item
                });

                position += sizes[mainDim] + sizes.margin;
                index = this._normalizeDataIndex(index + 1);
            }
            position = 0;
            index = targetIndex > 0 ? targetIndex - 1 : this._items.length - 1;
            while(-(this._scrollOffsetStart + this._thresholdStart) < position) {
                const item = this._items[index];
                const sizes = this._calculateItemSize(item);
                if(crossSize < sizes[crossDim]){
                    crossSize = sizes[crossDim]
                }
                item.w = sizes.w;
                item.h = sizes.h;

                position -= sizes[mainDim] + sizes.margin;
                negativeHalf.push({
                    type: ItemWrapper,
                    dataIndex: index,
                    w: sizes.w,
                    h: sizes.h,
                    [main]: position,
                    [cross]: crossPos, item
                });
                index = this._normalizeDataIndex(index - 1);
            }
            this._index = negativeHalf.length;
            wrapper.children = [...negativeHalf.reverse(), ...positiveHalf];
            this._setState('Filled');
        }
    }

    _normalizeDataIndex(index) {
        if(index > this._items.length - 1) {
            return 0;
        }
        else if(index < 0) {
            return this._items.length - 1;
        }
        return index;
    }

    _calculateItemSize(item) {
        const w = item.w || (item.type && item.type['width']);
        const h = item.h || (item.type && item.type['height']);
        const margin = item.margin || (item.type && item.type['margin']) || this.spacing;
        return {w, h, margin};
    }

    _navigate(shift, orientation = this._orientation) {
        if(orientation !== this._orientation) {
            return false;
        }
        const targetIndex = this._index + shift;

        const childList = this.tag('Wrapper').childList;
        const isVertical = orientation === Carousel.ORIENTATION.vertical;
        const main = isVertical ? 'y' : 'x';
        const mainDim = isVertical ? 'h' : 'w';

        const controlPoint = this._mainTransition.targetValue;
        const boundary = this[mainDim];

        const currentDataIndex = this.currentItem.dataIndex;

        //check if target is in bounds
        let inBounds = false;
        const tmp = childList.getAt(targetIndex);

        if(shift > 0 && (tmp[main] + tmp[mainDim]) + controlPoint <= (boundary - this._scrollOffsetEnd)) {
            inBounds = true;
        }
        else if(shift < 0 && tmp[main] + controlPoint >= this._scrollOffsetStart) {
            inBounds = true;
        }

        if(inBounds) {
            //change index;
            this._index = targetIndex;
            this._indexChanged({previousIndex: currentDataIndex, newIndex: this.currentItem.dataIndex});
        }
        else {
            //reorder children pre transition
            let referenceItem = childList.last;
            let removeAt = 0;

            if(shift < 0) {
                referenceItem = childList.first;
                removeAt = childList.length - 1;
            }

            const targetDataIndex = this._normalizeDataIndex(referenceItem.dataIndex + shift);
            const targetItem = this._items[targetDataIndex];
            const sizes = this._calculateItemSize(targetItem);

            let position = referenceItem[main] + referenceItem[mainDim] + sizes.margin;
            if(shift < 0) {
                position = referenceItem[main] - (sizes[mainDim] + sizes.margin);
            }

            childList.removeAt(removeAt);

            const child = this.stage.c({
                type: ItemWrapper,
                dataIndex: targetDataIndex,
                w: sizes.w,
                h: sizes.h,
                [main]: position,
                item: targetItem
            });

            childList.addAt(child, shift > 0 ? childList.length : 0);
            this._indexChanged({previousIndex: currentDataIndex, newIndex: targetDataIndex});

            //calculate transition
            let m = 0;
            if(shift < 0) {
                m = this._scrollOffsetStart - tmp[main];
            }
            else {
                m = boundary - this._scrollOffsetEnd - (tmp[main] + tmp[mainDim]);
            }

            if(this._mainTransition.isRunning()) {
                this._mainTransition.reset(m, 0.12);
            }
            else {
                this._mainTransition.start(m);
            }
        }
    }

    _indexChanged(obj) {
        this.signal('indexChanged', obj);
    }

    scrollToNext() {
        this._navigate(1);
    }

    scrollToPrevious() {
        this._navigate(-1);
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
                    return this._navigate(1, Carousel.ORIENTATION.horizontal);
                }

                _handleLeft() {
                    return this._navigate(-1, Carousel.ORIENTATION.horizontal);
                }

                _handleUp() {
                    return this._navigate(-1, Carousel.ORIENTATION.vertical);
                }

                _handleDown() {
                    return this._navigate(1, Carousel.ORIENTATION.vertical);
                }
            }
        ]
    }
}

Carousel.ORIENTATION = {
    vertical: 0,
    horizontal: 1
};

class ItemWrapper extends Lightning.Component {
    static _template() {
        return {
            clipbox: true
        }
    }

    set item(obj) {
        this._item = obj;
    }

    get item() {
        return this._item;
    }

    get child() {
        return this.children[0];
    }

    create() {
        if(this._itemIsCreated) {
            return;
        }
        this._itemIsCreated = true;
        this.children = [this._item];
        if(this._notifyOnItemCreation && this.hasFocus()) {
            this._refocus();
        }
    }

    _active() {
        this.create();
    }

    _inactive() {
        this._itemIsCreated = false;
        this.childList.clear();
    }

    _getFocused() {
        if(!this.child){
            this._notifyOnItemCreation = true;
        }else{
            return this.child;
        }
    }
}