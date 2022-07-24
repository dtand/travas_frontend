import React from "react";
import NotificationController from "./NotificationController"
import SessionManager from './SessionManager';
const EXCEPTION_CODE    = "9999";
const NO_SESSION_CODE   = "9998";
const PARAM_CACHE_RESET = 1;
let NotificationSystem  = require('react-notification-system');

let server     = "";
const hostname = window && window.location && window.location.hostname;

if(hostname === "platform.travas.io") {
    server = "https://platform.travas.io/";
} 
else if(hostname === "platform.travas.io") {
    server = "https://platform.travas.io/";
} 
else {
    server = "https://platform.travas.io/";
}

let ParameterTimeoutCache = {

    cache: new Map(),

    processingRequest: function(endpoint,params){
        return this.cache.get(endpoint+JSON.stringify(params));
    }, 

    addRequest: function(endpoint,params){
        const timestamp = Math.round(new Date().getTime() / 1000);
        this.cache.set(endpoint+JSON.stringify(params),timestamp);
    }
}

setInterval( 
    function(){
        for (const k of ParameterTimeoutCache.cache.keys()) {
            const now  = Math.round(new Date().getTime() / 1000);
            const then = ParameterTimeoutCache.cache.get(k);
            if(now - PARAM_CACHE_RESET > then){
                ParameterTimeoutCache.cache.delete(k);
            }
        }    
    }, 
    1000
);

const ApiUtils = {  

    server: server,

    checkCorsStatus: function(response) {
      if (response.ok) {
        return response;
      } else {
        return new Error(response.statusText);
      }
    },

    checkWebserviceStatus: function(data){
        
        if(data.success) {
            return data;
        }

        else {
            if(data.code === NO_SESSION_CODE || 
               data.message.includes("Session inactive")){
                window.location.href="login";
            }
            else if(data.code === EXCEPTION_CODE) {
                NotificationController.displayNotification("FATAL ERROR",data.message,"error");
            }
            else{
                NotificationController.displayNotification("ERROR",data.message,"error");
            }
            return false;
        }
    },

    generateURL: function(endpoint){
        return this.server + "api/" + endpoint
    }
};

const ApiController = {

    server: server,

    doGet: function(endpoint, callback, callbackParams){
        return fetch(ApiUtils.generateURL(endpoint),  {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        })
        .then(ApiUtils.checkStatus)
        .then(response => response.json())
        .then(function(data){
            ApiUtils.checkWebserviceStatus(data);
            callback(data, callbackParams);
        })
        .catch(e => e)
    },

    doPost: function(endpoint, payload, callback, callbackParams, callbackError){
        if(ParameterTimeoutCache.processingRequest(endpoint,payload)){
            if(callbackError) {
                callbackError();
            }
            return;
        }
        ParameterTimeoutCache.addRequest(endpoint,payload);
        return fetch(ApiUtils.generateURL(endpoint),{
            method: "POST",
            headers:{
                "Accept": "application/json"
            },
            body: JSON.stringify(payload)
        })
        .then(ApiUtils.checkStatus)
        .then(response => response.json())
        .then(function(data){
            ApiUtils.checkWebserviceStatus(data,callbackError);
            if(data.success){
                callback(data, callbackParams);
            }
            else if(callbackError){ 
                callbackError(data);
            }
        })
        .catch(e => e)
    },

    doPostNoCache: function(endpoint, payload, callback, callbackParams, callbackError){
        return fetch(ApiUtils.generateURL(endpoint),{
            method: "POST",
            headers:{
                "Accept": "application/json"
            },
            body: JSON.stringify(payload)
        })
        .then(ApiUtils.checkStatus)
        .then(response => response.json())
        .then(function(data){
            ApiUtils.checkWebserviceStatus(data,callbackError);
            if(data.success){
                callback(data, callbackParams);
            }
            else if(callbackError){ 
                callbackError(data);
            }
        })
        .catch(e => e)
    },

    doPostWithToken: function(endpoint, payload, callback, callbackParams, callbackError){
        payload.token = SessionManager.getSessionToken();
        return this.doPost(endpoint, payload, callback, callbackParams, callbackError)
    },

    doPostWithTokenNoCache: function(endpoint, payload, callback, callbackParams, callbackError){
        payload.token = SessionManager.getSessionToken();
        return this.doPostNoCache(endpoint, payload, callback, callbackParams, callbackError)
    },

};

export default ApiController;