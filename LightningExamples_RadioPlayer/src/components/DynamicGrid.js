import {Grid} from '../blocks';

export default class DynamicGrid extends Grid {
    _init() {
        if(!this._availableItems) {
            this._availableItems = 0;
        }
        this._autoResize = false;
        //check and set main axis to animate

        const isVertical = this._orientation === Grid.ORIENTATION.vertical;

        this._mainTransition = this.wrapper.transition(isVertical ? 'y' : 'x');
        this._mainTransition.settings.duration =  0.3;
    }

    reset() {
        super.reset();
        this._fetchingMore = false;
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

    set availableItems(num) {
        this._availableItems = num;
    }

    get mainTransition() {
        return this._mainTransition;
    }

    _indexChanged(event) {
        this._scrollToFocus(event);
        super._indexChanged(event);
    }

    _scrollToFocus(obj) {
        super._indexChanged(obj);
        const {previousIndex, newIndex,  previousMainIndex, mainIndex} = obj;

        if(previousIndex === newIndex) {
            return;
        }

        const current = this.currentItem;

        const isVertical = this._orientation === Grid.ORIENTATION.vertical;
        const main = isVertical ? 'y' : 'x';
        const mainDim = isVertical ? 'h' : 'w';

        const scrollOffsetStart = this.scrollOffsetStart;
        const scrollOffsetEnd = this.scrollOffsetEnd;

        const controlPoint = this._mainTransition.targetValue;
        const boundary = this[mainDim];
        const boundaryStart = scrollOffsetStart - controlPoint;

        let m = controlPoint;

        if(previousMainIndex > mainIndex) {
            if(mainIndex > 0 && current[main] < controlPoint * -1 + scrollOffsetStart) {
                m = scrollOffsetStart-current[main];
            }
            else if(current[main] < boundaryStart){
                m = 0;
            }
        }
        else {
            if(mainIndex  < this._lines.length - 1 && ((current[main] + current[mainDim]) > (controlPoint * -1 + (boundary - scrollOffsetEnd)))) {
                m = (boundary - scrollOffsetEnd) - (current[main] + current[mainDim]);
            }
            else if(mainIndex === this._lines.length - 1 && (current[main] + current[mainDim]) >= boundary){
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