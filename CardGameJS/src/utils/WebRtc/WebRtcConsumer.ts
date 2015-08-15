///<reference path="../../../lib/RTCPeerConnection.d.ts"/>
///<reference path="WebRtcCommons.ts"/>

"use strict";

class WebRtcConsumer {
	private _id : string;
	private _debugMode : boolean = true;
	private _successCalled : boolean = false;

    private connection: RTCPeerConnection = null;
    private channel: RTCDataChannel = null;

    private _onPassDataToPeer   : IWebRtcConnectionDataCallback = null;
    private _onConnectionSucces : () => void              = null;
    private _onConnectionError  : (error: Object) => void = null;
	private _onMessageCallback  : (text: string) => void  = null;
	
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
        onConnectionSucces: () => void, onConnectionError: (error: Object) => void,
        onMessageCallback: (text: string) => void): void {
		
    	this._onPassDataToPeer   = onPassDataToPeer;
    	this._onConnectionSucces = onConnectionSucces;
    	this._onConnectionError  = onConnectionError;
    	this._onMessageCallback  = onMessageCallback;
	}
	
	
	
	/** 
	 *  isConnected
	 */  
    isConnected(): boolean {
		return this.connection != null 
            && (this.connection.iceConnectionState === 'completed' //RTCIceConnectionState.completed
                || this.connection.iceConnectionState === 'connected') // O_o  
            && this.channel != null
            && this.channel.readyState === 'open'; //RTCDataChannelState.open    	
    }


    
    /**
     *  configure
     */
	configure(data: IWebRtcConnectionData): void {
		
		var self = this;
		
		// step 1
		if (data['RTCSessionDescription'] != undefined) {

			if (this._debugMode) 
				this.log('configure - Step1', data);

	        this.connection.setRemoteDescription(data['RTCSessionDescription']);
	        this.connection.createAnswer(
	        	function(sdp: RTCSessionDescription): void {
    				if (self._debugMode)
						self.log('onAnswerCreated', sdp);

			        self.connection.setLocalDescription(sdp);
			        self._onPassDataToPeer({'RTCSessionDescription': sdp});
				},
				function (errorInformation: DOMError): void {
        			console.error('onOfferError', errorInformation);
    			});
    	} else 

		// step 2
		if (data['RTCIceCandidate'] != undefined) {

			if (this._debugMode)
				this.log('configure - Step2', data);    		

    		this.connection.addIceCandidate(data['RTCIceCandidate'],
                function(): void {
					if (self._debugMode)
						self.log('onAddIceCandidateSuccess');
				},
				function (error): void {
					if (self._debugMode)
						self.log('onAddIceCandidateError');
				});
		} else
			throw new Error('no "RTCSessionDescription" or "RTCIceCandidate" in data object');
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
			//this.connection = new mozRTCPeerConnection( this.config ); 
		} else 
			throw new Error('unknown implementation of RTCPeerConnection');
		
		this._successCalled = false;
		this.internalInit();
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
    private internalInit() {

   		this.connection.ondatachannel = 
			function (event: Event): void {
				if (this._debugMode)
					this.log('onReceiveChannel', event['channel']);

		        this.channel = event['channel'];
        		this.channel.onmessage = this.onReceiveMessage;
        		this.channel.onopen    = this.onReceiveChannelStateChange;
        		this.channel.onclose   = this.onReceiveChannelStateChange;
    		}.bind(this);

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
					this.log('onIceConnectionStateChange: ' +this.connection.iceConnectionState +' [connected: '+this.isConnected() +']', event);
				

				this.tryCallSuccess();
    		}.bind(this);
    }
    
    
    
    /**
     *  onReceiveMessage
     */
    private onReceiveMessage = function(event: RTCMessageEvent): void {
		if (this._debugMode)
    		this.log('onReceiveMessage' +event['data'], event);

    	this._onMessageCallback(event['data']);
    }.bind(this);
    
    
    
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
	private log(msg: string, ...optionalParams: any[]) {
		if (!this._debugMode)
			throw new Error('Debug mode is disabled.');		
		
		var arr : any[] = [this.dbgId() +' ' +msg].concat(optionalParams);
		console.log.apply(console, arr);
		document.writeln(this.dbgId() +' ' +msg +' ' +this.connectionState() +'<br>');
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
    	return '[' +(this._id != '' ? this._id +' ' : '')  +'consumer]';
    }
}