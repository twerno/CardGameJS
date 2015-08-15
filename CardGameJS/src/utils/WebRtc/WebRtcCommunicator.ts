///<reference path="../../../lib/RTCPeerConnection.d.ts"/>
///<reference path="WebRtcCommons.ts"/>
///<reference path="WebRtcProducer.ts"/>
///<reference path="WebRtcConsumer.ts"/>
	
"use strict";

class WebRtcCommunicator { 

	private DEFAULT_TIMEOUT : number = 5;

	private _id : string;
	private _debugMode : boolean = false;
    private _configureTimeout: number;
    private _timer: number;

	private _producer : WebRtcProducer;
	private _consumer : WebRtcConsumer;

	private _passConnectionData2Peer: FWebRtcCommunicatorDataCallback;
	private _onMessageCallback : FStringCalback;

    private _onConnectionSuccesCallback : () => void              = null;
    private _onConnectionErrorCallBack  : (error: Object) => void = null;


	/*
	 *  constructor
	 */
	constructor(servers: RTCIceServer[], configureTimeout?: number, _id?: string, _debugMode?: boolean) {
		this._id = _id||'';
		this._debugMode = _debugMode||false;
		this._configureTimeout = (configureTimeout||this.DEFAULT_TIMEOUT) * 1000;
		
		this._producer = new WebRtcProducer(servers, this._id, this._debugMode);
		this._consumer = new WebRtcConsumer(servers, this._id, this._debugMode);
	}



	/*
	 *  setCallbacks
	 */
	setCallbacks(passConnectionData2Peer: FWebRtcCommunicatorDataCallback,
        onConnectionSuccesCallback: () => void,
        onConnectionErrorCallback: (error: Object) => void,
        onMessageCallback: (text: string) => void): void {

		this._passConnectionData2Peer = passConnectionData2Peer;
		this._onConnectionSuccesCallback = onConnectionSuccesCallback;
		this._onConnectionErrorCallBack = onConnectionErrorCallback;
		this._onMessageCallback = onMessageCallback;


		this._consumer.setCallbacks(
			function(data: IWebRtcConnectionData): void {
				var newData : IWebRtcCommunicatorData = {'pass2': 'producer'};
				for (var key in data)
					newData[key] = data[key]; 
				this._passConnectionData2Peer(newData);
			}.bind(this),
			this._onConnectionSucces,
			this._onConnectionError,
			this._onMessageCallback);


		this._producer.setCallbacks(
			function (data: IWebRtcConnectionData): void {
				var newData : IWebRtcCommunicatorData = {'pass2': 'consumer'};
				for (var key in data)
					newData[key] = data[key]; 
				this._passConnectionData2Peer(newData);
			}.bind(this),
			this._onConnectionSucces,
			this._onConnectionError);
	}
	
	
	
	/*
	 *  open
	 */
    open(): void {
        clearTimeout(this._timer);
		this._producer.open();
		this._consumer.open();
	}
	
	
	
	/*
	 *  close
	 */
    close(): void {
        clearTimeout(this._timer); 
		this._producer.close();
		this._consumer.close();
	}
	
	
	
	/*
	 *  close
	 */
	isConnected(): boolean {
		return this._producer != null 
			   && this._producer.isConnected()
			   && this._consumer != null 
		       && this._consumer.isConnected();
	}
	
	
	
	/*
	 *  configure
	 */
	configure(data: IWebRtcCommunicatorData): void {
		if (data === null || data['pass2'] === 'producer') {
		
            if (data === null)
                this._timer = setTimeout(function () {
					if (!this.isConnected()) {
						this._onConnectionError(new EWebRtcConfigureTimeout('configure timeout'));
					}
				}.bind(this), 
				this._configureTimeout);
		
			this._producer.configure(data);

		} else if (data['pass2'] === 'consumer')
			this._consumer.configure(data);
		else
			throw Error('no "pass2" in data object');
	}
	
	
	
	/*
	 *  sendMessage
	 */
	sendMessage(msg: string) {
		this._producer.sendMessage(msg);
	}



	/*
	 *  _onConnectionError
	 */
	private _onConnectionError = function(error: Error): void {
		if (this._debugMode)
            this.log(error.message, error);
        this.close();
		this._onConnectionErrorCallBack(error);
	}.bind(this);
	
	
	
	/*
	 *  _onConnectionSucces
	 */
	private _onConnectionSucces = function():void {
		if (this.isConnected())
			this._onConnectionSuccesCallback();
	}.bind(this);
	
	
	
	/** 
	 *  log
	 */
	private log(msg: string, ...optionalParams: any[]) {
		var arr : any[] = [this._id +' ' +msg].concat(optionalParams);
		console.log.apply(console, arr);
		document.writeln(this._id +' ' +msg +'<br>');
	}
}