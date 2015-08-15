"use strict";

interface FCallback {
	():void;
}

interface FStringCalback {
	(data: string):void;
}

interface FErrorCalback {
	(error: Object)
}

class ErrorImpl implements Error {
	name: string;
    message: string;
    
    constructor(message: string) {
    	this.message = message;
    }
}

function randomString(length: number): string {
	return Math.random().toString(36).substr(-length);
}