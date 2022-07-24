import * as SockJS from "sockjs-client";
import * as Stomp from "stompjs";

if (!String.prototype.format) {
    String.prototype.format = function() {
      var args = arguments;
      return this.replace(/{(\d+)}/g, function(match, number) { 
        return typeof args[number] != 'undefined'
          ? args[number]
          : match
        ;
      });
    };
}

let botServer  = "";
const hostname = window && window.location && window.location.hostname;


/**
 * Returns URL with server id appended to bypass
 * the load balancer.
 */
let generateServerURL = function(serverId){

    //PROD
    if(hostname === "platform.travas.io") {
        botServer = "https://prod" + (serverId+1) + "-platform.travas.io:2053/socket";
    } 

    //STG
    else if(hostname === "stg-platform.travas.io") {
        botServer = "https://stg" + (serverId+1) + "-platform.travas.io:2053/socket";
    } 

    //LOCAL
    else {
        botServer = "https://stg" + (serverId+1) + "-platform.travas.io:2053/socket";
    }

    return botServer;
}

/**
 * Currently connected to socket
 */
let connected = null;

/**
 * Stomp Client Object, used for subscriptions
 */
let stompClient = null;


/**
 * Web Socket object which encapsulates connetion and subscription functions
 */
let WebSocket = {

    /**
     * Connect wrapper to form socket URL for bot engine
     */
    connectBotEngine: (message,onConnectCallback,serverId) => {
        if(connected){
            return;
        }
        const serverURL = generateServerURL(serverId);
        let socket = new SockJS(serverURL);
        stompClient = Stomp.over(socket);
        stompClient.connect(
        message, 
        function (frame) {
            connected = true;
            onConnectCallback(stompClient);
        });
    },

    /**
     * Called to disconnect from socket
     */
    disconnect: () => {
        if (stompClient !== null) {
            stompClient.disconnect();
        }
        connected = false;
    },

    /**
     * Returns true/false if server is connected or not
     */
    isConnected: () => {
        return connected;
    }
}

export default WebSocket;