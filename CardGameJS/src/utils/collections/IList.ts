module Collections {

    export interface IList<T> {
        add(val: T): number;

        length(): number;

        get(idx: number): T;

        delete(idx: number): void;

        clear(): void;

        forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
    }

}