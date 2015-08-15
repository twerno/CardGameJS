///<reference path="../../../CardGameJS/dist/CardGameJS.d.ts"/>

"use strict";


//var server = [{ "url": "stun:dfnufbn5555555.com:13215gs" }];
//var server = [{ "url": "stun:stun.l.google.com:19302" }];
var server = [{ "url": "stun:stun.services.mozilla.com" }];
//var server = null;

var comm1 : WebRtcCommunicator = new WebRtcCommunicator(server, 10, 'comm1', true);
var comm2 : WebRtcCommunicator = new WebRtcCommunicator(server, 10, 'comm2', false);
	
var doConnect = function() {
	 
	comm1.close();
	comm2.close();
	
	comm1.open();
	comm2.open();

	comm1.setCallbacks(
		function(data: IWebRtcCommunicatorData):void {
			comm2.configure(data);
		},
		function():void {
			comm1.sendMessage('test from comm1');
		},
		function(error: Object):void {
			console.error("[comm1] ERROR", error);
		},
		function(message: string){
			document.write('[comm1] Recevied: "'+ message +'"<br>');
			console.log('[comm1] Recevied: "'+ message +'"', message);
		});
		
	comm2.setCallbacks(
		function(data: IWebRtcCommunicatorData):void {
			comm1.configure(data);
		},
		function():void {
			comm2.sendMessage('test from comm2');
		},
		function(error: Object):void {
			console.error("[comm2] ERROR", error);
		},
		function(message: string){
			document.write('[comm2] Recevied: "'+ message +'"<br>');
			console.log('[comm2] Recevied: "'+ message +'"', message);
		});
	
	comm1.configure(null);
	comm2.configure(null);
}

doConnect();

/* setInterval(
	function(){
		if (!comm1.isConnected() || !comm2.isConnected()) {
			doConnect();
		} 
 }, 2000); */

