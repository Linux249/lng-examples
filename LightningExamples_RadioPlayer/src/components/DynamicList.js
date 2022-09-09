import List from '@/blocks/List.js';

export default class DynamicList extends List {
    _construct() {
        super._construct();
        this._autoResize = false;
    }

    _init() {
        const isVertical = this._orientation === List.ORIENTATION.vertical;
        this.wrapper.transitions = {[isVertical ? 'y' : 'x']: {duration: 0.3}};
        this._mainTransition = this.wrapper.transition(isVertical ? 'y' : 'x');
    }

    set scrollOffset(num) {
        this._scrollOffset = num;
    }

    get scrollOffset() {
        return this._scrollOffset || 0;
    }

    set scrollOffsetStart(num) {
        this._scrollOffsetTop = num;
    }

    get scrollOffsetStart() {
        return this._scrollOffsetTop || this.scrollOffset;
    }

    set scrollOffsetEnd(num) {
        this._scrollOffsetBottom = num;
    }

    get scrollOffsetEnd() {
        return this._scrollOffsetBottom || this.scrollOffset;
    }

    setItems(items) {
        super.setItems(items);
        if(this._mainTransition) {
            this._mainTransition.reset(0, 0);
        }
    }

    _indexChanged(obj) {
        super._indexChanged(obj);
        const {previousIndex, newIndex, dataLength} = obj;

        if(previousIndex === newIndex) {
            return;
        }

        const current = this.currentItem;

        const isVertical = this._orientation === List.ORIENTATION.vertical;
        const main = isVertical ? 'y' : 'x';
        const mainDim = isVertical ? 'h' : 'w';

        const scrollOffsetStart = this.scrollOffsetStart;
        const scrollOffsetEnd = this.scrollOffsetEnd;

        const controlPoint = this._mainTransition.targetValue;
        const boundary = this[mainDim];
        const boundaryStart = scrollOffsetStart - controlPoint;

        let m = controlPoint;

        if(previousIndex > newIndex) {
            if(newIndex > 0 && current[main] < controlPoint * -1 + scrollOffsetStart) {
                m = scrollOffsetStart-current[main];
            }
            else if(current[main] < boundaryStart){
                m = 0;
            }
        }
        else {
            if(newIndex < dataLength - 1 && ((current[main] + current[mainDim]) > (controlPoint * -1 + (boundary - scrollOffsetEnd)))) {
                m = (boundary - scrollOffsetEnd) - (current[main] + current[mainDim]);
            }
            else if(newIndex === dataLength - 1 && (current[main] + current[mainDim]) >= boundary){
                m = (boundary) - (current[main] + current[mainDim]);
            }
        }

        if(this._mainTransition.isRunning()) {
            this._mainTransition.reset(m, 0.12);
        }
        else {
            this._mainTransition.start(m);
        }
    }
}