module Collections {

    export class Map<T> implements IMap<T> {

        _map: Object = {};

        put(key: string, val: T): void {
            this._map[key] = val;
        }

        get(key: string): T {
            return this._map[key] || null;
        }

        contains(key: string): boolean {
            return this._map.hasOwnProperty(key);
        }

        remove(key: string): void {
            this._map[key] = null;
        }

        clear(): void {
            this._map = {};
        }

        forEach(callbackfn: (value: T, key: string) => void): void {
            for (var key in this._map)
                callbackfn(this._map[key], key);
        }
    }

}