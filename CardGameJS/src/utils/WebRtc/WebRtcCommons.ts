///<reference path="../../../lib/RTCPeerConnection.d.ts"/>
///<reference path="../CommTypy.ts"/>
	
"use strict";

interface IWebRtcConnectionData {
	RTCSessionDescription? : RTCSessionDescription;
	RTCIceCandidate?       : RTCIceCandidate;
}



interface IWebRtcConnectionDataCallback {
	(data: IWebRtcConnectionData): void;
}



class WebRtcConnectionInitializationError extends ErrorImpl {

	constructor (message: string) {
		super(message);
		this.name = 'WebRtcConnectionInitializationError';
	}
}



class WebRtcConnectionNotInitializedError extends ErrorImpl {

	constructor (message: string) {
		super(message);
		this.name = 'WebRtcConnectionNotInitializedError';
	}
}



interface IWebRtcCommunicatorData extends IWebRtcConnectionData {
	pass2 : string;
}



interface FWebRtcCommunicatorDataCallback {
	(data: IWebRtcCommunicatorData): void;
}



class EWebRtcConfigureTimeout extends ErrorImpl {};