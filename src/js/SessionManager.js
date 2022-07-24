
const SessionManager = {

    updateSession: function(sessionToken) {
        if (typeof(Storage) !== "undefined") {
            window.sessionStorage.setItem("travasSessionToken", sessionToken);
            window.localStorage.setItem("travasSessionToken", sessionToken);
        } else {
            alert("Sorry! No Web Storage support");
        }
    },

    getSessionToken: function(){
        return window.sessionStorage.travasSessionToken ?
               window.sessionStorage.travasSessionToken :
               window.localStorage.travasSessionToken 
    },

    endSession: function(){
        if (typeof(Storage) !== "undefined") {
            window.sessionStorage.setItem( "travasSessionToken", "" );
            window.localStorage.setItem( "travasSessionToken", "" );
        }
        else{
            alert("Sorry! No Web Storage support");
        }
    }
}

export default SessionManager;