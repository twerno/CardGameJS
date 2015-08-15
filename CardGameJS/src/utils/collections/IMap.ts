module Collections {

    export interface IMap<T> {
        put(key: string, val: T): void;

        get(key: string): T;

        contains(key: string): boolean;

        remove(key: string): void;

        clear(): void;
    }

}