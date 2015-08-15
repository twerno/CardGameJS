///<reference path="../../../CardGameJS/dist/CardGameJS.d.ts"/>

"use strict";

var producer : WebRtcProducer = new WebRtcProducer([{ "url": "stun:stun.l.google.com:19302" }], '', true);
var consumer : WebRtcConsumer = new WebRtcConsumer([{ "url": "stun:stun.l.google.com:19302" }], '', true);
	
var doTest = function() {
	
	producer.close();
	consumer.close();
	
	producer.open();
	consumer.open();

	producer.setCallbacks(
		function(data: IWebRtcConnectionData):void {
			consumer.configure(data);
		},
		function():void {
			console.log('[producer] connected');
			producer.sendMessage('test from producer');
		},
		function(error: Object):void {
			console.error("[producer] ERROR", error);
		});
		
	consumer.setCallbacks(
		function(data: IWebRtcConnectionData):void {
			producer.configure(data);
		},
		function():void {
			console.log('[consumer] connected');
		},
		function(error: Object):void {
			console.error("[consumer] ERROR", error);
		},
		function(data: string){
			console.log("[consumer]", data);
		});
	
	producer.configure(null);
}

doTest();

setInterval(
	function(){
		if (!producer.isConnected()) {
			doTest();
		} 
 }, 2000);

