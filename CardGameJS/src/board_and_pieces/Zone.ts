class Zone extends GameObject {

    private _list: Collections.List<Card> = new Collections.List<Card>();


    onBeforeDelete: (zone: Zone, card: Card, idx: number) => boolean = null;
    onAfterDelete: (zone: Zone, card: Card, idx: number) => void = null;

    onBeforeAdd: (zone: Zone, card: Card, idx: number) => boolean = null;
    onAfterAdd: (zone: Zone, card: Card, idx: number) => void = null;

    onBeforeMove: (zone: Zone, card1, card2: Card, idx1, idx2: number) => boolean = null;
    onAfterMove: (zone: Zone, card1, card2: Card, idx1, idx2: number) => void = null;

    


    /**
     *  add
     */
    add(card: Card): number {
        if (this.onBeforeAdd === null
            || this.onBeforeAdd(this, card, this._list.length())) {
            var idx = this._list.add(card);

            this.onAfterAdd === null
            || this.onAfterAdd(this, card, idx);

            return idx;
        } 
    };



    /**
     *  addAt
     */
    addAt(card: Card, idx: number): number {
        var tmpIdx = Math.min(Math.max(idx, 0), this.length() + 1);

        if (this.onBeforeAdd === null
            || this.onBeforeAdd(this, card, tmpIdx))
        {
            var tmpIdx2 = this._list.addAt(card, tmpIdx);

            if (tmpIdx != tmpIdx2)
                throw new Error('tmpIdx (' + tmpIdx + ') != tmpIdx2 (' + tmpIdx2 + ')');

            this.onAfterAdd === null
            || this.onAfterAdd(this, card, tmpIdx);

            return tmpIdx;
        }

        return -1;
    }



    /**
     *  length
     */
    length(): number {
        return this._list.length();
    };



    /**
     *  get
     */
    get(idx: number): Card {
        return this._list.get(idx);
    };



    /**
     *  delete
     */
    delete(idx: number): void {
        var card: Card = this.get(idx);

        if (this.onBeforeDelete === null
            || this.onBeforeDelete(this, card, idx))
        {
            this._list.delete(idx);

            this.onAfterDelete === null
            || this.onAfterDelete(this, card, idx);
        }
    };



    /**
     *  silenceRemove
     */
    silenceRemove(idx: number): Card {
        var card: Card = this.get(idx);
        this._list.delete(idx);
        return card;
    }



    /**
     *  move
     */
    move(oldIdx, newIdx: number): { card1: Card, card2: Card } {
        var card1: Card = this.get(oldIdx);
        var card2: Card = this.get(newIdx);

        if  (this.onBeforeMove === null
            || this.onBeforeMove(this, card1, card2, oldIdx, newIdx))
        {
            this._list[newIdx] = card1;
            this._list[oldIdx] = card2;

            this.onAfterMove === null
            || this.onAfterMove(this, card1, card2, oldIdx, newIdx);

            return {"card1": card1, "card2": card2};
        }
    }



    /**
     *  silenceClear
     */
    silenceClear(): void {
        this._list.clear();
    };



    /**
     *  forEach
     */
    forEach(callbackfn: (value: Card, index: number, array: Card[]) => void, thisArg?: any): void {
        this._list.forEach(callbackfn, thisArg);
    };
}