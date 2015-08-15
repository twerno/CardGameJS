///<reference path="../../../lib/RTCPeerConnection.d.ts"/>
///<reference path="WebRtcCommons.ts"/>

"use strict";

class WebRtcProducer {
	private _id : string;
	private _debugMode : boolean = false;
	private _successCalled : boolean = false;

    private connection: RTCPeerConnection = null;
    private channel: RTCDataChannel = null;

    private _onPassDataToPeer   : IWebRtcConnectionDataCallback = null;
    private _onConnectionSucces : () => void                    = null;
    private _onConnectionError  : (error: Object) => void       = null;

	private _config: any = null;
	
	/** 
	 *  constructor
	 */  
    constructor(servers: RTCIceServer[], _id?: string, _debugMode?: boolean) {

		this._id        = _id;
		this._debugMode = _debugMode||false;

		if (servers != null)
			this._config = { "iceServers": servers };
    }


	/** 
	 *  setCallbacks
	 */  
	setCallbacks(onPassDataToPeer: IWebRtcConnectionDataCallback, 
        onConnectionSucces: () => void, onConnectionError: (error: Object) => void): void {
		
    	this._onPassDataToPeer   = onPassDataToPeer;
    	this._onConnectionSucces = onConnectionSucces;
    	this._onConnectionError  = onConnectionError;
	}



	/** 
	 *  isConnected
	 */  
    isConnected(): boolean {
		return this.connection != null 
            && (this.connection.iceConnectionState === 'completed' //RTCIceConnectionState.completed
                || this.connection.iceConnectionState === 'connected')
            && this.channel != null
            && this.channel.readyState === 'open' ; //RTCDataChannelState.open    	
    }

 
    
    /** 
	 *  configure
	 */
	configure(data: IWebRtcConnectionData): void {
		
		var self = this;
		
		// step 1
		if (data === null) {
			
			if (this._debugMode)
				self.log('configure - Step1', data);
				
			this.connection.createOffer(
				function(sdp: RTCSessionDescription): void {
    				if (self._debugMode)
						self.log('onOfferCreated', sdp);

			        self.connection.setLocalDescription(sdp, null);
			        self._onPassDataToPeer({'RTCSessionDescription': sdp});
				},
				function (errorInformation: DOMError): void {
        			console.error('onOfferError', errorInformation);
    			});
		} else

		// step 2
    	if (data['RTCSessionDescription'] != undefined) {

			if (this._debugMode)
				this.log('configure - Step2', data);

    		this.connection.setRemoteDescription(data['RTCSessionDescription']);
    	} else
    	
    	// step 3
		if (data['RTCIceCandidate'] != undefined) {

			if (this._debugMode)
				this.log('configure - Step3', data);    		

    		this.connection.addIceCandidate(data['RTCIceCandidate'],
    			function(): void {
					if (self._debugMode)
						self.log('onAddIceCandidateSuccess');
				},
				function (error): void {
					if (self._debugMode)
						self.log('onAddIceCandidateError');
				});
		}
	}
	


	/** 
	 *  sendText
	 */  
    sendMessage(msg: string): void {

		if (this._debugMode)
			this.log('Sending message: "' +msg +'"'); 

    	if (!this.isConnected())
    		throw new WebRtcConnectionNotInitializedError('');

		this.channel.send(msg);
    }
    
    
    
	/** 
	 *  open
	 */
	open(): void{
		if (this._debugMode)
			this.log('Creating new; iceServers: ' +JSON.stringify(this._config));
		
		if (typeof webkitRTCPeerConnection === 'function') {
			this.connection = new webkitRTCPeerConnection( this._config );	
		} else if (typeof mozRTCPeerConnection === 'function') {
			throw new Error('Not implemented yet.');
			//this.connection = new mozRTCPeerConnection( this._config ); 
		} else 
			throw new Error('unknown implementation of RTCPeerConnection');
		
		this.internalInit();
		this._successCalled = false;
	}


	/** 
	 *  close
	 */
	close(): void{
		this._successCalled = false;
		
		if (this.channel != null)
			this.channel.close();

		if (this.connection != null)
			this.connection.close();
	}


	/** 
	 *  internalInit
	 */  
    private internalInit(): void {
    	
    	this.channel = this.connection.createDataChannel('label', null);
		this.channel.onopen  = this.onReceiveChannelStateChange;
		this.channel.onclose = this.onReceiveChannelStateChange;
    	

		this.connection.onicecandidate = 
			function(event: RTCIceCandidateEvent): void {
        		if (event.candidate) {

	    			if (this._debugMode)
						this.log('onIceCandidate', event.candidate);

        			this._onPassDataToPeer({'RTCIceCandidate': event.candidate});
        		}

				this.tryCallSuccess();
			}.bind(this);
		

		this.connection.oniceconnectionstatechange = 
			function(event: Event): void {
				
				if (this._debugMode)
					this.log('onIceConnectionStateChange: ' +this.connection.iceConnectionState, event);
				
				this.tryCallSuccess();
    		}.bind(this);    	
    }



    /**
     *  onReceiveChannelStateChange
     */
    private onReceiveChannelStateChange = function(event: Event): void {
    	if (this._debugMode)
    		this.log('onReceiveChannelStateChange', event);
    	
		this.tryCallSuccess();
    }.bind(this);



    /**
     *  tryCallSuccess
     */
    private tryCallSuccess = function(): void {
		if (!this._successCalled && this.isConnected()) {
			if (this._debugMode)
				this.log('triggering onConnectionSucces callback');

			this._successCalled = true; 
			this._onConnectionSucces();
		}
    }.bind(this);


	/** 
	 *  log
	 */
    private log(msg: string, ...optionalParams: Object[]) {
		if (!this._debugMode)
			throw new Error('Debug mode is disabled.');

        var arr: Object[] = new Array<Object>().concat(this.dbgId() + ' ' + msg).concat(optionalParams);
		console.log.apply(console, arr);
		document.writeln(this.dbgId() +' ' +msg  +' ' +this.connectionState() +'<br>');
	}
	
	
	
	/** 
	 *  connectionState
	 */
	private connectionState(): string {
		return '<b>[connected: '+this.isConnected() +']</b> '
		      +'connection.iceConnectionState: '+ (this.connection === null ? 'null' : this.connection.iceConnectionState) +'; '
		      +'connection.iceGatheringState: '+ (this.connection === null ? 'null' : this.connection.iceGatheringState) +'; '
		      +'connection.signalingState: '+ (this.connection === null ? 'null' : this.connection.signalingState) +'; '
		      +'channel.readyState: '+ (this.channel === null ? 'null' : this.channel.readyState);
	}	



	/** 
	 *  dbgId
	 */  
    private dbgId(): string{
    	return '[' +(this._id != '' ? this._id +' ' : '')  +'producer]';
    }
}
