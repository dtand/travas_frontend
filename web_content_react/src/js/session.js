 /**
 * Update session token on login
 * @param sessionToken
 * @param authenticated
 * @returns
 */
export function updateSession( sessionToken ) {
	
	if (typeof(Storage) !== "undefined") {
		window.sessionStorage.setItem("travasSessionToken", sessionToken);
	} else {
	    console.log("Sorry! No Web Storage support");
	}
}

/**
 * Global function used to set the user's AVI, looks for default
 * avi if avi does not exist
 * @returns
 */
// function setUserAvi( ){
// 	const path 			= "userContent/" + globalSessionInit.userProfileResponse.username.toLowerCase() + ".png";
// 	const defaultPath	= "userContent/travaslogo.png"
// 	$.get(path)
//     .done(function() { 
//     		document.getElementById("avi").src = path;
//     }).fail(function() { 
//     		document.getElementById("avi").src = defaultPath;
//     })
// }

/**
 * @returns	the session token
 */
export function getSessionToken( ){
	return window.sessionStorage.travasSessionToken;
}

/**
 * Used for logging out
 */
export function endSession( ){
	if (typeof(Storage) !== "undefined") {
		window.sessionStorage.setItem( "travasSessionToken", "" );
	}
	else{
	    console.log("Sorry! No Web Storage support");
	}
}

/**
 * Encapsulation for Authenticated Endpoint, automatically grabs token for the user
 */
// let AuthenticatedEndpoint = function(){
	
// 	/**
// 	 * Set this if logging in - new session token
// 	 */
// 	this.login = false;
	
// 	/**
// 	 * Redirection - used when session is inactive to return to login
// 	 */
// 	this.redirect = document.location.href;
	
// 	/**
// 	 * Did this endpoint fail because of inactive session?
// 	 */
// 	this.sessionIsActive = false;
	
// 	/**
// 	 * Internal setting for json response
// 	 */
// 	this.response;
	
// 	/**
// 	 * Perform a request given a json object of parameters and endpoint URL
// 	 */
// 	this.doRequest = function( params, endpoint, async, callback, callbackParams ){
		
// 		//Grab session token
// 		let token = getSessionToken( );
		
// 		//User does not have a session token (ignore if logging in) - redirect to login
// 		if( !this.login && token === undefined ){
// 			document.location.href = Constants.getInstance( ).login;
// 			return false;
// 		}
		
// 		params.token = token;
		
// 		//Hit authenticated endpoint
// 		this.sendRequest( params, endpoint, async, callback, callbackParams );
		
// 		//Session is active
// 		if( this.sessionIsActive ){
// 			return this.response;
// 		}
		
// 		//Session is inactive
// 		else{
// 			document.location.href = this.redirect;
// 			return false;
// 		}
// 	}
	
// 	/**
// 	 * Sends a request for authenticated endpoint - always a 'POST'
// 	 */
// 	this.sendRequest = function(params, endpoint, passedAsync, callback, callbackParams){
	
// 		let noSession = false;
// 		let response  = {};
// 		let redirect  = document.location.href;
		
// 		$.ajax({
// 	            type: 'POST',
// 	            url: endpoint,
// 	            data: JSON.stringify( params ),
// 	            dataType: "json",
// 	            contentType: "application/json",
// 	            mimeType: 'application/json',
// 	            async: passedAsync === undefined ? false : passedAsync,
// 	            cache: false,
// 	            timeout: 180000,
// 	            success: function( obj ) 
// 	            {
// 	            		response = obj;
	            		
// 	            	//Failed because user is not authenticated
// 	           		if( !obj.success && obj.message != undefined && obj.message.includes("Session inactive") ) {
// 	           			redirect  = obj.redirect;
// 	              		noSession = true;
// 	            	}
	           		
// 	           		//Succeeded or failed, but the session is active
// 	                else {
//                 		if( callback ){
//                 			callback(response, callbackParams);
//                 		}
// 	                }
// 	    		}
// 	        }  
// 		);
		
// 		//Udpdate state
// 		this.sessionIsActive = !noSession;
// 		this.response        = response;
// 		this.redirect        = redirect;
// 		return false;
// 	}
// }

/**
 * Encapsulation for Authenticated Endpoint, automatically grabs token for the user
 */
// let UnauthenticatedEndpoint = function(){
	
// 	/**
// 	 * Internal setting for json response
// 	 */
// 	this.response;
	
// 	/**
// 	 * Perform a request given a json object of parameters and endpoint URL
// 	 */
// 	this.doRequest = function( action, params, endpoint, async ){
		
// 		//Perform the request
// 		this.sendRequest( action, params, endpoint );
		
// 		//Return the response
// 		return this.response;
// 	}
	
// 	/**
// 	 * Performs an API call that does not require a session token
// 	 */
// 	this.sendRequest = function( action, params, endpoint, passedAsync ){

// 		let response = null;
		
// 		let ajaxObject = {
// 	            type: action,
// 	            url: endpoint,
// 	            dataType: "json",
// 	            contentType: "application/json",
// 	            mimeType: 'application/json',
// 	            async:  passedAsync === undefined ? false : passedAsync,
// 	            cache: false,
// 	            timeout: 180000,
// 	            success: function( obj ) {
// 	            	response = obj;
// 	    		}
	        
// 		}
		
// 		//Add additional field
// 		if( action === "POST" ){
//             ajaxObject.data = JSON.stringify( params );
// 		}
		
// 		//Do request
// 		$.ajax( ajaxObject );
		
// 		this.response = response;
// 	}
// }

/**
 * Called at the beginning of every single page before loading anything, 
 * firstly to ensure a session token exists, secondly to init username and 
 * picture on the left side panel
 */
// let globalSessionInit = {
// 		userProfileEndpoint : new AuthenticatedEndpoint( ),
// 		userProfileResponse: null
// }

// /**
//  * If user already has active session - init globals also auto redirect
//  */
// globalSessionInit.userProfileResponse = globalSessionInit.userProfileEndpoint.doRequest( {}, Constants.getInstance( ).userProfileURL, false );

