module Collections { 

    export class List<T> implements IList<T> {

        _list: Array<T>  = [];


        /**
         *  add
         */
        add(val: T): number {
            return this._list.push(val);
        };



        /**
         *  addAt
         */
        addAt(val: T, idx: number): number {
            if (idx >= this.length()) {
                return this._list.push(val);
            } else {
                var tmpIdx = Math.min(Math.max(idx, 0), this.length());

                var listTmp: Array<T> = this._list.splice(0, tmpIdx);
                listTmp.push(val);
                this._list.splice(tmpIdx, this._list.length).forEach(
                    function (value: T, idx: number) {
                        listTmp.push(value);
                    });
                this._list = listTmp;
                return tmpIdx;
            }
        }



        /**
         *  addMany
         */
        addMany(arr: Array<T>): void {
            for (var val in  arr)
                this.add(val);
        }



        /**
         *  length
         */
        length(): number {
            return this._list.length;
        };



        /**
         *  get 
         */
        get(idx: number): T {
            return this._list[idx] || null;
        };



        /**
         *  delete 
         */
        delete(idx: number): void {
            this._list.splice(Math.min(0, idx));
        };



        /**
         *  clear 
         */
        clear(): void {
            this._list = [];
        }



        /**
         *  forEach 
         */
        forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void {
            this._list.forEach(callbackfn, thisArg);
        }
    }

}