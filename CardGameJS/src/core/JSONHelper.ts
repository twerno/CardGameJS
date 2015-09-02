interface IIdObject {
    id: string;
}

interface IJSONSerializable {
    jsonMetaMap(): IJSONMetaMap;
}


type JSONCustomSerializator = (obj: Object) => string;



enum IJSONSrializationMethod {
    MAP,
    MAP_OF_REFS,
    MAP_OF_ARRAYS_OF_REFS,
    ARRAY,
    ARRAY_OF_REFS,
    NATIVE,
    REF
}


interface IJSONMetaMap {
    [key: string]: IJSONSrializationMethod|JSONCustomSerializator;
}


class JSONHelper {

    static serializer: JSONHelper = new JSONHelper();

    static toJSON(obj: IJSONSerializable): string {
        return JSONHelper.serializer.toJSON(obj, obj.jsonMetaMap());
    }


    toJSON(obj: Object, metaMap: IJSONMetaMap): string {

        var result: string[] = [];

        for (var key in metaMap) {
            result.push(this.jsonObject(key, this.toJSONByMethod(obj[key], metaMap[key])));
        }

        return '{' + result.join(',') + '}';
    }

    toJSONByMethod(obj: Object, method: IJSONSrializationMethod|JSONCustomSerializator): string {

        if (obj === null
            || obj === undefined) {
            return this.toJSONObject(obj);
        }

        else if (typeof method === 'function') {
            return (<JSONCustomSerializator>method)(obj);
        }

        else if (method === IJSONSrializationMethod.NATIVE
            || method === IJSONSrializationMethod.ARRAY
            || method === IJSONSrializationMethod.MAP) {
            return this.toJSONObject(obj);

        }

        else if (method === IJSONSrializationMethod.REF) {
            return this.toJSONRef(obj);
        }

        else if (method === IJSONSrializationMethod.MAP_OF_REFS) {
            return this.toJSONMapOfRefs(obj);
        }

        else if (method === IJSONSrializationMethod.ARRAY_OF_REFS) {
            return this.toJSONArrayOfRefs(obj);
        }

        else if (method === IJSONSrializationMethod.MAP_OF_ARRAYS_OF_REFS) {
            return this.toJSONMapOfArraysOfRefs(obj);
        }

        else {
            throw new Error('Unknown IJSONSrializationMethod: ' + method);
        }
    }


    toJSONObject(obj: Object): string {
        return JSON.stringify(obj);
    }


    toJSONMapOfRefs(obj: Object): string {
        var result: string[] = [];
        result.push(this.jsonString('__type', 'refsMap'));

        var map: string[] = [];
        for (var key in obj) {
            map.push(this.jsonObject('key', this.toJSONRef(obj[key])));
        }

        result.push(this.jsonObject('map', '{' + map.join(',') + '}'));

        return '{'+ result.join(',') + '}';
    }


    toJSONArrayOfRefs(array: Object): string {
        var result: string[] = [];
        result.push(this.jsonString('__type', 'refsArray'));

        var list: string[] = [];
        for (var key in array) {
            list.push(this.jsonObject('key', this.toJSONRef(array[key])));
        }

        result.push(this.jsonObject('array', '{' + list.join(',') + '}'));

        return '['
            + result.join(',')
            + ']';
    }


    toJSONMapOfArraysOfRefs(obj: Object): string {
        var result: string[] = [];
        result.push(this.jsonString('__type', 'refsListMap'));

        var map: string[] = [];
        for (var key in obj) {
            map.push(this.jsonObject('key', this.toJSONArrayOfRefs(obj[key])));
        }

        result.push(this.jsonObject('map', '{' + map.join(',') + '}'));

        return '{'
            + result.join(',')
            + '}';
    }


    toJSONRef(obj: Object): string {
        if (obj['id'] === undefined
            && typeof obj['id'] != 'string')
            throw new Error('Object ' + obj.constructor['name'] + ' is not a IRefJSON type.');

        var result: string[] = [];
        result.push(this.jsonString('__type', obj.constructor['name']));
        result.push(this.jsonString('__refId', obj['id']));

        return '{' + result.join(',') + '}';
    }


    private jsonString(key, val: string): string {
        return JSON.stringify(key) + ':' + JSON.stringify(val);
    }

    private jsonObject(key: string, val: string): string {
        return JSON.stringify(key) + ':' + val;
    }
}