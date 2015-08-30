///<reference path="../board/GameObjects.ts"/>

class Helper {

    static eq(obj1, obj2: Object): boolean {
        return obj1.constructor['name'] === obj2.constructor['name']
            && JSON.stringify(obj1) === JSON.stringify(obj2);
    }

    //static clone<T>(source: T): T {
    //    var result = {};
    //    for (var i in source) {
    //        if (source.hasOwnProperty(i)) {
    //            result[i] = source[i];
    //        }
    //    }
    //    return <T> result;
    //}

    static getInstance<T>(context: Object, name: string, ...args: any[]): T {
        var instance = Object.create(context[name].prototype);
        instance.constructor.apply(instance, args);
        return <T> instance;
    }
}
